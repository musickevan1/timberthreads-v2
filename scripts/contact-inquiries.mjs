// Private operator tool. Never imports a web route or exposes a public inquiry list.
import { build } from 'esbuild';
const bundle = await build({entryPoints:[new URL('../src/lib/contact.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node',logLevel:'silent'});
const { contactConfig, contactStorageConfig, notifyInquiry, INQUIRY_ID } = await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const storage = await build({entryPoints:[new URL('../src/lib/contact-store.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node',logLevel:'silent'});
const { InquiryStore } = await import('data:text/javascript;base64,'+Buffer.from(storage.outputFiles[0].text).toString('base64'));
try {
  const config = contactStorageConfig(process.env);
  const store = new InquiryStore(config.storageUrl,config.storageToken);
  const [action='--list',id,confirm] = process.argv.slice(2);
  if (action==='--list') {
    const rows=await store.list();
    console.log(JSON.stringify(rows.map(r=>({reference:r.id,createdAt:new Date(r.createdAt).toISOString(),notification:r.notification,attempts:r.attempts,providerId:r.providerId,errorCode:r.errorCode})),null,2));
  } else if (action==='--show' && INQUIRY_ID.test(id||'')) {
    const row=await store.get(id);
    if(!row) throw new Error('Inquiry not found or retention expired');
    // Deliberate private console output; avoid shared terminal logs or committing exports.
    console.log(JSON.stringify(row,null,2));
  } else if (action==='--retry' && INQUIRY_ID.test(id||'') && confirm==='--send') {
    console.log(JSON.stringify({reference:id,notification:await notifyInquiry(store,id,contactConfig(process.env))}));
  } else throw new Error('Use --list, --show UUID, or --retry UUID --send (the last command can send live email)');
} catch {
  // Never print upstream exceptions or credentials. No implicit send on failure.
  console.error('Operation failed. Check the private configuration and instructions in specs/contact-operations.md.');
  process.exitCode=1;
}
