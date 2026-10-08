import {test,after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {build} from 'esbuild';
import {startRedisBridge,redisCommand} from './redis-bridge.mjs';

const bundled=await build({entryPoints:['src/lib/contact.ts'],bundle:true,write:false,format:'esm',platform:'node',logLevel:'silent'});
const {createContactHandler,contactConfig,contactStorageConfig,notifyInquiry}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const sb=await build({entryPoints:['src/lib/contact-store.ts'],bundle:true,write:false,format:'esm',platform:'node',logLevel:'silent'});
const {InquiryStore,CONTACT_PREFIX,RETENTION_SECONDS,SAFE_RETRY_MS}=await import('data:text/javascript;base64,'+Buffer.from(sb.outputFiles[0].text).toString('base64'));
const bridge=await startRedisBridge();
after(()=>bridge.close());
beforeEach(async()=>{await redisCommand(['DEL',CONTACT_PREFIX+'daily']);});
const realFetch=globalThis.fetch;
const env={CONTACT_INTAKE_ENABLED:'true',UPSTASH_REDIS_REST_URL:'https://fixture.upstash.io',UPSTASH_REDIS_REST_TOKEN:'synthetic-storage-token',RESEND_API_KEY:'synthetic-mail-key',CONTACT_FROM_EMAIL:'contact@retreat.example',OWNER_EMAIL:'owner@example.test'};
const good={name:'Sandbox <Guest>',email:'guest@example.test',message:'Keep this inquiry & reply\nSecond line',website:''};
let storageFailure=false,finishFailure=false,claimFailure=false,provider='success',mail=[],time=1700000000000;
const fetcher=async(url,init)=>{
 if(String(url).startsWith(env.UPSTASH_REDIS_REST_URL)) {
  const command=JSON.parse(init.body);
  if(storageFailure)throw new Error('synthetic storage outage');
  if(finishFailure && command[0]==='EVAL' && command[2]===1 && typeof command[5]==='string')throw new Error('synthetic status outage');
  if(claimFailure && command[0]==='EVAL' && command[2]===1)throw new Error('synthetic claim outage');
  return realFetch(bridge.url,init);
 }
 assert.equal(String(url),'https://api.resend.com/emails','no live provider requests permitted');
 mail.push({key:init.headers['Idempotency-Key'],body:JSON.parse(init.body)});
 if(provider==='throw')throw new Error('synthetic provider outage');
 if(provider==='slow')await new Promise(resolve=>setTimeout(resolve,50));
 if(provider==='transient-once' && mail.length===1)return Response.json({message:'temporary'},{status:503});
 if(provider==='permanent')return Response.json({message:'rejected'},{status:403});
 if(provider==='malformed')return Response.json({},{status:200});
 if(provider==='outage')return Response.json({message:'temporary'},{status:503});
 return Response.json({id:'fixture-email-id'});
};
const handler=createContactHandler(env,{fetcher,now:()=>time,pause:async()=>{}});
const store=new InquiryStore(env.UPSTASH_REDIS_REST_URL,env.UPSTASH_REDIS_REST_TOKEN,fetcher);
function request(body=good,id=randomUUID(),headers={}) {return new Request('https://retreat.example/api/contact',{method:'POST',headers:{'content-type':'application/json',origin:'https://retreat.example','idempotency-key':id,'x-contact-created-at':String(time),...headers},body:JSON.stringify(body)});}
function reset(){storageFailure=false;finishFailure=false;claimFailure=false;provider='success';mail=[];time=1700000000000;}
async function submit(body=good,id=randomUUID()){const response=await handler(request(body,id),randomUUID());return {status:response.status,data:await response.json(),id};}

// Each test uses new client/reference keys; no command clears unrelated keys.
test('provider outage preserves a retrievable durable inquiry before acknowledging acceptance',async()=>{
 reset();provider='throw';const result=await submit();assert.equal(result.status,201);assert.equal(result.data.accepted,true);assert.equal(result.data.notification,'pending');
 const saved=await store.get(result.id);assert.equal(saved.message,good.message);assert.equal(saved.notification,'pending');assert.equal(saved.attempts,2);
 assert.equal(await redisCommand(['TTL',CONTACT_PREFIX+result.id])>RETENTION_SECONDS-10,true);
 assert.equal(mail.length,2);assert.equal(mail[0].key,mail[1].key);assert.deepEqual(mail[0].body,mail[1].body);
});
test('persistence failure never emails or claims successful acceptance',async()=>{
 reset();storageFailure=true;const result=await submit();assert.equal(result.status,503);assert.equal(result.data.accepted,false);assert.equal(mail.length,0);
});
test('success stores provider acceptance and a recovery reference without claiming inbox delivery',async()=>{
 reset();const result=await submit();assert.equal(result.status,201);assert.equal(result.data.notification,'accepted');const saved=await store.get(result.id);assert.equal(saved.providerId,'fixture-email-id');assert.equal(saved.notification,'accepted');assert.equal(saved.attempts,1);
 assert.ok(mail[0].body.html.includes('Sandbox &lt;Guest&gt;'));assert.ok(mail[0].body.html.includes('Keep this inquiry &amp; reply<br>Second line'));assert.equal(mail[0].body.reply_to,good.email);
});
test('same submission key never creates a second email; changed content conflicts privately',async()=>{
 reset();const id=randomUUID();await submit(good,id);const repeated=await submit(good,id);assert.equal(repeated.status,200);assert.equal(mail.length,1);
 const conflict=await submit({...good,message:'Changed draft'},id);assert.equal(conflict.status,409);assert.equal(conflict.data.accepted,false);assert.equal(mail.length,1);assert.ok(!JSON.stringify(conflict.data).includes(good.email));
});
test('concurrent repeats claim one notification operation',async()=>{
 reset();provider='slow';const id=randomUUID();const results=await Promise.all([submit(good,id),submit(good,id)]);assert.equal(results.every(r=>r.data.accepted),true);assert.equal(mail.length,1);assert.equal((await store.get(id)).attempts,1);
});
test('transient failure retries exactly the same provider payload and retains acceptance ID',async()=>{
 reset();provider='transient-once';const result=await submit();assert.equal(result.data.notification,'accepted');assert.equal(mail.length,2);assert.deepEqual(mail[0],mail[1]);assert.equal((await store.get(result.id)).attempts,2);
});
test('notification payload is durably frozen across configuration and template changes',async()=>{
 reset();provider='outage';const result=await submit();const saved=await store.get(result.id);assert.deepEqual(JSON.parse(saved.notificationBody),mail[0].body);
 provider='success';const changed=createContactHandler({...env,CONTACT_FROM_EMAIL:'changed@retreat.example',OWNER_EMAIL:'changed@example.test'},{fetcher,now:()=>time,pause:async()=>{}});
 await changed(request(good,result.id),randomUUID());assert.deepEqual(mail[0],mail[2]);assert.equal((await store.get(result.id)).notification,'accepted');
});
test('permanent rejection is retained and is not automatically resent',async()=>{
 reset();provider='permanent';const result=await submit();assert.equal(result.data.notification,'pending');assert.equal((await store.get(result.id)).notification,'failed');await submit(good,result.id);assert.equal(mail.length,1);
});
test('crash after send leaves recoverable state and cannot cause unsafe old retries',async()=>{
 reset();finishFailure=true;const result=await submit();assert.equal(result.data.accepted,true);assert.equal(result.data.notification,'pending');assert.equal((await store.get(result.id)).notification,'sending');
 finishFailure=false;time+=11000;await submit(good,result.id);assert.equal(mail.length,2);assert.deepEqual(mail[0],mail[1]);assert.equal((await store.get(result.id)).notification,'accepted');
});
test('bounded attempts and elapsed idempotency window require review, never another email',async()=>{
 reset();provider='outage';const result=await submit();await submit(good,result.id);await submit(good,result.id);assert.equal(mail.length,3);assert.equal((await store.get(result.id)).notification,'review');
 const old=await submit();const first=await store.get(old.id);time=first.firstAttemptAt+SAFE_RETRY_MS;const count=mail.length;await submit(good,old.id);assert.equal(mail.length,count);assert.equal((await store.get(old.id)).notification,'review');
});
test('missing, disabled, invalid storage or sandbox sender configuration fails before persistence/email',async()=>{
 reset();for(const changed of [{CONTACT_INTAKE_ENABLED:'false'},{UPSTASH_REDIS_REST_URL:undefined},{UPSTASH_REDIS_REST_TOKEN:''},{CONTACT_FROM_EMAIL:'onboarding@resend.dev'},{OWNER_EMAIL:'bad'},{RESEND_API_KEY:''}]){
  const h=createContactHandler({...env,...changed},{fetcher,now:()=>time});const response=await h(request(),randomUUID());assert.equal(response.status,503);assert.equal((await response.json()).accepted,false);
 }assert.equal(mail.length,0);
});
test('malformed bodies and spam are rejected without acceptance or notification',async()=>{
 reset();for(const body of [null,[],{}, {...good,website:'autofilled'}, {...good,name:'X\r\nInjected'}, {...good,email:'guest"@example.test'}, {...good,message:'x'.repeat(5001)}, {...good,name:'x'.repeat(101)}]){
  const r=await submit(body);assert.equal(r.status,400);assert.equal(r.data.accepted,false);
 }
 const r=await handler(new Request('https://retreat.example/api/contact',{method:'POST',headers:{origin:'https://retreat.example','content-type':'application/json','idempotency-key':randomUUID(),'x-contact-created-at':String(time)},body:'{'}));assert.equal(r.status,400);
 assert.equal(mail.length,0);
});
test('same-origin, content type, body bounds and identifier are enforced',async()=>{
 reset();for(const [headers,status] of [[{origin:'https://attacker.invalid'},403],[{'content-type':'text/plain'},415],[{'idempotency-key':'bad'},400]])assert.equal((await handler(request(good,randomUUID(),headers))).status,status);
 const body={...good,message:'x'.repeat(20000)};assert.equal((await submit(body)).status,400);assert.equal(mail.length,0);
});
test('persistent per-client quota blocks new submissions but permits safe repeats',async()=>{
 reset();const client=randomUUID();const accepted=[];for(let i=0;i<5;i++){const id=randomUUID();const r=await handler(request(good,id),client);assert.equal(r.status,201);accepted.push(id);}
 assert.equal((await handler(request(),client)).status,429);assert.equal((await handler(request(good,accepted[0]),client)).status,200);
});
test('operator list provides recoverable inquiries with no public listing endpoint',async()=>{
 reset();const result=await submit();const rows=await store.list();assert.equal(rows.some(r=>r.id===result.id && r.message===good.message),true);
});
test('read-only recovery remains available without enabled intake or valid mail configuration',async()=>{
 reset();const result=await submit();const config=contactStorageConfig({...env,CONTACT_INTAKE_ENABLED:'false',RESEND_API_KEY:'',CONTACT_FROM_EMAIL:'',OWNER_EMAIL:''});
 const recovery=new InquiryStore(config.storageUrl,config.storageToken,fetcher);assert.equal((await recovery.get(result.id)).message,good.message);assert.equal(mail.length,1);
});

 test('actual Astro POST route uses runtime config and the same durable intake path',async()=>{
 reset();
 const result=await build({entryPoints:['src/pages/api/contact.ts'],bundle:true,write:false,format:'esm',platform:'node',define:{'import.meta.env':'{}'},logLevel:'silent'});
 const route=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
 const prior=Object.fromEntries(Object.keys(env).map(key=>[key,process.env[key]]));
 Object.assign(process.env,env);globalThis.fetch=fetcher;
 try {const response=await route.POST({request:request(good,randomUUID(),{'x-contact-created-at':String(Date.now())}),clientAddress:randomUUID()});assert.equal(response.status,201);assert.equal((await response.json()).accepted,true);}
 finally {globalThis.fetch=realFetch;for(const[key,value]of Object.entries(prior)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
 });

 test('expired client reference cannot become a new inquiry after storage retention ends',async()=>{
 reset();const id=randomUUID();const requestAt=time;time+=31*24*60*60*1000;
 const response=await handler(request(good,id,{'x-contact-created-at':String(requestAt)}),randomUUID());
 assert.equal(response.status,409);assert.equal((await response.json()).accepted,false);assert.equal(mail.length,0);
 });
 test('unknown persistence acknowledgement reuses the durable record on retry',async()=>{
 reset();const id=randomUUID();let once=true;
 const uncertainFetch=async(url,init)=>{const response=await fetcher(url,init);if(String(url).startsWith(env.UPSTASH_REDIS_REST_URL) && once){once=false;throw new Error('fixture lost store acknowledgement');}return response;};
 const h=createContactHandler(env,{fetcher:uncertainFetch,now:()=>time,pause:async()=>{}});
 const first=await h(request(good,id),randomUUID());assert.equal(first.status,503);assert.equal(mail.length,0);assert.equal((await store.get(id)).message,good.message);
 const repeat=await h(request(good,id),randomUUID());assert.equal(repeat.status,200);assert.equal((await repeat.json()).accepted,true);assert.equal(mail.length,1);
 });
 test('notification-claim storage failure still acknowledges saved inquiry',async()=>{
 reset();claimFailure=true;const result=await submit();assert.equal(result.status,201);assert.equal(result.data.notification,'pending');assert.equal((await store.get(result.id)).message,good.message);assert.equal(mail.length,0);
 });
 test('a malformed provider success is bounded and not treated as delivered',async()=>{
 reset();provider='malformed';const result=await submit();assert.equal(result.data.notification,'pending');assert.equal((await store.get(result.id)).providerId,undefined);assert.equal(mail.length,2);
 });
 test('site-wide daily quota protects storage and returns an actionable failure',async()=>{
 reset();for(let n=0;n<50;n++){const r=await handler(request(),randomUUID());assert.equal(r.status,201);}
 const response=await handler(request(),randomUUID());assert.equal(response.status,429);assert.equal((await response.json()).accepted,false);
 });
