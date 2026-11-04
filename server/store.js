import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import initSqlJs from 'sql.js';

const require = createRequire(import.meta.url);
const dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(dirname, 'data', 'arquivo404.sqlite');
const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PHASE_CODES = ['ABRIR', 'COFRE', 'LIA', '5814'];
const VALID_EVIDENCE = new Set(['E-01','E-02','E-03','E-04','T-01','C-04','A-27','M-14']);
const PROOF_MAP = {who:['A-27'],where:['C-04','M-14'],how:['A-27'],why:['E-03','M-14']};
const VERDICT_KEYS = Object.keys(PROOF_MAP);
const CORRECT = {who:'Lia Torres',where:'Cofre B',how:'Acesso com T-27 e sessão de Hugo aberta',why:'Impedir exibição sem autorização'};
const DECISIONS = ['Recuperar e divulgar tudo imediatamente', 'Recuperar o arquivo e aguardar as autorizações antes de divulgar', 'Apagar definitivamente o arquivo'];
const OPTIONS = {
  who:['Hugo Vale','Clara Melo','Lia Torres'],
  where:['Lixeira do sistema','Servidor externo','Cofre B'],
  how:['Falha automática no servidor','Acesso com T-27 e sessão de Hugo aberta','Invasão por um dispositivo desconhecido'],
  why:['Vender as informações','Sabotar a exposição','Impedir exibição sem autorização']
};
let db;

export function cleanText(input, max=36) {
  return String(input ?? '').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,max);
}
const hash = str => crypto.createHash('sha256').update(str).digest('hex');
const now = () => Date.now();
function row(sql, values=[]) { const stmt=db.prepare(sql);try {stmt.bind(values);return stmt.step()?stmt.getAsObject():null;}finally{stmt.free();} }
function all(sql, values=[]) { const stmt=db.prepare(sql);const result=[];try {stmt.bind(values);while(stmt.step())result.push(stmt.getAsObject());return result;}finally{stmt.free();} }
function run(sql, values=[]) { db.run(sql, values); }
function persist(){ const tmp=DATA_FILE+'.tmp';fs.writeFileSync(tmp, Buffer.from(db.export()));fs.renameSync(tmp,DATA_FILE); }
function makeCode() { let code=''; for(let i=0;i<6;i++)code+=ROOM_ALPHABET[crypto.randomInt(ROOM_ALPHABET.length)]; return code; }
function makeToken(){return crypto.randomBytes(32).toString('base64url');}
function newState(team) {
  const t=now();
  return {team,started:true,phase:1,solved:[],hinted:[],elapsedMs:0,running:true,startTick:t,
    pinned:[],connections:{},answers:{},proofs:{},decision:'',report:null};
}

export async function initStore(){
  const wasmPath=require.resolve('sql.js/dist/sql-wasm.wasm');
  const SQL=await initSqlJs({locateFile: ()=>wasmPath});
  fs.mkdirSync(path.dirname(DATA_FILE),{recursive:true});
  db=fs.existsSync(DATA_FILE)?new SQL.Database(fs.readFileSync(DATA_FILE)):new SQL.Database();
  db.run(`PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS rooms(code TEXT PRIMARY KEY, state_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS members(token_hash TEXT PRIMARY KEY, room TEXT NOT NULL, display_name TEXT NOT NULL, joined_at INTEGER NOT NULL, FOREIGN KEY(room) REFERENCES rooms(code) ON DELETE CASCADE);
  CREATE INDEX IF NOT EXISTS idx_room_members ON members(room);`);
  persist();
}

