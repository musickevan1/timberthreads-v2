# Contact intake activation and recovery

**Deployment is blocked until prerequisites are verified.** This replacement fails closed: deploying without enabled, valid storage and sender settings makes the currently available contact form return an actionable 503. The draft can be reviewed and its Preview built; neither proves production readiness. No production setup or live tests are included in this change.

## Owner decisions before any deployment/activation

1. Identify and approve the intended storage service. The proposed adapter uses Upstash, which is integrated in the legacy repository. No Supabase integration was found in either repository; if an existing Timber & Threads Supabase project is identified, review/adapt the proposal before activation. For Redis, confirm a current database exists, that v2 may store contact information there, and that its quota/capacity allows the proposed usage. Its locally configured legacy hostname failed a read-only DNS lookup. This is not evidence that reuse or extra capacity is free/approved. Creating another service/account/grant/credential or accepting a fee is a separate decision.
2. Confirm database eviction is **disabled**. Durable storage survives restarts; eviction at a database size limit can permanently remove records. Keep backups/export policy appropriate to the owner. No database/gallery configuration is changed by this PR.
3. Under the owner's control, configure server-only `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `OWNER_EMAIL` in v2. Confirm recipient is Sandra's intended mailbox. Confirm the From domain is verified and authorized in Resend. Syntax checks cannot verify DNS/domain ownership or inbox delivery. Domain/DNS or production-variable changes require separate approval. The currently denied Vercel session and send-only Resend key were not bypassed.
4. Enable `CONTACT_INTAKE_ENABLED=true` only once all prerequisites are verified. Preview tests must use a separate disposable database and mocked/test provider; never attach production contact storage or real sending credentials to unapproved Preview tests. A real delivery test needs explicit approval.

## Data and retention

Redis keys use `timberthreads:contact:v1:`; legacy `gallery` keys are untouched. A record contains only name, reply email, inquiry message, immutable sender/recipient and serialized notification payload, timestamps, request fingerprint, notification state/attempt count and optional provider ID/error category. No raw IP is stored. Quota keys contain an HMAC of client address (using the private storage token), a counter and one-hour expiry; global quota lasts 24 hours. No secrets or personal fields are written to application logs.

Inquiry records expire **30 days after acceptance**. Notification updates preserve the original TTL; retries do not extend retention. At the configured maximum of 50 new inquiries per rolling 24-hour quota window, at most roughly 1,500 retained records accumulate, excluding database overhead and any pre-existing records. Each capped message is at most 5,000 characters (up to ~20 KB UTF-8, plus JSON overhead), and that content is repeated in the frozen HTML/text notification payload. Allow roughly **100 KB per maximum-size record**, or on the order of **150 MB** for 1,500 records before Redis overhead; typical short inquiries will be much smaller. This is an estimate, not a capacity or fee guarantee. Check actual database quota before enabling. Shared IP quota is five new inquiries/hour; repeats of a saved request do not consume another slot. Shared connections and an exhausted site quota can block new inquiries; UI provides direct phone/email alternatives.

The browser keeps only its submitted draft and idempotency key in sessionStorage until durable acknowledgement or tab closure. If storage is unavailable, in-page retries still reuse the key; reload recovery cannot be guaranteed. There is no indefinite archive, database migration, scheduler, public inquiry list or new admin dashboard.

## Recovery without a dashboard

An owner with already authorized private database access can inspect the namespaced records in the Upstash console. Alternatively, from a trusted local checkout with development dependencies installed, load an owner-controlled, untracked environment file:

```sh
node --env-file=.env.recovery scripts/contact-inquiries.mjs --list
node --env-file=.env.recovery scripts/contact-inquiries.mjs --show REFERENCE_UUID
```

List output contains references/times/status/attempts/provider IDs only. `--show` intentionally displays private inquiry content: use a private terminal and protect/delete any exports; do not paste them in public issues or commit them. No HTTP GET inquiry-list endpoint exists. Read-only list/show operations need storage configuration only and remain available when intake is disabled or email settings are broken. Sending a retry additionally requires enabled, valid mail configuration. The tool uses existing authorized credentials; it does not grant access or create tokens.

Check pending/failed/review records regularly and **before 30-day expiry**. This bounded change retries transient notification failures at most twice during the visitor request, with at most three attempts total. There is no scheduled worker; requests left pending after a server interruption require owner review. A saved request can be acknowledged even when mail notification fails; the guest sees that warning and can call/email with its reference.

Only after separate live-email authorization, an owner can request a safe remaining retry:

```sh
node --env-file=.env.recovery scripts/contact-inquiries.mjs --retry REFERENCE_UUID --send
```

The explicit command may send a real email. It shares the same durable lease, attempt cap, immutable payload and Resend idempotency key as intake. Permanent rejections are retained for review, not blindly retried. Provider acceptance is stored as `accepted`; it does **not** mean delivered to Sandra's inbox. The first possible attempt time is saved before sending. Automatic attempts stop at 23 hours from that first attempt, earlier than Resend's 24-hour key retention. The browser also retains its draft creation timestamp; references older than 23 hours cannot be posted as new inquiries after a stored record expires. The owner must review an old uncertain draft instead of asking the guest to generate another reference. Old or exhausted ambiguous outcomes become `review`; do not generate a new key to bypass this safeguard. Verify provider/mailbox evidence before deciding how to follow up.

If a status write fails after Resend accepted mail, the inquiry remains durable and its notification may still show sending/pending. Retrying within the safe window uses the identical key/payload, preventing duplicate emails under Resend's documented guarantee. A crashed lease expires after 10 seconds. Configuration/key-account changes during recovery need owner review; no verification of the Resend account identity is implemented.

## Verification commands

```sh
npm ci
npm run check:contact
npm run build
npm test
```

The full browser suite serves built static output; all new form submissions are mocked. It does not execute live serverless storage or delivery. For integration testing, start a disposable local Redis (e.g. official `redis:7.4-alpine`, bound only to `127.0.0.1:46379`), then `npm run test:contact`. The REST bridge exercises the real Redis Lua operations while all email calls are mocked. Use a dedicated disposable test database: the fixture clears its contact daily quota key between tests. It never reads production credentials or clears gallery data. `CONTACT_TEST_REDIS_PORT` can select another **loopback test** port. No new production service is required to run these checks.

A contact-only typecheck is configured, not a full Astro application typecheck. Hosted Vercel build success is distinct from the local browser/integration test results. Preserve the merged 307 address and original map coordinates when reviewing this PR.
