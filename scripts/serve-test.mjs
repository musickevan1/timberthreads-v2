// Static-only Playwright server: never executes API routes or loads live credentials.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist/client');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2','.ico':'image/x-icon'};
createServer(async(request,response)=>{
 if(request.method!=='GET' && request.method!=='HEAD'){response.writeHead(405).end();return;}
 try {
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const file=resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+'/')){response.writeHead(403).end();return;}
  const body=await readFile(file);
  response.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(request.method==='HEAD'?undefined:body);
 } catch {response.writeHead(404).end();}
}).listen(Number(process.env.TEST_PORT||4321),'127.0.0.1');