export function fetchRoom(code){
  const id=String(code||'').toUpperCase().trim();
  const found=row('SELECT code,state_json,revision FROM rooms WHERE code=?',[id]);
  if(!found)return null;
  return {code:found.code,revision:Number(found.revision),state:JSON.parse(found.state_json),members:memberNames(found.code)};
}
export function memberNames(code){return all('SELECT display_name FROM members WHERE room=? ORDER BY joined_at ASC',[code]).map(x=>x.display_name);}
export function identify(code,token){
  if(!token||typeof token!=='string'||token.length>150)return null;
  const member=row('SELECT room,display_name,token_hash FROM members WHERE token_hash=?',[hash(token)]);
  if(member && member.room===String(code||'').toUpperCase().trim())return {name:member.display_name,tokenHash:member.token_hash,room:member.room};
  return null;
}
export function createRoom(teamName,playerName){
  const team=cleanText(teamName)||'Equipe 404';
  const name=cleanText(playerName)||'Investigador 1';
  let code;do{code=makeCode();}while(fetchRoom(code));
  const token=makeToken();
  run('INSERT INTO rooms(code,state_json,revision,updated_at) VALUES(?,?,0,?)',[code,JSON.stringify(newState(team)),now()]);
  run('INSERT INTO members(token_hash,room,display_name,joined_at) VALUES(?,?,?,?)',[hash(token),code,name,now()]);
  persist();
  return {code,token,playerName:name,...fetchRoom(code)};
}
export function joinRoom(codeInput,playerName){
  const code=String(codeInput||'').replace(/\s/g,'').toUpperCase();
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))throw Error('Código de sala inválido.');
  if(!fetchRoom(code))throw Error('Sala não encontrada. Confira o código informado.');
  const names=memberNames(code);
  if(names.length>=2)throw Error('Esta sala já tem dois investigadores.');
  let name=cleanText(playerName)||'Investigador 2';
  if(names.includes(name))name=`${name.slice(0,28)} (2)`;
  const token=makeToken();
  run('INSERT INTO members(token_hash,room,display_name,joined_at) VALUES(?,?,?,?)',[hash(token),code,name,now()]);
  persist();
  return {code,token,playerName:name,...fetchRoom(code)};
}
export function leaveRoom(code,token){
  const member=identify(code,token);if(!member)return false;
  run('DELETE FROM members WHERE token_hash=?',[member.tokenHash]);
  persist();return true;
}
function elapsed(state){return state.elapsedMs+(state.running&&state.startTick?Math.max(0,now()-state.startTick):0);}
function normalize(value){return String(value||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,'');}
function isEvidenceUnlocked(state,id){return VALID_EVIDENCE.has(id)&&(id.startsWith('E-')||({'T-01':1,'C-04':2,'A-27':3,'M-14':4}[id]||10)<=state.solved.length);}
export function applyCommand(code,member,command){
  if(!member||member.room!==code)throw Error('Acesso negado.');
  const current=fetchRoom(code);if(!current)throw Error('Sala não encontrada.');
  const s=current.state;
  const action=String(command?.type||'');
  const payload=command?.payload||{};
  const n=Number(payload.phase);
  const id=String(payload.id||'');
  if(s.report&&action!=='case:reset')throw Error('Esta investigação já foi encerrada.');
  let changed=false;
  switch(action){
    case 'phase:solve': {
      if(n!==s.phase||n<1||n>4)throw Error('Esta missão não está ativa.');
      if(normalize(payload.code)!==PHASE_CODES[n-1])throw Error('Código incorreto. Revise as evidências físicas.');
      s.solved.push(n);s.phase=n+1;changed=true;break;
    }
    case 'hint:reveal': {
      if(![1,2,3,4].includes(n)||n!==s.phase||s.hinted.includes(n))throw Error('Esta dica não está disponível.');
      s.hinted.push(n);changed=true;break;
    }
    case 'evidence:pin': {
      if(!isEvidenceUnlocked(s,id))throw Error('Evidência não liberada.');
      s.pinned=s.pinned.includes(id)?s.pinned.filter(v=>v!==id):[...s.pinned,id];changed=true;break;
    }
    case 'verdict:answer': {
      if(s.solved.length!==4||!VERDICT_KEYS.includes(id))throw Error('Veredito indisponível.');
      const value=String(payload.value||'');
      if(value&&!OPTIONS[id].includes(value))throw Error('Resposta inválida.');
      s.answers[id]=value;changed=true;break;
    }
    case 'verdict:proof': {
      if(s.solved.length!==4||!VERDICT_KEYS.includes(id))throw Error('Veredito indisponível.');
      const value=String(payload.value||'');
      if(value&&!isEvidenceUnlocked(s,value))throw Error('Evidência não liberada.');
      s.proofs[id]=value;changed=true;break;
    }
    case 'verdict:decision': {
      if(s.solved.length!==4||!DECISIONS.includes(payload.value))throw Error('Decisão inválida.');
      s.decision=payload.value;changed=true;break;
    }
    case 'verdict:submit': {
      if(s.solved.length!==4)throw Error('Conclua todas as fases antes do veredito.');
      if(VERDICT_KEYS.some(k=>!s.answers[k]||!s.proofs[k])||!s.decision)throw Error('Preencha todas as conclusões e suas provas.');
      let verdictPoints=0,supported=0;
      VERDICT_KEYS.forEach(k=>{if(s.answers[k]===CORRECT[k]&&PROOF_MAP[k].includes(s.proofs[k])){verdictPoints+=50;supported++;}});
      const decisionPoints=s.decision===DECISIONS[1]?50:0;
      s.elapsedMs=elapsed(s);s.running=false;s.startTick=null;
      s.report={verdictPoints,decisionPoints,supported,endedAt:now()};changed=true;break;
    }
    case 'timer:toggle': {
      if(s.running){s.elapsedMs=elapsed(s);s.startTick=null;s.running=false;}
      else{s.running=true;s.startTick=now();}
      changed=true;break;
    }
    case 'case:reset': {
      Object.assign(s,newState(s.team));changed=true;break;
    }
    default:throw Error('Operação desconhecida.');
  }
  if(changed){
    run('UPDATE rooms SET state_json=?,revision=?,updated_at=? WHERE code=?',[JSON.stringify(s),current.revision+1,now(),code]);
    persist();
  }
  return {...fetchRoom(code),event:{actor:member.name,type:action}};
}
