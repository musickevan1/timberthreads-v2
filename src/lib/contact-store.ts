export const CONTACT_PREFIX = 'timberthreads:contact:v1:';
export const RETENTION_SECONDS = 30 * 24 * 60 * 60;
export const SAFE_RETRY_MS = 23 * 60 * 60 * 1000;
export const MAX_ATTEMPTS = 3;

export interface Inquiry {
  id: string;
  fingerprint: string;
  createdAt: number;
  name: string;
  email: string;
  message: string;
  from: string;
  to: string;
  notificationBody: string;
  notification: 'pending' | 'sending' | 'accepted' | 'failed' | 'review';
  attempts: number;
  firstAttemptAt?: number;
  leaseUntil?: number;
  providerId?: string;
  errorCode?: string;
}

// Conditional intake, quotas and expiry happen together; a lost response is safe to retry.
const intakeScript = `
local old = redis.call('GET', KEYS[1])
if old then
  local record = cjson.decode(old)
  if record.fingerprint ~= ARGV[2] then return {'conflict'} end
  return {'existing', old}
end
local ip = tonumber(redis.call('GET', KEYS[2]) or '0')
local total = tonumber(redis.call('GET', KEYS[3]) or '0')
if ip >= 5 or total >= 50 then return {'limited'} end
redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[3])
if redis.call('INCR', KEYS[2]) == 1 then redis.call('EXPIRE', KEYS[2], 3600) end
if redis.call('INCR', KEYS[3]) == 1 then redis.call('EXPIRE', KEYS[3], 86400) end
return {'created', ARGV[1]}
`;

// Persist the attempt before sending so a timeout or crashed worker cannot reset the clock.
const claimScript = `
local raw = redis.call('GET', KEYS[1])
if not raw then return nil end
local r = cjson.decode(raw)
local now = tonumber(ARGV[1])
if r.notification == 'accepted' or r.notification == 'failed' or r.notification == 'review' then return nil end
if r.leaseUntil and r.leaseUntil > now then return nil end
if r.attempts >= tonumber(ARGV[3]) or (r.firstAttemptAt and now - r.firstAttemptAt >= tonumber(ARGV[4])) then
  r.notification = 'review'
  redis.call('SET', KEYS[1], cjson.encode(r), 'KEEPTTL')
  return nil
end
r.firstAttemptAt = r.firstAttemptAt or now
r.attempts = r.attempts + 1
r.notification = 'sending'
r.leaseUntil = now + tonumber(ARGV[2])
redis.call('SET', KEYS[1], cjson.encode(r), 'KEEPTTL')
return cjson.encode(r)
`;

const finishScript = `
local raw = redis.call('GET', KEYS[1])
if not raw then return 0 end
local r = cjson.decode(raw)
if r.attempts ~= tonumber(ARGV[1]) or r.notification ~= 'sending' then return 0 end
r.notification = ARGV[2]
r.leaseUntil = nil
if ARGV[3] ~= '' then r.providerId = ARGV[3] end
if ARGV[4] ~= '' then r.errorCode = ARGV[4] else r.errorCode = nil end
redis.call('SET', KEYS[1], cjson.encode(r), 'KEEPTTL')
return 1
`;

export class InquiryStore {
  constructor(private url: string, private token: string, private fetcher: typeof fetch = fetch) {}

  private async command<T>(command: (string | number)[]): Promise<T> {
    const response = await this.fetcher(this.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), signal: AbortSignal.timeout(2000),
    });
    const data = await response.json() as { result?: T; error?: string };
    if (!response.ok || data.error || !('result' in data)) throw new Error('Contact storage unavailable');
    return data.result as T;
  }

  async accept(record: Inquiry, clientHash: string): Promise<{ outcome: string; record?: Inquiry }> {
    const result = await this.command<string[]>(['EVAL', intakeScript, 3,
      CONTACT_PREFIX + record.id, CONTACT_PREFIX + 'quota:' + clientHash, CONTACT_PREFIX + 'daily',
      JSON.stringify(record), record.fingerprint, RETENTION_SECONDS]);
    return { outcome: result[0], record: result[1] ? JSON.parse(result[1]) : undefined };
  }

  async claim(id: string, now: number): Promise<Inquiry | null> {
    const raw = await this.command<string | null>(['EVAL', claimScript, 1, CONTACT_PREFIX + id,
      now, 10000, MAX_ATTEMPTS, SAFE_RETRY_MS]);
    return raw ? JSON.parse(raw) : null;
  }

  async finish(record: Inquiry, state: Inquiry['notification'], providerId = '', errorCode = ''): Promise<void> {
    const updated = await this.command<number>(['EVAL', finishScript, 1, CONTACT_PREFIX + record.id,
      record.attempts, state, providerId, errorCode]);
    if (updated !== 1) throw new Error('Contact status update unavailable');
  }

  async get(id: string): Promise<Inquiry | null> {
    const raw = await this.command<string | null>(['GET', CONTACT_PREFIX + id]);
    return raw ? JSON.parse(raw) : null;
  }

  // Operator-only, bounded enumeration. No web endpoint exposes records.
  async list(): Promise<Inquiry[]> {
    let cursor = '0';
    const rows: Inquiry[] = [];
    for (let pages = 0; pages < 20; pages++) {
      const result = await this.command<[string, string[]]>(['SCAN', cursor, 'MATCH', CONTACT_PREFIX + '*', 'COUNT', 100]);
      cursor = String(result[0]);
      const keys = result[1].filter(key => /^[0-9a-f-]{36}$/.test(key.slice(CONTACT_PREFIX.length)));
      if (keys.length) {
        const values = await this.command<(string | null)[]>(['MGET', ...keys]);
        for (const value of values) if (value) rows.push(JSON.parse(value));
      }
      if (cursor === '0') return rows.sort((a, b) => b.createdAt - a.createdAt);
    }
    throw new Error('Inquiry list is too large; inspect the private database console');
  }
}
