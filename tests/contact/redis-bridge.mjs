import {createServer} from 'node:http';
import {createConnection} from 'node:net';

function parse(buffer, offset=0) {
  if(offset>=buffer.length) return null;
  const end=buffer.indexOf('\r\n',offset);
  if(end<0) return null;
  const kind=String.fromCharCode(buffer[offset]);
  const value=buffer.subarray(offset+1,end).toString();
  let next=end+2;
  if(kind==='+') return {value,next};
  if(kind==='-') return {error:value,next};
  if(kind===':') return {value:Number(value),next};
  if(kind==='$') {
    const length=Number(value); if(length===-1)return {value:null,next};
    if(buffer.length<next+length+2)return null;
    return {value:buffer.subarray(next,next+length).toString(),next:next+length+2};
  }
  if(kind==='*') {
    const values=[];
    for(let n=0;n<Number(value);n++) {const result=parse(buffer,next);if(!result)return null;if(result.error)return result;values.push(result.value);next=result.next;}
    return {value:values,next};
  }
  throw new Error('Invalid Redis fixture response');
}
export async function redisCommand(command, port=Number(process.env.CONTACT_TEST_REDIS_PORT||46379)) {
 return new Promise((resolve,reject)=>{
  const socket=createConnection({host:'127.0.0.1',port});let received=Buffer.alloc(0);
  socket.setTimeout(4000,()=>{socket.destroy();reject(new Error('Fixture Redis timeout'));});
  socket.on('error',reject);
  socket.on('connect',()=>{
   const body=['*'+command.length];
   for(const value of command){const str=String(value);body.push('$'+Buffer.byteLength(str),str);}
   socket.write(body.join('\r\n')+'\r\n');
  });
  socket.on('data',chunk=>{received=Buffer.concat([received,chunk]);const response=parse(received);if(response){socket.end();response.error?reject(new Error(response.error)):resolve(response.value);}});
 });
}
export async function startRedisBridge() {
 await redisCommand(['PING']);
 const server=createServer(async(request,response)=>{
  try {
   let body='';for await(const part of request)body+=part;
   const result=await redisCommand(JSON.parse(body));
   response.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({result}));
  } catch {response.writeHead(500,{'Content-Type':'application/json'}).end(JSON.stringify({error:'fixture storage error'}));}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(resolve=>server.close(resolve))};
}
