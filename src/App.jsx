import React from 'react';
import { io } from 'socket.io-client';

// ARQUIVO404_API_PROD_V2 — Vite incorpora VITE_API_URL no build.
const API_ORIGIN = import.meta.env.DEV ? '' : String(window.__ARQUIVO404_API_URL__ || import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
// ARQUIVO404_JOIN_DIAG_FIX_20261104 — endereço validado e erros de rede explicativos.
function apiEndpoint(path) {
  if (import.meta.env.PROD && !API_ORIGIN) {
    throw Error('API de salas não configurada na publicação. Verifique arquivo404-config.js e o deploy da Vercel.');
  }
  const origin = API_ORIGIN || window.location.origin;
  let url;
  try {
    url = new URL(path, origin);
  } catch (_) {
    throw Error(`Endereço da API inválido: ${origin}. Confira a URL pública do Render.`);
  }
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw Error(`Protocolo da API inválido: ${url.protocol}`);
  }
  return url.href;
}
async function apiJson(path, init={}) {
  const url = apiEndpoint(path);
  let response;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 45000);
  try {
    response = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', ...(init.headers || {}) },
      cache: 'no-store',
      signal: init.signal || ctrl.signal,
    });
  } catch (err) {
    const detail = err?.name === 'AbortError' ? 'tempo esgotado' : (err?.message || 'falha de rede');
    throw Error(`Não foi possível contatar a API do Render (${detail}). Endereço: ${url}. Confira internet e CORS.`);
  } finally { clearTimeout(timeout); }
  const ct = (response.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('application/json')) {
    const preview = (await response.text().catch(() => '')).slice(0, 70).replace(/\s+/g, ' ');
    throw Error(`A API retornou HTTP ${response.status}, formato ${ct || 'desconhecido'} em ${url}, em vez de JSON. ${preview}`);
  }
  let payload;
  try { payload = await response.json(); }
  catch (_) { throw Error(`A API retornou JSON inválido (HTTP ${response.status}) em ${url}.`); }
  if (!response.ok) {
    const message = typeof payload?.error === 'string' ? payload.error : payload?.error?.message;
    if (response.status === 404 && path.includes('/join')) {
      throw Error('Sala não encontrada no servidor. Se o Render reiniciou, o SQLite do plano gratuito pode ter perdido as salas anteriores. Crie uma nova sala.');
    }
    if (response.status === 403) {
      throw Error(`Acesso bloqueado pela API (HTTP 403): ${message || 'confira ALLOWED_ORIGINS no Render'}`);
    }
    throw Error(`${message || 'Erro ao acessar o servidor'} (HTTP ${response.status}; rota ${path})`);
  }
  return payload;
}

const CASE = 'ARQUIVO 404';
const KEY = 'arquivo404-react-v3';
const MAX_TIME = 50 * 60 * 1000;
// Códigos das fases validados apenas pelo servidor.

