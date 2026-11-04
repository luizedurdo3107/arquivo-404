import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import { initStore,createRoom,joinRoom,fetchRoom,identify,applyCommand,leaveRoom } from './store.js';

const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'16kb'}));
app.use((req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
const httpServer=createServer(app);
const io=new Server(httpServer,{serveClient:false,pingTimeout:20000,pingInterval:25000,maxHttpBufferSize:16000});
const port=Number(process.env.PORT||3001);
const dirname=path.dirname(fileURLToPath(import.meta.url));
const distDir=path.resolve(dirname,'../dist');

function error(res,e,status=400){res.status(status).json({error:e.message||'Não foi possível completar a operação.'});}
function limitedRequest(req,res,next){
  const len=JSON.stringify(req.body||{}).length;
  if(len>2000)return res.status(413).json({error:'Dados muito extensos.'});
  next();
}
function authorized(req){
  const code=String(req.params.code||'').toUpperCase();
  const token=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  return {code,token,member:identify(code,token)};
}
app.get('/api/health',(req,res)=>res.json({ok:true,service:'arquivo404',time:Date.now()}));
app.post('/api/rooms',limitedRequest,(req,res)=>{
  try{res.status(201).json(createRoom(req.body?.team,req.body?.playerName));}catch(e){error(res,e);}
});
app.post('/api/rooms/:code/join',limitedRequest,(req,res)=>{
  try{res.json(joinRoom(req.params.code,req.body?.playerName));}catch(e){error(res,e);}
});
app.get('/api/rooms/:code',(req,res)=>{
  const {code,member}=authorized(req);
  if(!member)return res.status(401).json({error:'Sessão de investigador inválida.'});
  const room=fetchRoom(code);
  if(!room)return res.status(404).json({error:'Sala não encontrada.'});
  res.json({...room,playerName:member.name});
});
app.post('/api/rooms/:code/leave',(req,res)=>{
  const {code,token,member}=authorized(req);
  if(!member)return res.status(401).json({error:'Sessão de investigador inválida.'});
  leaveRoom(code,token);
  io.to(code).emit('room:members',fetchRoom(code)?.members||[]);
  for(const sock of io.sockets.sockets.values())if(sock.data.room===code&&sock.data.tokenHash===member.tokenHash)sock.disconnect(true);
  res.json({ok:true});
});

function connectedNames(code){
  const names=new Set();
  for(const socket of io.sockets.sockets.values())if(socket.data.room===code)names.add(socket.data.tokenHash);
  return names.size;
}
function emitPresence(code){io.to(code).emit('room:presence',{connected:connectedNames(code),members:fetchRoom(code)?.members||[]});}
io.use((socket,next)=>{
  const code=String(socket.handshake.auth?.code||'').toUpperCase();
  const token=socket.handshake.auth?.token;
  const member=identify(code,token);
  if(!member)return next(new Error('Sessão inválida. Entre novamente na sala.'));
  socket.data.room=code;socket.data.member=member;socket.data.tokenHash=member.tokenHash;
  next();
});
io.on('connection',socket=>{
  const {room,member}=socket.data;
  socket.join(room);
  socket.emit('room:state',fetchRoom(room));
  emitPresence(room);
  socket.on('room:command',(command,ack)=>{
    if(typeof ack!=='function')return;
    try{
      const current=identify(room,socket.handshake.auth.token);
      if(!current)throw Error('Este acesso foi encerrado.');
      const next=applyCommand(room,current,command);
      io.to(room).emit('room:state',next);
      ack({ok:true,revision:next.revision});
    }catch(e){ack({ok:false,error:e.message||'Falha ao executar ação.'});}
  });
  socket.on('disconnect',()=>emitPresence(room));
});

app.use(express.static(distDir,{index:false}));
app.get('*',(req,res,next)=>{
  if(req.path.startsWith('/api/')||req.path.startsWith('/socket.io'))return next();
  const file=path.join(distDir,'index.html');
  res.sendFile(file,e=>{if(e&&!res.headersSent)res.status(404).send('Execute npm run build para gerar a interface.');});
});

await initStore();
httpServer.listen(port,'0.0.0.0',()=>console.log(`\nARQUIVO 404 — Salas sincronizadas\nBackend: http://localhost:${port}\nBanco: server/data/arquivo404.sqlite\n`));