const ICON_PATHS = {
  grid: ['M3 3h7v7H3z','M14 3h7v7h-7z','M3 14h7v7H3z','M14 14h7v7h-7z'],
  folder: ['M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  fingerprint: ['M12 11c-1.66 0-3 1.34-3 3 0 3-1 5-2 6','M12 7a7 7 0 0 0-7 7c0 2-.4 4-1.4 6','M12 3a11 11 0 0 0-11 11','M12 11c1.66 0 3 1.34 3 3 0 3 1 5 2 6','M12 7a7 7 0 0 1 7 7c0 2 .4 4 1.4 6','M12 3a11 11 0 0 1 11 11'],
  scan: ['M4 9V5a1 1 0 0 1 1-1h4','M15 4h4a1 1 0 0 1 1 1v4','M20 15v4a1 1 0 0 1-1 1h-4','M9 20H5a1 1 0 0 1-1-1v-4','M4 12h16'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8','M22 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  message: ['M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z'],
  scale: ['M12 3v18','M3 6h18','M5 6l-3 6a5 5 0 0 0 6 0L5 6z','M19 6l-3 6a5 5 0 0 0 6 0l-3-6z','M7 21h10'],
  arrow: ['M5 12h14','M12 5l7 7-7 7'],
  chevron: ['M9 18l6-6-6-6'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20','M12 6v6l4 2'],
  bolt: ['M13 2 3 14h8l-1 8 11-12h-8z'],
  lock: ['M4 11h16v10H4z','M8 11V7a4 4 0 0 1 8 0v4'],
  unlock: ['M4 11h16v10H4z','M8 11V7a4 4 0 0 1 8 0'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16','M21 21l-4.35-4.35'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M8 13h8','M8 17h8'],
  check: ['M20 6 9 17l-5-5'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
  help: ['M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3','M12 17h.01','M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20'],
  reset: ['M3 12a9 9 0 1 0 3-6.7','M3 3v6h6'],
  volume: ['M11 5 6 9H3v6h3l5 4z','M15.5 8.5a5 5 0 0 1 0 7','M19 5a10 10 0 0 1 0 14'],
  mute: ['M11 5 6 9H3v6h3l5 4z','M16 9l5 6','M21 9l-5 6'],
  menu: ['M4 6h16','M4 12h16','M4 18h16'],
  x: ['M18 6 6 18','M6 6l12 12'],
  terminal: ['M4 17l6-5-6-5','M12 19h8'],
  eye: ['M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7S2 12 2 12z','M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6'],
  pin: ['M16 9V4l1-1H7l1 1v5l-2 3v1h12v-1z','M12 13v8'],
  star: ['m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z'],
  send: ['m22 2-7 20-4-9-9-4 20-7z','M22 2 11 13'],
  activity: ['M3 12h4l3-8 4 16 3-8h4'],
  clipboard: ['M9 4h6v4H9z','M5 6H4v16h16V6h-1','M8 13h8','M8 17h8'],
  download: ['M12 3v12','M7 10l5 5 5-5','M4 17v4h16v-4'],
  adjust: ['M4 7h16','M4 17h16','M8 4v6','M16 14v6'],
  spark: ['m12 2 1.5 7 7 1.5-7 1.5-1.5 7-1.5-7-7-1.5 7-1.5z'],
  copy: ['M8 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2','M10 2h10v14H10z'],
  back: ['M19 12H5','M12 19l-7-7 7-7']
};
function Icon({name,size=18,strokeWidth=1.8}) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{(ICON_PATHS[name]||ICON_PATHS.file).map((d,i)=><path key={i} d={d}/>)}</svg>;
}
function SmallLabel({children,tone=''}) {return <span className={'eyebrow '+tone}>{children}</span>}
function Action({children,variant='',icon,onClick,disabled=false,type='button',className=''}) {return <button type={type} disabled={disabled} className={'action '+variant+' '+className} onClick={onClick}>{icon && <Icon name={icon} size={17}/>}<span>{children}</span></button>}
function SectorHeading({index,label,title,right}) {return <div className="sector-heading"><div><SmallLabel>{index} / {label}</SmallLabel><h2>{title}</h2></div>{right}</div>}
// Class-based components are compatible with the included offline React build.

const PHASES = [
  {id:1,eyebrow:'SEQUÊNCIA DOS FATOS',title:'Linha do tempo',short:'Reconstrua a última hora',description:'Os documentos chegaram fora de ordem. O sistema possui os horários; o Envelope 01 guarda os eventos e suas letras.',action:'Identificar sequência',prompt:'Senha formada pelas letras dos cartões',placeholder:'Digite a palavra de cinco letras',hint:'O sistema informa a ordem cronológica. Coloque os cartões físicos na mesma sequência e leia as letras.',envelope:'01',proof:'T-01',label:'Linha do tempo validada'},
  {id:2,eyebrow:'REGISTRO VISUAL',title:'Câmera 04',short:'Revele a informação oculta',description:'Um registro de câmera foi reduzido a uma matriz. Apenas a sobreposição com o visor físico revela o próximo termo.',action:'Decodificar registro',prompt:'Qual palavra o visor revela?',placeholder:'Digite a palavra revelada',hint:'Use o visor do Envelope 02 sobre a matriz, alinhando as marcas triangulares. Leia as janelas na ordem.',envelope:'02',proof:'C-04',label:'Registro visual decodificado'},
  {id:3,eyebrow:'CREDENCIAL DE ACESSO',title:'Identidade cifrada',short:'Desvende a credencial T-27',description:'Um acesso às 18h16 aparece associado a uma identificação criptografada. A sessão ativa nem sempre revela quem operou o terminal.',action:'Decodificar identidade',prompt:'Qual nome está protegido pelo código?',placeholder:'Digite o nome decodificado',hint:'Use o disco físico. Se cada letra foi avançada três posições para cifrar, faça o movimento inverso.',envelope:'03',proof:'A-27',label:'Vínculo da credencial identificado'},
  {id:4,eyebrow:'ARQUIVO FRAGMENTADO',title:'A mensagem perdida',short:'Reconstrua a última nota',description:'Uma mensagem foi dividida em quatro partes. As frases revelam a combinação quando organizadas em uma ordem coerente.',action:'Acessar compartimento',prompt:'Digite os quatro números na ordem correta',placeholder:'Código de quatro dígitos',hint:'Monte primeiro a frase completa com as peças do Envelope 04. Só depois leia os números de cada uma.',envelope:'04',proof:'M-14',label:'Documento integral reconstituído'}
];
const SUSPECTS = [
  {id:'HV',name:'Hugo Vale',role:'Técnico de suporte',tag:'Sessão identificada',color:'blue',desc:'Prestava suporte aos computadores do evento. Seu usuário foi registrado no momento da movimentação, embora ele afirme ter saído para resolver um problema na impressora.',detail:'O comprovante físico mostra uma impressão iniciada às 18h07. O login não confirma, isoladamente, quem usou o computador.',location:'Sala técnica / impressora',question:'Se o login era dele, quem mais tinha acesso ao terminal?'},
  {id:'CM',name:'Clara Melo',role:'Coordenação estudantil',tag:'Responsável pelo evento',color:'gold',desc:'Organizava a exposição Cápsula do Tempo e tinha motivos para manter o cronograma. Diz que estava no auditório revisando a apresentação.',detail:'O roteiro foi entregue às 18h02, mas esse registro não cobre todo o período investigado.',location:'Auditório',question:'A pressão do prazo poderia motivar alguma ocultação?'},
  {id:'LT',name:'Lia Torres',role:'Editora de depoimentos',tag:'Solicitou adiamento',color:'red',desc:'Tinha acesso aos relatos da exposição e pediu que certos conteúdos não fossem exibidos antes da liberação dos autores.',detail:'A mensagem enviada às 18h11 menciona falta de autorização. O pedido precisa ser comparado com os registros de acesso.',location:'Produção audiovisual',question:'A preocupação com as autorizações explica o desaparecimento?'}
];
const EVIDENCE = [
  {id:'E-01',title:'Comprovante de impressão',type:'Documento físico',phase:0,detail:'Impressão de etiquetas solicitada por hugo.v às 18h07; concluída às 18h09.'},
  {id:'E-02',title:'Roteiro do auditório',type:'Documento físico',phase:0,detail:'A entrega do roteiro por Clara foi confirmada às 18h02.'},
  {id:'E-03',title:'Aviso de autorizações',type:'Mensagem física',phase:0,detail:'Lia pediu o adiamento da exibição por falta de autorizações às 18h11.'},
  {id:'E-04',title:'Registro da porta',type:'Acesso físico',phase:0,detail:'O sensor acusou passagem da credencial T-27 às 18h16.'},
  {id:'T-01',title:'Sequência dos acontecimentos',type:'Análise digital',phase:1,detail:'Os horários e os cartões foram confrontados. A movimentação ocorreu às 18h18, depois da abertura da sala técnica.'},
  {id:'C-04',title:'Pista do compartimento',type:'Imagem decodificada',phase:2,detail:'A análise visual da câmera indicou um compartimento protegido no sistema.'},
  {id:'A-27',title:'Credencial e sessão cruzadas',type:'Registro de autenticação',phase:3,detail:'A identidade decifrada e o acesso T-27 contrastam com o nome da sessão hugo.v.'},
  {id:'M-14',title:'Mensagem reconstituída',type:'Documento recuperado',phase:4,detail:'A nota justifica o armazenamento restrito pelo problema das autorizações.'}
];
const LOGS = [
  {time:'18:02:00',type:'AÇÃO',title:'Roteiro de abertura entregue',desc:'Registro do auditório'},
  {time:'18:07:00',type:'SERVIÇO',title:'Impressão de etiquetas iniciada',desc:'Terminal de suporte'},
  {time:'18:11:00',type:'MENSAGEM',title:'Pedido de adiamento protocolado',desc:'Caixa interna de mensagens'},
  {time:'18:16:00',type:'SENSOR',title:'Porta da sala técnica aberta',desc:'Credencial identificada: T-27'},
  {time:'18:18:00',type:'ALERTA',title:'Arquivo F-404 não localizado',desc:'Última sessão: hugo.v'}
];
const VOICES = [
  {name:'Hugo Vale',time:'18:24',role:'SUPORTE',quote:'Saí para resolver um problema na impressora. O computador da sala técnica ficou ligado — e eu não encerrei minha sessão.',flag:'A sessão estava aberta.'},
  {name:'Clara Melo',time:'18:27',role:'ORGANIZAÇÃO',quote:'Eu estava tentando terminar o roteiro. Era importante que o evento não atrasasse, mas não mexi no sistema de arquivos.',flag:'A entrega do roteiro foi registrada.'},
  {name:'Lia Torres',time:'18:31',role:'EDIÇÃO',quote:'Eu avisei que alguns depoimentos ainda não estavam autorizados. Não queria que aqueles relatos fossem expostos daquele jeito.',flag:'Há uma mensagem anterior confirmando o aviso.'}
];
const NAVS = [
  {id:'overview',name:'Central',icon:'grid'},
  {id:'missions',name:'Missões',icon:'scan'},
  {id:'suspects',name:'Suspeitos',icon:'users'},
  {id:'evidence',name:'Evidências',icon:'folder'},
  {id:'comms',name:'Registros',icon:'terminal'},
  {id:'verdict',name:'Veredito',icon:'scale'}
];
const VERDICT_FIELDS = [
  {id:'who',label:'01 — Quem movimentou o F-404?',options:['Hugo Vale','Clara Melo','Lia Torres']},
  {id:'where',label:'02 — Para onde o arquivo foi transferido?',options:['Lixeira do sistema','Servidor externo','Cofre B']},
  {id:'how',label:'03 — Como a transferência foi realizada?',options:['Falha automática no servidor','Acesso com T-27 e sessão de Hugo aberta','Invasão por um dispositivo desconhecido']},
  {id:'why',label:'04 — Qual foi a motivação?',options:['Vender as informações','Sabotar a exposição','Impedir exibição sem autorização']}
];
// Resposta ideal validada apenas no servidor.

function freshState() {
  return {team:'',started:false,activeNav:'overview',phase:1,solved:[],hinted:[],elapsedMs:0,running:false,startTick:null,pinned:[],connections:{},answers:{},proofs:{},decision:'',report:null,highContrast:false,sound:false};
}
function readState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return freshState();
    const data = JSON.parse(raw);
    if (!data || typeof data!=='object') return freshState();
    const defaults=freshState();
    return {...defaults,...data, solved:Array.isArray(data.solved)?data.solved:[], hinted:Array.isArray(data.hinted)?data.hinted:[], pinned:Array.isArray(data.pinned)?data.pinned:[], answers:data.answers||{}, proofs:data.proofs||{},connections:data.connections||{}};
  } catch(e) { return freshState(); }
}
function normalize(val) {return String(val||'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,'');}
function niceTime(ms){const s=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function formatClock(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function downloadReport(state,score){
 const report = `ARQUIVO 404 — RELATÓRIO DE INVESTIGAÇÃO\n\nEquipe: ${state.team}\nPontuação: ${score}/650\nFases resolvidas: ${state.solved.length}/4\nDicas: ${state.hinted.length}\nTempo: ${formatClock(state.elapsedMs)}\n\nRESPOSTAS DO VEREDITO\n${VERDICT_FIELDS.map(q=>q.label+'\n'+(state.answers[q.id]||'—')+'\nProva indicada: '+(state.proofs[q.id]||'—')).join('\n\n')}\n\nDecisão final: ${state.decision||'—'}\n\nInstituto Vértice • Caso F-404`;
 const blob=new Blob([report],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='arquivo404-relatorio.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),150);
}

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={...freshState(),inputCode:'',teamDraft:'',playerNameDraft:'',joinCodeDraft:'',roomCode:'',roomMembers:[],presenceCount:0,connectStatus:'offline',networkBusy:false,networkError:'',timeNow:Date.now(),modal:null,toast:'',mobileMenu:false,searchQuery:'',evidenceType:'Todas',speaker:0,detailSuspect:'HV',showIntro:true,entryAnim:false};
    this.timer=null;this.toastTimer=null;this.audioCtx=null;this.socket=null;this.roomAuth=null;this.revision=-1;
  }
  componentDidMount(){this.timer=setInterval(()=>this.setState({timeNow:Date.now()}),1000);document.title=CASE+' — Central de Investigação';this.resumeRoom();}
  componentWillUnmount(){clearInterval(this.timer);clearTimeout(this.toastTimer);if(this.socket)this.socket.disconnect();}
  getPersistent(){const {team,started,activeNav,phase,solved,hinted,elapsedMs,running,startTick,pinned,connections,answers,proofs,decision,report,highContrast,sound}=this.state;return {team,started,activeNav,phase,solved,hinted,elapsedMs,running,startTick,pinned,connections,answers,proofs,decision,report,highContrast,sound};}
  saveState(){/* O servidor é a fonte de verdade da sala; não salvar um segundo progresso local. */}
  mutate(patch,callback){this.setState(patch,()=>{this.saveState();if(callback)callback();});}
  getElapsed(){return this.state.elapsedMs+(this.state.running&&this.state.startTick?Math.max(0,this.state.timeNow-this.state.startTick):0);}
  getScore(){const {solved,hinted,report}=this.state;return Math.max(0,solved.length*100-hinted.length*20+(report?report.verdictPoints+report.decisionPoints:0));}
  play(f=600){if(!this.state.sound) return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;const ctx=this.audioCtx||(this.audioCtx=new Context());const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type='sine';osc.frequency.value=f;gain.gain.setValueAtTime(.00001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.07,ctx.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.00001,ctx.currentTime+.13);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.15);}catch(e){}}
  toast(message){clearTimeout(this.toastTimer);this.setState({toast:message});this.toastTimer=setTimeout(()=>this.setState({toast:''}),3500);}
  // Atualização colaborativa: o servidor valida códigos e controla o progresso compartilhado.
  async resumeRoom(){
    let auth;
    try{auth=JSON.parse(window.localStorage.getItem('arquivo404-room-auth')||'null');}catch(_){return;}
    if(!auth?.code||!auth?.token)return;
    this.roomAuth=auth;
    this.setState({networkBusy:true,connectStatus:'connecting'});
    try{
      const data=await apiJson(`/api/rooms/${encodeURIComponent(auth.code)}`,{headers:{Authorization:`Bearer ${auth.token}`}});
      this.receiveRemote(data);
      this.connectRoom(auth);
    }catch(e){
      if(/inválida|inválido|não encontrada/i.test(e.message)){
        window.localStorage.removeItem('arquivo404-room-auth');this.roomAuth=null;
      }
      this.setState({networkError:e.message,connectStatus:'offline'});
    }finally{this.setState({networkBusy:false});}
  }
  async start(){return this.enterRoom('create');}
  async joinExisting(){return this.enterRoom('join');}
  async enterRoom(mode){
    if(this.state.networkBusy)return;
    const joinCode=String(this.state.joinCodeDraft||'').normalize('NFKC').replace(/[\s-]/g,'').toUpperCase();
    if(mode==='join'&&!/^[A-HJ-NP-Z2-9]{6}$/.test(joinCode)){
      this.setState({networkError:'Código inválido. Digite exatamente os 6 caracteres fornecidos pelo criador da sala.'});return;
    }
    this.setState({networkBusy:true,networkError:''});
    try{
      const body=mode==='join'?{playerName:this.state.playerNameDraft||'Investigador 2'}:
        {playerName:this.state.playerNameDraft||'Investigador 1',team:this.state.teamDraft||'Equipe 404'};
      const url=mode==='join'?`/api/rooms/${joinCode}/join`:'/api/rooms';
      const data=await apiJson(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if (!data || typeof data.code !== 'string' || !/^[A-HJ-NP-Z2-9]{6}$/.test(data.code) || typeof data.token !== 'string' || !data.token) {
        throw Error('A API não retornou uma sessão válida. Confirme o endereço do Render no arquivo público de configuração.');
      }
      const auth={code:data.code,token:data.token,playerName:data.playerName};
      window.localStorage.setItem('arquivo404-room-auth',JSON.stringify(auth));
      this.roomAuth=auth;this.revision=-1;
      this.receiveRemote(data);
      this.connectRoom(auth);
      this.toast(mode==='join'?'Entrou na investigação compartilhada.':'Sala criada. Compartilhe o código com seu parceiro!');
    }catch(e){this.setState({networkError:`Falha ao ${mode==='join'?'entrar na sala':'criar sala'}: ${e?.message || 'erro de rede'}. Se ocorrer apenas no celular, tente uma aba privativa para descartar arquivos antigos em cache.`,connectStatus:'offline'});}
    finally{this.setState({networkBusy:false});}
  }
  connectRoom(auth){
    if(this.socket)this.socket.disconnect();
    const socket=io(API_ORIGIN || window.location.origin,{path:'/socket.io',transports:['polling','websocket'],auth:{code:auth.code,token:auth.token},reconnection:true,reconnectionDelay:700,timeout:20000});
    this.socket=socket;
    this.setState({roomCode:auth.code,connectStatus:'connecting'});
    socket.on('connect',()=>this.setState({connectStatus:'online',networkError:''}));
    socket.on('room:state',payload=>this.receiveRemote(payload));
    socket.on('room:presence',data=>this.setState({presenceCount:data.connected||0,roomMembers:data.members||[]}));
    socket.on('room:members',members=>this.setState({roomMembers:members||[]}));
    socket.on('disconnect',()=>this.setState({connectStatus:'offline'}));
    socket.on('connect_error',e=>this.setState({connectStatus:'offline',networkError:`Falha na sincronização em tempo real com ${API_ORIGIN || window.location.origin}: ${e?.message || 'conexão indisponível'}. A entrada na sala pode ter funcionado; não crie outra sala antes de conferir.`}));
  }
  receiveRemote(packet){
    if(!packet?.state)return;
    if(packet.revision<this.revision)return;
    this.revision=packet.revision;
    const old=this.state;
    const newPhase=packet.state.phase>old.phase;
    this.setState({...packet.state,roomCode:packet.code,roomMembers:packet.members||old.roomMembers,
      activeNav:old.started?old.activeNav:'overview',timeNow:Date.now(),modal:packet.state.report?null:old.modal,
      inputCode:newPhase?'':old.inputCode},()=>{
        if(newPhase&&old.started&&packet.event?.actor!==this.roomAuth?.playerName)this.toast(`${packet.event?.actor||'Seu parceiro'} liberou uma nova fase!`);
        if(packet.state.report&&!old.report)this.toast('O veredito da dupla foi registrado.');
      });
  }
  command(type,payload={}){
    if(!this.socket?.connected){this.toast('Sem conexão. Reconecte para atualizar o progresso da dupla.');return;}
    this.socket.timeout(10000).emit('room:command',{type,payload},(err,answer)=>{
      if(err||!answer?.ok){this.toast(answer?.error||'Não foi possível salvar. Confira a conexão.');return;}
      if(type==='phase:solve'){this.play(920);this.setState({inputCode:'',activeNav:'missions',entryAnim:true});setTimeout(()=>this.setState({entryAnim:false}),800);}
      if(type==='hint:reveal')this.toast('Dica revelada. -20 pontos para a dupla.');
      if(type==='verdict:submit')this.play(900);
    });
  }
  async leaveRoom(){
    const auth=this.roomAuth;
    if(!auth)return;
    try{await apiJson(`/api/rooms/${encodeURIComponent(auth.code)}/leave`,{method:'POST',headers:{Authorization:`Bearer ${auth.token}`}});}catch(_){}
    if(this.socket){this.socket.disconnect();this.socket=null;}
    this.roomAuth=null;this.revision=-1;
    window.localStorage.removeItem('arquivo404-room-auth');
    this.setState({...freshState(),roomCode:'',roomMembers:[],presenceCount:0,connectStatus:'offline',networkError:'',teamDraft:'',playerNameDraft:'',joinCodeDraft:'',mobileMenu:false,modal:null});
  }
  copyRoomCode(){
    navigator.clipboard?.writeText(this.state.roomCode).then(()=>this.toast('Código copiado!')).catch(()=>this.toast(`Código da sala: ${this.state.roomCode}`));
  }
  go(nav){this.play(530);this.setState({activeNav:nav,mobileMenu:false},()=>window.scrollTo({top:0,behavior:'smooth'}));}
  toggleTimer(){this.command('timer:toggle');}
  reset(){this.setState({modal:'reset'});}
  performReset(){this.setState({modal:null,activeNav:'overview'});this.command('case:reset');}
  showHint(id){this.play(420);this.setState({modal:{type:'hint',id}});}
  claimHint(id){if(this.state.hinted.includes(id))return;this.command('hint:reveal',{phase:id});}
  checkCode(id){if(id!==this.state.phase||this.state.solved.includes(id))return;this.command('phase:solve',{phase:id,code:this.state.inputCode});}
  togglePin(id){this.command('evidence:pin',{id});}
  setAnswer(id,value){this.command('verdict:answer',{id,value});}
  setProof(id,value){this.command('verdict:proof',{id,value});}
  finishVerdict(){this.setState({modal:null});this.command('verdict:submit');}
  unlockedEvidence(){return EVIDENCE.filter(e=>e.phase===0||this.state.solved.includes(e.phase));}
  renderNav(){const {started,activeNav,report,solved}=this.state;return <nav className="side-nav" aria-label="Navegação do jogo">
    <div className="sidebar-brand"><div className="brand-mark"><Icon name="fingerprint" size={28}/></div><div><strong>ARQUIVO <b>404</b></strong><span>CENTRAL DE INVESTIGAÇÃO</span></div></div>
    <div className="nav-section-label">OPERAÇÃO VÉRTICE</div>
    {NAVS.map(n=><button key={n.id} className={'nav-item '+(activeNav===n.id?'selected':'')} onClick={()=>this.go(n.id)}><Icon name={n.icon} size={19}/><span>{n.name}</span>{n.id==='missions'&&solved.length>0&&<em>{solved.length}/4</em>}{n.id==='verdict'&&!report&&solved.length<4&&<Icon name="lock" size={13}/>}</button>)}
    <div className="nav-bottom">{this.state.roomCode&&<div className="coop-side-room"><span>SALA DA DUPLA</span><strong>{this.state.roomCode}</strong><small>{this.state.roomMembers.join(" · ")}</small><button onClick={()=>this.copyRoomCode()}><Icon name="copy" size={15}/> Copiar código</button><button className="coop-leave" onClick={()=>this.leaveRoom()}>Sair da sala</button></div>}<div className="protocol-id"><Icon name="shield" size={16}/><div><span>PROTOCOLO ATIVO</span><strong>VX / F–404</strong></div></div><div className="sidebar-line"/><div className="sidebar-help">Utilize o kit físico junto ao sistema. As evidências são complementares.</div><button className="nav-reset" onClick={()=>this.reset()}><Icon name="reset" size={16}/> Reiniciar investigação</button></div>
  </nav>}
  renderTopbar(){const {started,report,running,highContrast,sound,team}=this.state;const remain=Math.max(0,MAX_TIME-this.getElapsed());return <div className="topbar">
    <button className="mobile-menu-toggle icon-btn" onClick={()=>this.setState({mobileMenu:true})} aria-label="Abrir menu"><Icon name="menu" size={22}/></button>
    <div className="topbar-breadcrumb"><span>INSTITUTO VÉRTICE</span><Icon name="chevron" size={12}/><strong>CASO F-404</strong></div>
    <div className="topbar-right">
      {this.state.roomCode&&<button className="coop-top-room" onClick={()=>this.copyRoomCode()} title="Copiar código da sala"><span className={'coop-dot '+this.state.connectStatus}/><strong>{this.state.roomCode}</strong><span>{this.state.presenceCount}/2</span><Icon name="copy" size={14}/></button>}
      <span className={'live-status '+(report?'neutral':'')}><i/>{report?'ENCERRADO':started?'CASO EM ANDAMENTO':'AGUARDANDO INÍCIO'}</span>
      {started&&<div className="timer-top"><Icon name="clock" size={16}/><span className={remain===0?'out':''}>{niceTime(remain)}</span><button onClick={()=>this.toggleTimer()} title={running?'Pausar cronômetro':'Retomar cronômetro'}>{running?'Ⅱ':'▶'}</button></div>}
      <button title={sound?'Desligar sons':'Ligar sons'} className={'icon-btn top-icon '+(sound?'active':'')} onClick={()=>this.mutate({sound:!sound})}><Icon name={sound?'volume':'mute'} size={18}/></button>
      <button title="Alternar alto contraste" className={'icon-btn top-icon '+(highContrast?'active':'')} onClick={()=>this.mutate({highContrast:!highContrast})}><Icon name="adjust" size={18}/></button>
    </div>
  </div>}
  renderStart(){const {teamDraft}=this.state;return <div className="onboarding"><div className="start-frame"><div className="start-kicker"><span className="signal-dot"/> UMA EXPERIÊNCIA FÍSICA + DIGITAL <span>© VÉRTICE</span></div>
    <div className="start-layout"><div className="start-copy"><span className="tag amber"><Icon name="shield" size={13}/> ARQUIVO CONFIDENCIAL • 001</span><h1>O arquivo<br/><em>desapareceu.</em></h1><p>Três suspeitos. Quatro códigos. Uma verdade escondida entre o papel e a tela.</p><div className="case-meta"><span><Icon name="users" size={18}/> 2 INVESTIGADORES</span><span><Icon name="clock" size={18}/> 50 MINUTOS</span><span><Icon name="folder" size={18}/> 5 ENVELOPES</span></div>
    <div className="start-field coop-start-form">
      <label htmlFor="team">NOME DA DUPLA</label>
      <input id="team" value={teamDraft} onChange={e=>this.setState({teamDraft:e.target.value})} maxLength={34} placeholder="Ex.: Investigadores Vértice" />
      <label htmlFor="playerName">SEU NOME / APELIDO</label>
      <input id="playerName" value={this.state.playerNameDraft} onChange={e=>this.setState({playerNameDraft:e.target.value})} maxLength={28} placeholder="Ex.: Investigador 1" />
      <div className="coop-start-actions"><Action variant="solid" icon="users" disabled={this.state.networkBusy} onClick={()=>this.start()}>{this.state.networkBusy?'CONECTANDO...':'CRIAR SALA PARA DUPLA'}</Action></div>
      <div className="coop-join-line"><span>JÁ POSSUI UM CÓDIGO DE SALA?</span><div className="coop-join-input"><input aria-label="Código da sala" value={this.state.joinCodeDraft} onChange={e=>this.setState({joinCodeDraft:e.target.value.toUpperCase()})} onKeyDown={e=>e.key==='Enter'&&this.joinExisting()} maxLength={6} placeholder="EX.: Q7M2LX"/><Action variant="outlined" disabled={this.state.networkBusy} onClick={()=>this.joinExisting()}>ENTRAR</Action></div></div>
      {this.state.networkError&&<p className="coop-network-error" role="alert">{this.state.networkError}</p>}
    </div><div className="start-advice"><Icon name="lock" size={15}/> Separe o Envelope 00 antes de iniciar. Sem ele, a investigação fica incompleta.</div></div>
    <div className="start-art" aria-hidden="true"><div className="art-cross cross-one">+</div><div className="art-cross cross-two">+</div><div className="art-index">REF. 044—VX</div><div className="file-stack stack-back"/><div className="file-stack stack-mid"/><div className="case-file"><span className="file-stripe"/><div className="file-topline">INSTITUTO VÉRTICE <span>CLASSIFICADO</span></div><div className="file-center"><div className="file-stamp">RESTRITO</div><span>DOSSIÊ DE INVESTIGAÇÃO</span><strong>F<span>-</span>404</strong><div className="file-dash"/><small>LOCALIZAÇÃO DESCONHECIDA</small></div><div className="file-bottom"><span>18:18 / REGISTRO 04</span><span>ACESSO Nº 0004</span></div></div><div className="art-coordinate">-08.4738 / -34.8829</div></div></div>
    <div className="start-footer"><span>UMA HISTÓRIA FICTÍCIA • TODOS OS PERSONAGENS E REGISTROS SÃO INVENTADOS</span><span>PRONTO PARA INVESTIGAÇÃO</span></div></div></div>}
  renderHero(){const {team,solved,report}=this.state;return <section className="overview-hero"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-coordinates">SECURE ACCESS // CASE VX-044 / 2041</div><div className="hero-main-copy"><span className="hero-top-label"><span className="signal-dot"/> INVESTIGAÇÃO {report?'CONCLUÍDA':'EM ANDAMENTO'}</span><h1>O arquivo<br/><span>desapareceu.</span></h1><p>O F-404 sumiu às 18h18. A verdade está espalhada entre documentos, registros e o que ainda não foi dito.</p><Action icon="arrow" variant="light" onClick={()=>this.go(report?'verdict':'missions')}>{report?'VER RELATÓRIO FINAL':solved.length?'CONTINUAR INVESTIGAÇÃO':'ABRIR PRIMEIRA MISSÃO'}</Action></div><div className="hero-file-graphic"><div className="graphic-ring ring-a"/><div className="graphic-ring ring-b"/><div className="graphic-nucleus"><span>F / 404</span><div className="graphic-line"/><strong>NOT FOUND</strong><small>ARQUIVO PROTEGIDO</small></div><span className="g-side g-a">REC_18:18</span><span className="g-side g-b">VÉRTICE.OS</span></div><div className="hero-bar"><span>OPERAÇÃO DE RECUPERAÇÃO</span><span>INVESTIGADORES: {team.toUpperCase()}</span></div></section>}
  renderOverview(){const {solved,report,pinned}=this.state;const pct=solved.length/4*100;const current=PHASES[Math.min(solved.length,3)];return <div className="page-stack">{this.renderHero()}
    <section className="coop-panel"><div className="coop-panel-copy"><span className="eyebrow">INVESTIGAÇÃO COOPERATIVA · SINCRONIZAÇÃO EM TEMPO REAL</span><h3>Vocês estão na mesma sala.</h3><p>Quando um investigador resolve uma etapa, o outro recebe as provas, os pontos e o progresso sem atualizar a página.</p></div><div className="coop-panel-people"><span className="coop-room-code">{this.state.roomCode} <button onClick={()=>this.copyRoomCode()} title="Copiar"><Icon name="copy" size={15}/></button></span><div>{this.state.roomMembers.map((name,i)=><span key={i} className="coop-member"><i className={i<this.state.presenceCount?'active':''}/>{name}</span>)}</div><small>{this.state.connectStatus==='online'?'Conexão ativa':this.state.connectStatus==='connecting'?'Estabelecendo conexão...':'Sem conexão: ações suspensas'}</small></div></section>
    <div className="stat-grid"><div className="stat-card"><span><Icon name="folder" size={17}/> EVIDÊNCIAS DISPONÍVEIS</span><strong>{this.unlockedEvidence().length}<small> / 8</small></strong><div className="stat-tick">REGISTROS FÍSICOS + DIGITAIS</div></div><div className="stat-card"><span><Icon name="scan" size={17}/> FASES DESBLOQUEADAS</span><strong>{solved.length}<small> / 4</small></strong><div className="mini-meter"><i style={{width:pct+'%'}}/></div></div><div className="stat-card"><span><Icon name="bolt" size={17}/> PONTUAÇÃO ATUAL</span><strong>{this.getScore()}<small> / 650</small></strong><div className="stat-tick">INCLUI EVENTUAIS DICAS</div></div></div>
    <div className="dashboard-columns"><section className="paper-panel panel-current"><div className="panel-head"><div><SmallLabel>PRÓXIMA ETAPA</SmallLabel><h3>{report?'Investigação encerrada':solved.length===4?'Emitir veredito':`0${current.id} / ${current.title}`}</h3></div><span className="angular-tag">{report?'ENCERRADO':solved.length===4?'PRONTO':'EM ABERTO'}</span></div><p>{report?'O relatório da equipe foi registrado. Confira as conclusões e a pontuação final.':solved.length===4?'Todas as evidências foram reunidas. É hora de conectar as provas e registrar suas conclusões.':current.description}</p><div className="divider-line"/><div className="current-foot"><span><Icon name="folder" size={17}/> {report?'DOSSIÊ CONCLUÍDO':solved.length===4?'ENVELOPE 04':`ABRIR ENVELOPE ${current.envelope}`}</span><button className="text-link" onClick={()=>this.go(solved.length===4?'verdict':'missions')}>ACESSAR <Icon name="arrow" size={16}/></button></div></section>
    <section className="paper-panel panel-log"><div className="panel-head"><div><SmallLabel>ÚLTIMOS REGISTROS</SmallLabel><h3>Rastro do caso</h3></div><button className="text-link" onClick={()=>this.go('comms')}>VER TODOS <Icon name="arrow" size={15}/></button></div><div className="mini-log">{LOGS.slice(-3).map((log,i)=><div className="mini-log-row" key={log.time}><time>{log.time}</time><div><strong>{log.title}</strong><span>{log.desc}</span></div><i/></div>)}</div></section></div>
    <section className="paper-panel investigators-strip"><div className="panel-head"><div><SmallLabel>PESSOAS DE INTERESSE</SmallLabel><h3>Três versões. Uma história.</h3></div><button className="text-link" onClick={()=>this.go('suspects')}>ANALISAR PERFIS <Icon name="arrow" size={16}/></button></div><div className="suspect-mini-grid">{SUSPECTS.map((s,i)=><button onClick={()=>this.mutate({detailSuspect:s.id,activeNav:'suspects'})} className="suspect-mini" key={s.id}><div className={'avatar small-avatar '+s.color}><span>{s.id}</span><i/></div><div><strong>{s.name}</strong><span>{s.role}</span></div><Icon name="chevron" size={16}/></button>)}</div></section>
  </div>}
  renderPhaseVisual(id){if(id===1)return <div className="intel-timeline">{LOGS.map((e,i)=><div className="intel-row" key={i}><div className="intel-time">{e.time.slice(0,5)}</div><div className="intel-marker"/><div className="intel-event"><span>{e.type} · EVT_{String(i+1).padStart(2,'0')}</span><strong>{e.title}</strong></div></div>)}</div>;
    if(id===2)return <div className="camera-view"><div className="camera-scanline"/><div className="camera-corner top-left"/><div className="camera-corner top-right"/><div className="camera-corner bottom-left"/><div className="camera-corner bottom-right"/><div className="camera-noise"/><div className="camera-circle"><Icon name="scan" size={66}/></div><div className="camera-overlay">CAM_04 / CORREDOR LATERAL <span>18:16:07</span></div><div className="camera-label">IMAGEM RECUPERADA PARCIALMENTE</div></div>;
    if(id===3)return <div className="cipher-box"><div className="cipher-left"><SmallLabel>IDENTIFICAÇÃO PROTEGIDA</SmallLabel><strong>OLD</strong><span>Criptografia: deslocamento +3</span></div><div className="cipher-arrow"><Icon name="arrow" size={26}/></div><div className="cipher-right"><SmallLabel>DECODIFICAÇÃO</SmallLabel><div>?</div><small>USE O DISCO DO ENVELOPE 03</small></div></div>;
    return <div className="fragment-visual"><div className="fragment-paper f-a">ANOTAÇÃO RECUPERADA<span>01 / 04</span></div><div className="fragment-paper f-b">REGISTRO DANIFICADO<span>02 / 04</span></div><div className="fragment-paper f-c">ACESSO RESTRITO<span>03 / 04</span></div><div className="fragment-paper f-d">ORDEM DESCONHECIDA<span>04 / 04</span></div></div>;
  }
  renderMissions(){const {solved,phase,inputCode,entryAnim}=this.state;const current=PHASES.find(p=>p.id===Math.min(phase,4));return <div className="page-stack"><SectorHeading index="01" label="DOSSIÊ DE OPERAÇÃO" title="Sequência de missões" right={<div className="mission-counter"><Icon name="shield" size={16}/> {solved.length} DE 4 ETAPAS CONCLUÍDAS</div>}/><div className="stepper">{PHASES.map(p=><button key={p.id} disabled={p.id>phase} onClick={()=>solved.includes(p.id)?this.setState({modal:{type:'review',id:p.id}}):this.toast('Esta é a etapa ativa.')} className={'step '+(solved.includes(p.id)?'complete':phase===p.id?'current':'locked')}><span>{solved.includes(p.id)?<Icon name="check" size={18}/>:p.id>phase?<Icon name="lock" size={16}/>:String(p.id).padStart(2,'0')}</span><div><strong>{p.title}</strong><small>{solved.includes(p.id)?'CONCLUÍDA':phase===p.id?'EM ANÁLISE':'AGUARDANDO'}</small></div></button>)}</div>
    {phase<=4 && <div className={'mission-layout '+(entryAnim?'mission-success':'')}><section className="mission-primary"><div className="mission-brief"><div className="mission-brief-top"><span className="tag amber">MISSÃO 0{phase}</span><span className="tag ghost"><Icon name="lock" size={12}/> ENVELOPE {current.envelope}</span></div><SmallLabel>{current.eyebrow}</SmallLabel><h2>{current.title}</h2><p>{current.description}</p></div>
    <div className="visual-panel"><div className="visual-heading"><span>FONTE // SISTEMA VÉRTICE</span><span>CANAL SEGURO</span></div>{this.renderPhaseVisual(phase)}</div>
    <div className="mission-answer"><div><SmallLabel>CONFIRMAÇÃO DE EVIDÊNCIA</SmallLabel><h3>{current.prompt}</h3><p>Combine o material impresso com os registros exibidos no sistema.</p></div><form className="code-form" onSubmit={e=>{e.preventDefault();this.checkCode(phase);}}><div className="input-underline"><Icon name="terminal" size={19}/><input autoComplete="off" spellCheck="false" aria-label={current.prompt} placeholder={current.placeholder} value={inputCode} onChange={e=>this.setState({inputCode:e.target.value})}/></div><Action variant="solid" icon="arrow" type="submit">VALIDAR CÓDIGO</Action></form></div></section>
    <aside className="mission-side"><div className="side-detail"><div className="side-detail-head"><Icon name="folder" size={18}/><span>KIT FÍSICO</span></div><span className="large-index">{current.envelope}</span><h3>Abra o envelope {current.envelope}</h3><p>As peças físicas são indispensáveis nesta etapa.</p></div><div className="side-detail muted"><div className="side-detail-head"><Icon name="help" size={18}/><span>PRECISA DE AJUDA?</span></div><h3>Uma pista pode mudar tudo.</h3><p>Uma dica custa 20 pontos. Use apenas quando necessário.</p><Action variant="outlined" icon="help" onClick={()=>this.showHint(phase)}>{this.state.hinted.includes(phase)?'REVER DICA':'SOLICITAR DICA'}</Action></div><div className="secure-note"><Icon name="shield" size={17}/> Apenas um código correto libera a etapa seguinte.</div></aside></div>}
    {phase>=5&&<div className="case-unlocked"><div className="check-emblem"><Icon name="check" size={40}/></div><SmallLabel>ARQUIVO RECONSTITUÍDO</SmallLabel><h2>As quatro camadas foram rompidas.</h2><p>O sistema reuniu registros suficientes. O próximo passo é interpretar as provas e assinar o veredito.</p><Action variant="solid" icon="arrow" onClick={()=>this.go('verdict')}>IR AO VEREDITO</Action></div>}
    <section className="mission-archive"><SmallLabel>ARQUIVO DE ETAPAS</SmallLabel><div className="archive-list">{PHASES.filter(p=>solved.includes(p.id)).map(p=><div className="archive-item" key={p.id}><div className="archive-number">0{p.id}</div><div><strong>{p.label}</strong><span>{p.title} · PROTOCOLO {p.proof}</span></div><Icon name="check" size={20}/></div>)}{solved.length===0&&<div className="empty-archive">Nenhuma evidência digital liberada até o momento.</div>}</div></section>
  </div>}
  renderSuspects(){const {detailSuspect}=this.state;const cur=SUSPECTS.find(s=>s.id===detailSuspect)||SUSPECTS[0];return <div className="page-stack"><SectorHeading index="02" label="PESSOAS DE INTERESSE" title="Dossiês dos suspeitos" right={<span className="count-label">03 ARQUIVOS IDENTIFICADOS</span>}/><div className="suspects-layout"><div className="suspect-tile-list">{SUSPECTS.map((s,i)=><button className={'suspect-tile '+(s.id===detailSuspect?'active':'')} onClick={()=>this.setState({detailSuspect:s.id})} key={s.id}><div className={'avatar '+s.color}><span>{s.id}</span><i/></div><div className="suspect-tile-name"><small>PERFIL 0{i+1}</small><strong>{s.name}</strong><span>{s.role}</span></div><Icon name="chevron" size={18}/></button>)}</div><section className="suspect-file"><div className="suspect-file-top"><SmallLabel>VÉRTICE / PERFIL PESSOAL</SmallLabel><span className="tag outline-dark">NÃO CONFIRMADO</span></div><div className="suspect-file-main"><div className={'suspect-photo '+cur.color}><div className="photo-grid"/><div className="photo-silhouette"><div className="head-shape"/><div className="torso-shape"/></div><span>FOTO RESTRITA / ID {cur.id}</span></div><div className="suspect-bio"><SmallLabel>FICHA INDIVIDUAL</SmallLabel><h2>{cur.name}</h2><span className="role-line">{cur.role}</span><div className="bio-rule"/><p>{cur.desc}</p><div className="info-pair"><span>ÚLTIMA ÁREA CONHECIDA</span><strong>{cur.location}</strong></div><div className="info-pair"><span>REGISTRO EM DESTAQUE</span><strong>{cur.tag}</strong></div></div></div><div className="suspect-file-bottom"><div><SmallLabel>NOTA DE INVESTIGAÇÃO</SmallLabel><p>{cur.detail}</p></div><div><SmallLabel>QUESTÃO EM ABERTO</SmallLabel><p>{cur.question}</p></div></div></section></div><div className="footnote-panel"><Icon name="shield" size={18}/><p>Um registro isolado não é uma conclusão. Compare o horário, a credencial e as declarações antes de emitir qualquer acusação.</p></div></div>}
  renderEvidence(){const {pinned,searchQuery,evidenceType,solved}=this.state;const list=this.unlockedEvidence();const types=['Todas','Físicas','Digitais','Fixadas'];const filtered=list.filter(e=>{const q=searchQuery.toLowerCase();const matches=(e.title+' '+e.detail+' '+e.id).toLowerCase().includes(q);return matches&&(evidenceType==='Todas'||(evidenceType==='Físicas'&&e.phase===0)||(evidenceType==='Digitais'&&e.phase>0)||(evidenceType==='Fixadas'&&pinned.includes(e.id)));});return <div className="page-stack"><SectorHeading index="03" label="ARQUIVO DE PROVAS" title="Inventário de evidências" right={<span className="count-label">{list.length} DE 8 DISPONÍVEIS</span>}/><div className="evidence-tools"><div className="evidence-search"><Icon name="search" size={19}/><input aria-label="Pesquisar evidências" value={searchQuery} onChange={e=>this.setState({searchQuery:e.target.value})} placeholder="Pesquisar por nome, código ou descrição..."/></div><div className="filter-chips">{types.map(t=><button key={t} className={t===evidenceType?'selected':''} onClick={()=>this.setState({evidenceType:t})}>{t}</button>)}</div></div><div className="evidence-card-grid">{filtered.map(e=><article className="evidence-tile" key={e.id}><div className="evidence-tile-header"><span className="doc-mark"><Icon name={e.phase===0?'file':'scan'} size={22}/></span><button className={'pin-btn '+(pinned.includes(e.id)?'active':'')} onClick={()=>this.togglePin(e.id)} aria-label={pinned.includes(e.id)?'Desafixar prova':'Fixar prova'} title={pinned.includes(e.id)?'Desafixar':'Fixar no painel'}><Icon name="pin" size={18}/></button></div><SmallLabel>{e.type.toUpperCase()}</SmallLabel><h3>{e.title}</h3><p>{e.detail}</p><div className="evidence-tile-foot"><span>{e.id} / {e.phase===0?'ENVELOPE 01':`FASE 0${e.phase}`}</span><span className="tag outline-dark">{e.phase===0?'DOCUMENTO':'DESBLOQUEADA'}</span></div></article>)}{!filtered.length&&<div className="no-results"><Icon name="search" size={32}/><h3>Não encontramos provas com esse filtro.</h3><p>Tente outra busca ou conclua novas fases para liberar outros registros.</p></div>}</div><div className="evidence-footer"><div><SmallLabel>CONTROLE DE ACESSO</SmallLabel><h3>{4-solved.length} arquivos digitais ainda bloqueados</h3><p>Novas provas são adicionadas quando as missões são concluídas.</p></div><Action variant="outlined" icon="arrow" onClick={()=>this.go('missions')}>IR ÀS MISSÕES</Action></div></div>}
  renderComms(){const {solved,speaker}=this.state;return <div className="page-stack"><SectorHeading index="04" label="REGISTROS DO SISTEMA" title="Comunicações e rastros" right={<span className="count-label">DOSSIÊ / TERMINAL 04</span>}/><div className="comms-layout"><section className="comms-main paper-panel"><div className="section-toolbar"><SmallLabel>LOG CRONOLÓGICO</SmallLabel><span className="tag outline-dark">5 EVENTOS</span></div><div className="comms-timeline">{LOGS.map((l,i)=><div key={l.time} className={'log-card '+(i===4?'alert':'')}><time>{l.time}</time><div className="log-rail"><i/></div><div><SmallLabel>{l.type}</SmallLabel><h3>{l.title}</h3><p>{l.desc}</p></div></div>)}</div></section><aside className="comms-aside"><div className="terminal-window"><div className="terminal-bar"><div><i/><i/><i/></div><span>VERTICE.OS / TERMINAL 04</span></div><div className="terminal-body"><span className="terminal-comment"># SISTEMA DE ARQUIVOS</span><p><b>$</b> scan /arquivo/F-404</p><p><i>verificando...</i></p><p className="term-alert">ERRO 404: FILE NOT FOUND</p><p><b>$</b> tail -n 3 auth.log</p><p>18:16 / T-27 / acesso concedido</p><p>18:18 / hugo.v / sessão ativa</p><p><b>$</b> <span className="cursor">_</span></p></div></div><div className="paper-panel voice-panel"><div className="section-toolbar"><SmallLabel>DEPOIMENTOS</SmallLabel><span className="tag outline-dark">{solved.includes(3)?'ARQUIVOS LIBERADOS':'BLOQUEADO'}</span></div>{solved.includes(3)?<div><div className="voice-tabs">{VOICES.map((v,i)=><button key={i} className={i===speaker?'active':''} onClick={()=>this.setState({speaker:i})}>{v.name.split(' ')[0]}</button>)}</div><div className="voice-player"><div className="voice-icon"><Icon name="message" size={24}/></div><div><SmallLabel>TRANSCRIÇÃO / {VOICES[speaker].time}</SmallLabel><h3>{VOICES[speaker].name}</h3><p>“{VOICES[speaker].quote.replace(/^“|”$/g,'')}”</p><div className="voice-flag"><Icon name="check" size={14}/>{VOICES[speaker].flag}</div></div></div></div>:<div className="voice-locked"><Icon name="lock" size={27}/><h3>Interrogatórios protegidos</h3><p>Conclua a Fase 03 para liberar os depoimentos.</p></div>}</div></aside></div></div>}
  renderVerdict(){const {solved,answers,proofs,decision,report}=this.state;const avail=this.unlockedEvidence();if(solved.length<4)return <div className="verdict-locked"><div className="verdict-lock-circle"><Icon name="lock" size={44}/></div><SmallLabel>ACESSO NÃO AUTORIZADO</SmallLabel><h1>O veredito ainda está bloqueado.</h1><p>Para emitir uma conclusão consistente, sua equipe precisa concluir todas as quatro missões e recuperar o registro final.</p><div className="verdict-progress"><div className="mini-meter"><i style={{width:(solved.length/4*100)+'%'}}/></div><span>{solved.length} / 4 MISSÕES CONCLUÍDAS</span></div><Action variant="solid" icon="arrow" onClick={()=>this.go('missions')}>CONTINUAR INVESTIGAÇÃO</Action></div>;
    if(report){const score=this.getScore();const grade=score>=620?'EXCELÊNCIA':score>=500?'CASO RESOLVIDO':score>=350?'PARCIAL':'INCONCLUSIVO';return <div className="page-stack"><SectorHeading index="05" label="RELATÓRIO DE ENCERRAMENTO" title="Veredito registrado" right={<span className="tag amber">{grade}</span>}/><div className="report-hero"><div><SmallLabel>CLASSIFICAÇÃO FINAL</SmallLabel><h1>{grade}</h1><p>Investigação encerrada para <strong>{this.state.team}</strong>.</p><Action variant="light" icon="download" onClick={()=>downloadReport({...this.state,elapsedMs:this.getElapsed()},score)}>BAIXAR RELATÓRIO</Action></div><div className="report-score"><span>PONTUAÇÃO</span><strong>{score}</strong><small>DE 650 PONTOS</small></div></div><div className="report-metrics"><div><span>VEREDITOS FUNDAMENTADOS</span><strong>{report.supported} / 4</strong></div><div><span>ETAPAS CONCLUÍDAS</span><strong>4 / 4</strong></div><div><span>DICAS UTILIZADAS</span><strong>{this.state.hinted.length}</strong></div><div><span>TEMPO TOTAL</span><strong>{formatClock(this.getElapsed())}</strong></div></div><div className="paper-panel final-story"><SmallLabel>O QUE DE FATO ACONTECEU</SmallLabel><h2>Nem todo desaparecimento é um roubo.</h2><p>Lia Torres transferiu o Arquivo F-404 para o Cofre B depois de acessar a sala técnica com a credencial T-27. A sessão de Hugo havia permanecido aberta. Sua intenção era impedir que depoimentos fossem exibidos sem autorização — embora o método usado não tenha sido adequado.</p><p>A decisão responsável é recuperar o conteúdo e concluir as autorizações antes de torná-lo público.</p><div className="story-sign"><Icon name="shield" size={18}/> INSTITUTO VÉRTICE · CASO ENCERRADO</div></div><Action variant="outlined" icon="reset" onClick={()=>this.reset()}>INICIAR NOVA PARTIDA</Action></div>}
    return <div className="page-stack"><SectorHeading index="05" label="JULGAMENTO FINAL" title="Assine o seu veredito" right={<span className="tag amber">5 DECISÕES</span>}/><div className="verdict-intro"><Icon name="scale" size={31}/><div><h3>Acusar não é suficiente. É preciso provar.</h3><p>Registre as quatro conclusões e associe cada uma a uma evidência. Cada resposta fundamentada vale até 50 pontos.</p></div></div><div className="verdict-form">{VERDICT_FIELDS.map(q=><section className="verdict-question" key={q.id}><div><SmallLabel>REGISTRO {q.label.slice(0,2)}</SmallLabel><h3>{q.label.slice(5)}</h3></div><div className="verdict-question-inputs"><label>CONCLUSÃO<select value={answers[q.id]||''} onChange={e=>this.setAnswer(q.id,e.target.value)}><option value="">Selecione sua hipótese...</option>{q.options.map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>EVIDÊNCIA QUE SUSTENTA<select value={proofs[q.id]||''} onChange={e=>this.setProof(q.id,e.target.value)}><option value="">Escolha uma evidência...</option>{avail.map(e=><option key={e.id} value={e.id}>{e.id} · {e.title}</option>)}</select></label></div></section>)}<section className="verdict-question decision"><SmallLabel>DECISÃO ÉTICA / +50 PONTOS</SmallLabel><h3>O que a equipe recomenda fazer com o arquivo?</h3><div className="decision-options">{['Recuperar e divulgar tudo imediatamente','Recuperar o arquivo e aguardar as autorizações antes de divulgar','Apagar definitivamente o arquivo'].map(x=><label key={x} className={'radio-card '+(decision===x?'selected':'')}><input type="radio" name="decision" checked={decision===x} onChange={()=>this.command('verdict:decision',{value:x})}/><span>{x}</span>{decision===x&&<Icon name="check" size={18}/>}</label>)}</div></section><button className="submit-verdict" onClick={()=>this.mutate({modal:'submit'})}><Icon name="shield" size={22}/> REGISTRAR VEREDITO E ENCERRAR CASO <Icon name="arrow" size={21}/></button></div></div>}
  renderModal(){
    const modal=this.state.modal;
    if(!modal)return null;
    const hint=typeof modal==='object'&&modal.type==='hint';
    const review=typeof modal==='object'&&modal.type==='review';
    const reset=modal==='reset';
    const revealed=hint&&this.state.hinted.includes(modal.id);
    const phase=(hint||review)?PHASES[modal.id-1]:null;
    const title=hint?`Dica da Missão 0${modal.id}`:review?`Missão 0${modal.id} — ${phase.title}`:reset?'Reiniciar investigação?':'Encerrar o caso agora?';
    const body=hint?(revealed?phase.hint:'Uma pequena orientação para o enigma atual será revelada após confirmar a utilização da dica.'):
      review?`Etapa concluída. Registro arquivado: ${phase.label}.`:
      reset?'O progresso, o tempo, a pontuação e o relatório desta dupla serão apagados deste navegador.':
      'O sistema vai registrar o veredito da equipe, conferir as evidências selecionadas e calcular a pontuação. Esta decisão encerra a partida.';
    return <div role="presentation" className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)this.setState({modal:null})}}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label={title}>
        <button className="dialog-close" aria-label="Fechar" onClick={()=>this.setState({modal:null})}><Icon name="x" size={19}/></button>
        <div className="dialog-icon"><Icon name={hint?'help':review?'file':reset?'reset':'shield'} size={25}/></div>
        <SmallLabel>{hint?'SISTEMA DE APOIO':review?'ARQUIVO DE MISSÕES':reset?'REINICIAR PROTOCOLO':'CONFIRMAÇÃO FINAL'}</SmallLabel>
        <h2>{title}</h2><p>{body}</p>
        {hint&&<div className="dialog-footnote"><Icon name="bolt" size={16}/>{revealed?'Dica já registrada. Não haverá novo desconto.':'A dica reduzirá a pontuação em 20 pontos.'}</div>}
        <div className="dialog-actions"><Action variant="outlined" onClick={()=>this.setState({modal:null})}>{revealed||review?'FECHAR':'CANCELAR'}</Action>
          {!revealed&&!review&&<Action variant="solid" icon={reset?'reset':'check'} onClick={()=>hint?this.claimHint(modal.id):reset?this.performReset():this.setState({modal:null},()=>this.finishVerdict())}>{hint?'REVELAR DICA':reset?'REINICIAR':'ENCERRAR CASO'}</Action>}
        </div>
      </div>
    </div>;
  }
  render(){const {started,activeNav,toast,mobileMenu,highContrast}=this.state;return <div className={'app '+(highContrast?'high-contrast':'')}>
    {!started?this.renderStart():<div className="app-layout"><aside className="desktop-sidebar">{this.renderNav()}</aside>{mobileMenu&&<div className="mobile-overlay" onMouseDown={()=>this.setState({mobileMenu:false})}><div className="mobile-menu" onMouseDown={e=>e.stopPropagation()}><button aria-label="Fechar menu" className="mobile-close" onClick={()=>this.setState({mobileMenu:false})}><Icon name="x" size={20}/></button>{this.renderNav()}</div></div>}<div className="main-area">{this.renderTopbar()}<main id="main-content" className="main-content">{activeNav==='overview'&&this.renderOverview()}{activeNav==='missions'&&this.renderMissions()}{activeNav==='suspects'&&this.renderSuspects()}{activeNav==='evidence'&&this.renderEvidence()}{activeNav==='comms'&&this.renderComms()}{activeNav==='verdict'&&this.renderVerdict()}</main><footer className="page-footer"><span>ARQUIVO 404 — UMA EXPERIÊNCIA DE INVESTIGAÇÃO FICTÍCIA</span><span>VÉRTICE SECURITY DIVISION · VX/404</span></footer></div><nav className="mobile-bottom-nav" aria-label="Navegação rápida">{NAVS.slice(0,6).map(n=><button key={n.id} className={activeNav===n.id?'active':''} onClick={()=>this.go(n.id)}><Icon name={n.icon} size={19}/><span>{n.name}</span></button>)}</nav></div>}
    {this.renderModal()}{toast&&<div className="toast" role="status"><Icon name="activity" size={18}/><span>{toast}</span><button aria-label="Fechar notificação" onClick={()=>this.setState({toast:''})}><Icon name="x" size={17}/></button></div>}
  </div>}
}
