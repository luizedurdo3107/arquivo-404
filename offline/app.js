const CASE = 'ARQUIVO 404';
const KEY = 'arquivo404-react-v3';
const MAX_TIME = 50 * 60 * 1000;
const CODE = { 1: 'ABRIR', 2: 'COFRE', 3: 'LIA', 4: '5814' };
const ICON_PATHS = {
    grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
    folder: ['M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
    fingerprint: ['M12 11c-1.66 0-3 1.34-3 3 0 3-1 5-2 6', 'M12 7a7 7 0 0 0-7 7c0 2-.4 4-1.4 6', 'M12 3a11 11 0 0 0-11 11', 'M12 11c1.66 0 3 1.34 3 3 0 3 1 5 2 6', 'M12 7a7 7 0 0 1 7 7c0 2 .4 4 1.4 6', 'M12 3a11 11 0 0 1 11 11'],
    scan: ['M4 9V5a1 1 0 0 1 1-1h4', 'M15 4h4a1 1 0 0 1 1 1v4', 'M20 15v4a1 1 0 0 1-1 1h-4', 'M9 20H5a1 1 0 0 1-1-1v-4', 'M4 12h16'],
    users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    message: ['M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z'],
    scale: ['M12 3v18', 'M3 6h18', 'M5 6l-3 6a5 5 0 0 0 6 0L5 6z', 'M19 6l-3 6a5 5 0 0 0 6 0l-3-6z', 'M7 21h10'],
    arrow: ['M5 12h14', 'M12 5l7 7-7 7'],
    chevron: ['M9 18l6-6-6-6'],
    clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20', 'M12 6v6l4 2'],
    bolt: ['M13 2 3 14h8l-1 8 11-12h-8z'],
    lock: ['M4 11h16v10H4z', 'M8 11V7a4 4 0 0 1 8 0v4'],
    unlock: ['M4 11h16v10H4z', 'M8 11V7a4 4 0 0 1 8 0'],
    search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16', 'M21 21l-4.35-4.35'],
    file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
    check: ['M20 6 9 17l-5-5'],
    shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
    help: ['M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01', 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20'],
    reset: ['M3 12a9 9 0 1 0 3-6.7', 'M3 3v6h6'],
    volume: ['M11 5 6 9H3v6h3l5 4z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M19 5a10 10 0 0 1 0 14'],
    mute: ['M11 5 6 9H3v6h3l5 4z', 'M16 9l5 6', 'M21 9l-5 6'],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    x: ['M18 6 6 18', 'M6 6l12 12'],
    terminal: ['M4 17l6-5-6-5', 'M12 19h8'],
    eye: ['M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7S2 12 2 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6'],
    pin: ['M16 9V4l1-1H7l1 1v5l-2 3v1h12v-1z', 'M12 13v8'],
    star: ['m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1z'],
    send: ['m22 2-7 20-4-9-9-4 20-7z', 'M22 2 11 13'],
    activity: ['M3 12h4l3-8 4 16 3-8h4'],
    clipboard: ['M9 4h6v4H9z', 'M5 6H4v16h16V6h-1', 'M8 13h8', 'M8 17h8'],
    download: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 17v4h16v-4'],
    adjust: ['M4 7h16', 'M4 17h16', 'M8 4v6', 'M16 14v6'],
    spark: ['m12 2 1.5 7 7 1.5-7 1.5-1.5 7-1.5-7-7-1.5 7-1.5z'],
    copy: ['M8 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2', 'M10 2h10v14H10z'],
    back: ['M19 12H5', 'M12 19l-7-7 7-7']
};
function Icon({ name, size = 18, strokeWidth = 1.8 }) {
    return React.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 24 24", width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" }, (ICON_PATHS[name] || ICON_PATHS.file).map((d, i) => React.createElement("path", { key: i, d: d })));
}
function SmallLabel({ children, tone = '' }) { return React.createElement("span", { className: 'eyebrow ' + tone }, children); }
function Action({ children, variant = '', icon, onClick, disabled = false, type = 'button', className = '' }) { return React.createElement("button", { type: type, disabled: disabled, className: 'action ' + variant + ' ' + className, onClick: onClick },
    icon && React.createElement(Icon, { name: icon, size: 17 }),
    React.createElement("span", null, children)); }
function SectorHeading({ index, label, title, right }) { return React.createElement("div", { className: "sector-heading" },
    React.createElement("div", null,
        React.createElement(SmallLabel, null,
            index,
            " / ",
            label),
        React.createElement("h2", null, title)),
    right); }
// Class-based components are compatible with the included offline React build.
const PHASES = [
    { id: 1, eyebrow: 'SEQUÊNCIA DOS FATOS', title: 'Linha do tempo', short: 'Reconstrua a última hora', description: 'Os documentos chegaram fora de ordem. O sistema possui os horários; o Envelope 01 guarda os eventos e suas letras.', action: 'Identificar sequência', prompt: 'Senha formada pelas letras dos cartões', placeholder: 'Digite a palavra de cinco letras', hint: 'O sistema informa a ordem cronológica. Coloque os cartões físicos na mesma sequência e leia as letras.', envelope: '01', proof: 'T-01', label: 'Linha do tempo validada' },
    { id: 2, eyebrow: 'REGISTRO VISUAL', title: 'Câmera 04', short: 'Revele a informação oculta', description: 'Um registro de câmera foi reduzido a uma matriz. Apenas a sobreposição com o visor físico revela o próximo termo.', action: 'Decodificar registro', prompt: 'Qual palavra o visor revela?', placeholder: 'Digite a palavra revelada', hint: 'Use o visor do Envelope 02 sobre a matriz, alinhando as marcas triangulares. Leia as janelas na ordem.', envelope: '02', proof: 'C-04', label: 'Registro visual decodificado' },
    { id: 3, eyebrow: 'CREDENCIAL DE ACESSO', title: 'Identidade cifrada', short: 'Desvende a credencial T-27', description: 'Um acesso às 18h16 aparece associado a uma identificação criptografada. A sessão ativa nem sempre revela quem operou o terminal.', action: 'Decodificar identidade', prompt: 'Qual nome está protegido pelo código?', placeholder: 'Digite o nome decodificado', hint: 'Use o disco físico. Se cada letra foi avançada três posições para cifrar, faça o movimento inverso.', envelope: '03', proof: 'A-27', label: 'Vínculo da credencial identificado' },
    { id: 4, eyebrow: 'ARQUIVO FRAGMENTADO', title: 'A mensagem perdida', short: 'Reconstrua a última nota', description: 'Uma mensagem foi dividida em quatro partes. As frases revelam a combinação quando organizadas em uma ordem coerente.', action: 'Acessar compartimento', prompt: 'Digite os quatro números na ordem correta', placeholder: 'Código de quatro dígitos', hint: 'Monte primeiro a frase completa com as peças do Envelope 04. Só depois leia os números de cada uma.', envelope: '04', proof: 'M-14', label: 'Documento integral reconstituído' }
];
const SUSPECTS = [
    { id: 'HV', name: 'Hugo Vale', role: 'Técnico de suporte', tag: 'Sessão identificada', color: 'blue', desc: 'Prestava suporte aos computadores do evento. Seu usuário foi registrado no momento da movimentação, embora ele afirme ter saído para resolver um problema na impressora.', detail: 'O comprovante físico mostra uma impressão iniciada às 18h07. O login não confirma, isoladamente, quem usou o computador.', location: 'Sala técnica / impressora', question: 'Se o login era dele, quem mais tinha acesso ao terminal?' },
    { id: 'CM', name: 'Clara Melo', role: 'Coordenação estudantil', tag: 'Responsável pelo evento', color: 'gold', desc: 'Organizava a exposição Cápsula do Tempo e tinha motivos para manter o cronograma. Diz que estava no auditório revisando a apresentação.', detail: 'O roteiro foi entregue às 18h02, mas esse registro não cobre todo o período investigado.', location: 'Auditório', question: 'A pressão do prazo poderia motivar alguma ocultação?' },
    { id: 'LT', name: 'Lia Torres', role: 'Editora de depoimentos', tag: 'Solicitou adiamento', color: 'red', desc: 'Tinha acesso aos relatos da exposição e pediu que certos conteúdos não fossem exibidos antes da liberação dos autores.', detail: 'A mensagem enviada às 18h11 menciona falta de autorização. O pedido precisa ser comparado com os registros de acesso.', location: 'Produção audiovisual', question: 'A preocupação com as autorizações explica o desaparecimento?' }
];
const EVIDENCE = [
    { id: 'E-01', title: 'Comprovante de impressão', type: 'Documento físico', phase: 0, detail: 'Impressão de etiquetas solicitada por hugo.v às 18h07; concluída às 18h09.' },
    { id: 'E-02', title: 'Roteiro do auditório', type: 'Documento físico', phase: 0, detail: 'A entrega do roteiro por Clara foi confirmada às 18h02.' },
    { id: 'E-03', title: 'Aviso de autorizações', type: 'Mensagem física', phase: 0, detail: 'Lia pediu o adiamento da exibição por falta de autorizações às 18h11.' },
    { id: 'E-04', title: 'Registro da porta', type: 'Acesso físico', phase: 0, detail: 'O sensor acusou passagem da credencial T-27 às 18h16.' },
    { id: 'T-01', title: 'Sequência dos acontecimentos', type: 'Análise digital', phase: 1, detail: 'Os horários e os cartões foram confrontados. A movimentação ocorreu às 18h18, depois da abertura da sala técnica.' },
    { id: 'C-04', title: 'Pista do compartimento', type: 'Imagem decodificada', phase: 2, detail: 'A análise visual da câmera indicou um compartimento protegido no sistema.' },
    { id: 'A-27', title: 'Credencial e sessão cruzadas', type: 'Registro de autenticação', phase: 3, detail: 'A identidade decifrada e o acesso T-27 contrastam com o nome da sessão hugo.v.' },
    { id: 'M-14', title: 'Mensagem reconstituída', type: 'Documento recuperado', phase: 4, detail: 'A nota justifica o armazenamento restrito pelo problema das autorizações.' }
];
const LOGS = [
    { time: '18:02:00', type: 'AÇÃO', title: 'Roteiro de abertura entregue', desc: 'Registro do auditório' },
    { time: '18:07:00', type: 'SERVIÇO', title: 'Impressão de etiquetas iniciada', desc: 'Terminal de suporte' },
    { time: '18:11:00', type: 'MENSAGEM', title: 'Pedido de adiamento protocolado', desc: 'Caixa interna de mensagens' },
    { time: '18:16:00', type: 'SENSOR', title: 'Porta da sala técnica aberta', desc: 'Credencial identificada: T-27' },
    { time: '18:18:00', type: 'ALERTA', title: 'Arquivo F-404 não localizado', desc: 'Última sessão: hugo.v' }
];
const VOICES = [
    { name: 'Hugo Vale', time: '18:24', role: 'SUPORTE', quote: 'Saí para resolver um problema na impressora. O computador da sala técnica ficou ligado — e eu não encerrei minha sessão.', flag: 'A sessão estava aberta.' },
    { name: 'Clara Melo', time: '18:27', role: 'ORGANIZAÇÃO', quote: 'Eu estava tentando terminar o roteiro. Era importante que o evento não atrasasse, mas não mexi no sistema de arquivos.', flag: 'A entrega do roteiro foi registrada.' },
    { name: 'Lia Torres', time: '18:31', role: 'EDIÇÃO', quote: 'Eu avisei que alguns depoimentos ainda não estavam autorizados. Não queria que aqueles relatos fossem expostos daquele jeito.', flag: 'Há uma mensagem anterior confirmando o aviso.' }
];
const NAVS = [
    { id: 'overview', name: 'Central', icon: 'grid' },
    { id: 'missions', name: 'Missões', icon: 'scan' },
    { id: 'suspects', name: 'Suspeitos', icon: 'users' },
    { id: 'evidence', name: 'Evidências', icon: 'folder' },
    { id: 'comms', name: 'Registros', icon: 'terminal' },
    { id: 'verdict', name: 'Veredito', icon: 'scale' }
];
const VERDICT_FIELDS = [
    { id: 'who', label: '01 — Quem movimentou o F-404?', options: ['Hugo Vale', 'Clara Melo', 'Lia Torres'], correct: 'Lia Torres', proof: ['A-27'] },
    { id: 'where', label: '02 — Para onde o arquivo foi transferido?', options: ['Lixeira do sistema', 'Servidor externo', 'Cofre B'], correct: 'Cofre B', proof: ['C-04', 'M-14'] },
    { id: 'how', label: '03 — Como a transferência foi realizada?', options: ['Falha automática no servidor', 'Acesso com T-27 e sessão de Hugo aberta', 'Invasão por um dispositivo desconhecido'], correct: 'Acesso com T-27 e sessão de Hugo aberta', proof: ['A-27'] },
    { id: 'why', label: '04 — Qual foi a motivação?', options: ['Vender as informações', 'Sabotar a exposição', 'Impedir exibição sem autorização'], correct: 'Impedir exibição sem autorização', proof: ['E-03', 'M-14'] }
];
const BEST_DECISION = 'Recuperar o arquivo e aguardar as autorizações antes de divulgar';
function freshState() {
    return { team: '', started: false, activeNav: 'overview', phase: 1, solved: [], hinted: [], elapsedMs: 0, running: false, startTick: null, pinned: [], connections: {}, answers: {}, proofs: {}, decision: '', report: null, highContrast: false, sound: false };
}
function readState() {
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw)
            return freshState();
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object')
            return freshState();
        const defaults = freshState();
        return { ...defaults, ...data, solved: Array.isArray(data.solved) ? data.solved : [], hinted: Array.isArray(data.hinted) ? data.hinted : [], pinned: Array.isArray(data.pinned) ? data.pinned : [], answers: data.answers || {}, proofs: data.proofs || {}, connections: data.connections || {} };
    }
    catch (e) {
        return freshState();
    }
}
function normalize(val) { return String(val || '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/\s+/g, ''); }
function niceTime(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
function formatClock(ms) { const s = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
function downloadReport(state, score) {
    const report = `ARQUIVO 404 — RELATÓRIO DE INVESTIGAÇÃO\n\nEquipe: ${state.team}\nPontuação: ${score}/650\nFases resolvidas: ${state.solved.length}/4\nDicas: ${state.hinted.length}\nTempo: ${formatClock(state.elapsedMs)}\n\nRESPOSTAS DO VEREDITO\n${VERDICT_FIELDS.map(q => q.label + '\n' + (state.answers[q.id] || '—') + '\nProva indicada: ' + (state.proofs[q.id] || '—')).join('\n\n')}\n\nDecisão final: ${state.decision || '—'}\n\nInstituto Vértice • Caso F-404`;
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arquivo404-relatorio.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 150);
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...readState(), inputCode: '', teamDraft: '', timeNow: Date.now(), modal: null, toast: '', mobileMenu: false, searchQuery: '', evidenceType: 'Todas', speaker: 0, detailSuspect: 'HV', showIntro: true, entryAnim: false };
        this.timer = null;
        this.toastTimer = null;
        this.audioCtx = null;
    }
    componentDidMount() { this.timer = setInterval(() => this.setState({ timeNow: Date.now() }), 1000); document.title = CASE + ' — Central de Investigação'; }
    componentWillUnmount() { clearInterval(this.timer); clearTimeout(this.toastTimer); }
    getPersistent() { const { team, started, activeNav, phase, solved, hinted, elapsedMs, running, startTick, pinned, connections, answers, proofs, decision, report, highContrast, sound } = this.state; return { team, started, activeNav, phase, solved, hinted, elapsedMs, running, startTick, pinned, connections, answers, proofs, decision, report, highContrast, sound }; }
    saveState() { try {
        window.localStorage.setItem(KEY, JSON.stringify(this.getPersistent()));
    }
    catch (e) { } }
    mutate(patch, callback) { this.setState(patch, () => { this.saveState(); if (callback)
        callback(); }); }
    getElapsed() { return this.state.elapsedMs + (this.state.running && this.state.startTick ? Math.max(0, this.state.timeNow - this.state.startTick) : 0); }
    getScore() { const { solved, hinted, report } = this.state; return Math.max(0, solved.length * 100 - hinted.length * 20 + (report ? report.verdictPoints + report.decisionPoints : 0)); }
    play(f = 600) { if (!this.state.sound)
        return; try {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context)
            return;
        const ctx = this.audioCtx || (this.audioCtx = new Context());
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(.00001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(.07, ctx.currentTime + .02);
        gain.gain.exponentialRampToValueAtTime(.00001, ctx.currentTime + .13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + .15);
    }
    catch (e) { } }
    toast(message) { clearTimeout(this.toastTimer); this.setState({ toast: message }); this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 3500); }
    start() { this.play(740); this.mutate({ team: this.state.teamDraft.trim() || 'Equipe 404', started: true, running: true, startTick: Date.now(), activeNav: 'overview', phase: 1 }, () => this.toast('Protocolo F-404 iniciado. Envelope 00 liberado.')); }
    go(nav) { this.play(530); this.mutate({ activeNav: nav, mobileMenu: false }, () => { window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
    toggleTimer() { const e = this.getElapsed(); if (this.state.running)
        this.mutate({ elapsedMs: e, running: false, startTick: null });
    else
        this.mutate({ running: true, startTick: Date.now() }); }
    reset() { this.mutate({ modal: 'reset' }); }
    performReset() { try {
        window.localStorage.removeItem(KEY);
    }
    catch (e) { } ; this.setState({ ...freshState(), teamDraft: '', inputCode: '', modal: null, timeNow: Date.now(), toast: '', speaker: 0, mobileMenu: false }, () => this.toast('Investigação reiniciada.')); }
    showHint(id) { this.play(420); this.setState({ modal: { type: 'hint', id } }); }
    claimHint(id) { if (this.state.hinted.includes(id)) {
        this.setState({ modal: null });
        return;
    } this.mutate({ hinted: [...this.state.hinted, id] }, () => { this.play(440); this.toast('Dica revelada. -20 pontos.'); }); }
    checkCode(id) {
        if (id !== this.state.phase || this.state.solved.includes(id))
            return;
        const normalized = normalize(this.state.inputCode);
        if (normalized !== CODE[id]) {
            this.play(220);
            this.toast('Código inválido. Confira as pistas físicas.');
            return;
        }
        const solved = [...this.state.solved, id];
        this.mutate({ solved, phase: id + 1, inputCode: '', activeNav: 'missions', entryAnim: true }, () => { this.play(920); this.toast('Acesso autorizado. Nova evidência adicionada.'); setTimeout(() => this.setState({ entryAnim: false }), 900); });
    }
    togglePin(id) { const list = this.state.pinned; this.mutate({ pinned: list.includes(id) ? list.filter(x => x !== id) : [...list, id] }); }
    setAnswer(id, value) { this.mutate({ answers: { ...this.state.answers, [id]: value } }); }
    setProof(id, value) { this.mutate({ proofs: { ...this.state.proofs, [id]: value } }); }
    finishVerdict() {
        if (this.state.report)
            return;
        const s = this.state;
        const missing = VERDICT_FIELDS.some(q => !s.answers[q.id] || !s.proofs[q.id]) || !s.decision;
        if (missing) {
            this.toast('Preencha as respostas e selecione uma evidência para cada conclusão.');
            return;
        }
        let verdictPoints = 0;
        let supported = 0;
        VERDICT_FIELDS.forEach(q => { if (s.answers[q.id] === q.correct && q.proof.includes(s.proofs[q.id])) {
            verdictPoints += 50;
            supported++;
        } });
        const decisionPoints = s.decision === BEST_DECISION ? 50 : 0;
        const elapsed = this.getElapsed();
        this.mutate({ elapsedMs: elapsed, running: false, startTick: null, report: { verdictPoints, decisionPoints, supported, endedAt: Date.now() }, activeNav: 'verdict' }, () => { this.play(900); this.toast('Relatório registrado com sucesso.'); });
    }
    unlockedEvidence() { return EVIDENCE.filter(e => e.phase === 0 || this.state.solved.includes(e.phase)); }
    renderNav() {
        const { started, activeNav, report, solved } = this.state;
        return React.createElement("nav", { className: "side-nav", "aria-label": "Navega\u00E7\u00E3o do jogo" },
            React.createElement("div", { className: "sidebar-brand" },
                React.createElement("div", { className: "brand-mark" },
                    React.createElement(Icon, { name: "fingerprint", size: 28 })),
                React.createElement("div", null,
                    React.createElement("strong", null,
                        "ARQUIVO ",
                        React.createElement("b", null, "404")),
                    React.createElement("span", null, "CENTRAL DE INVESTIGA\u00C7\u00C3O"))),
            React.createElement("div", { className: "nav-section-label" }, "OPERA\u00C7\u00C3O V\u00C9RTICE"),
            NAVS.map(n => React.createElement("button", { key: n.id, className: 'nav-item ' + (activeNav === n.id ? 'selected' : ''), onClick: () => this.go(n.id) },
                React.createElement(Icon, { name: n.icon, size: 19 }),
                React.createElement("span", null, n.name),
                n.id === 'missions' && solved.length > 0 && React.createElement("em", null,
                    solved.length,
                    "/4"),
                n.id === 'verdict' && !report && solved.length < 4 && React.createElement(Icon, { name: "lock", size: 13 }))),
            React.createElement("div", { className: "nav-bottom" },
                React.createElement("div", { className: "protocol-id" },
                    React.createElement(Icon, { name: "shield", size: 16 }),
                    React.createElement("div", null,
                        React.createElement("span", null, "PROTOCOLO ATIVO"),
                        React.createElement("strong", null, "VX / F\u2013404"))),
                React.createElement("div", { className: "sidebar-line" }),
                React.createElement("div", { className: "sidebar-help" }, "Utilize o kit f\u00EDsico junto ao sistema. As evid\u00EAncias s\u00E3o complementares."),
                React.createElement("button", { className: "nav-reset", onClick: () => this.reset() },
                    React.createElement(Icon, { name: "reset", size: 16 }),
                    " Reiniciar investiga\u00E7\u00E3o")));
    }
    renderTopbar() {
        const { started, report, running, highContrast, sound, team } = this.state;
        const remain = Math.max(0, MAX_TIME - this.getElapsed());
        return React.createElement("div", { className: "topbar" },
            React.createElement("button", { className: "mobile-menu-toggle icon-btn", onClick: () => this.setState({ mobileMenu: true }), "aria-label": "Abrir menu" },
                React.createElement(Icon, { name: "menu", size: 22 })),
            React.createElement("div", { className: "topbar-breadcrumb" },
                React.createElement("span", null, "INSTITUTO V\u00C9RTICE"),
                React.createElement(Icon, { name: "chevron", size: 12 }),
                React.createElement("strong", null, "CASO F-404")),
            React.createElement("div", { className: "topbar-right" },
                React.createElement("span", { className: 'live-status ' + (report ? 'neutral' : '') },
                    React.createElement("i", null),
                    report ? 'ENCERRADO' : started ? 'CASO EM ANDAMENTO' : 'AGUARDANDO INÍCIO'),
                started && React.createElement("div", { className: "timer-top" },
                    React.createElement(Icon, { name: "clock", size: 16 }),
                    React.createElement("span", { className: remain === 0 ? 'out' : '' }, niceTime(remain)),
                    React.createElement("button", { onClick: () => this.toggleTimer(), title: running ? 'Pausar cronômetro' : 'Retomar cronômetro' }, running ? 'Ⅱ' : '▶')),
                React.createElement("button", { title: sound ? 'Desligar sons' : 'Ligar sons', className: 'icon-btn top-icon ' + (sound ? 'active' : ''), onClick: () => this.mutate({ sound: !sound }) },
                    React.createElement(Icon, { name: sound ? 'volume' : 'mute', size: 18 })),
                React.createElement("button", { title: "Alternar alto contraste", className: 'icon-btn top-icon ' + (highContrast ? 'active' : ''), onClick: () => this.mutate({ highContrast: !highContrast }) },
                    React.createElement(Icon, { name: "adjust", size: 18 }))));
    }
    renderStart() {
        const { teamDraft } = this.state;
        return React.createElement("div", { className: "onboarding" },
            React.createElement("div", { className: "start-frame" },
                React.createElement("div", { className: "start-kicker" },
                    React.createElement("span", { className: "signal-dot" }),
                    " UMA EXPERI\u00CANCIA F\u00CDSICA + DIGITAL ",
                    React.createElement("span", null, "\u00A9 V\u00C9RTICE")),
                React.createElement("div", { className: "start-layout" },
                    React.createElement("div", { className: "start-copy" },
                        React.createElement("span", { className: "tag amber" },
                            React.createElement(Icon, { name: "shield", size: 13 }),
                            " ARQUIVO CONFIDENCIAL \u2022 001"),
                        React.createElement("h1", null,
                            "O arquivo",
                            React.createElement("br", null),
                            React.createElement("em", null, "desapareceu.")),
                        React.createElement("p", null, "Tr\u00EAs suspeitos. Quatro c\u00F3digos. Uma verdade escondida entre o papel e a tela."),
                        React.createElement("div", { className: "case-meta" },
                            React.createElement("span", null,
                                React.createElement(Icon, { name: "users", size: 18 }),
                                " 2 INVESTIGADORES"),
                            React.createElement("span", null,
                                React.createElement(Icon, { name: "clock", size: 18 }),
                                " 50 MINUTOS"),
                            React.createElement("span", null,
                                React.createElement(Icon, { name: "folder", size: 18 }),
                                " 5 ENVELOPES")),
                        React.createElement("div", { className: "start-field" },
                            React.createElement("label", { htmlFor: "team" }, "IDENTIFICA\u00C7\u00C3O DA EQUIPE"),
                            React.createElement("div", { className: "start-form" },
                                React.createElement("input", { id: "team", value: teamDraft, onChange: e => this.setState({ teamDraft: e.target.value }), onKeyDown: e => e.key === 'Enter' && this.start(), maxLength: 34, placeholder: "Nome da dupla (opcional)" }),
                                React.createElement(Action, { variant: "solid", icon: "arrow", onClick: () => this.start() }, "INICIAR OPERA\u00C7\u00C3O"))),
                        React.createElement("div", { className: "start-advice" },
                            React.createElement(Icon, { name: "lock", size: 15 }),
                            " Separe o Envelope 00 antes de iniciar. Sem ele, a investiga\u00E7\u00E3o fica incompleta.")),
                    React.createElement("div", { className: "start-art", "aria-hidden": "true" },
                        React.createElement("div", { className: "art-cross cross-one" }, "+"),
                        React.createElement("div", { className: "art-cross cross-two" }, "+"),
                        React.createElement("div", { className: "art-index" }, "REF. 044\u2014VX"),
                        React.createElement("div", { className: "file-stack stack-back" }),
                        React.createElement("div", { className: "file-stack stack-mid" }),
                        React.createElement("div", { className: "case-file" },
                            React.createElement("span", { className: "file-stripe" }),
                            React.createElement("div", { className: "file-topline" },
                                "INSTITUTO V\u00C9RTICE ",
                                React.createElement("span", null, "CLASSIFICADO")),
                            React.createElement("div", { className: "file-center" },
                                React.createElement("div", { className: "file-stamp" }, "RESTRITO"),
                                React.createElement("span", null, "DOSSI\u00CA DE INVESTIGA\u00C7\u00C3O"),
                                React.createElement("strong", null,
                                    "F",
                                    React.createElement("span", null, "-"),
                                    "404"),
                                React.createElement("div", { className: "file-dash" }),
                                React.createElement("small", null, "LOCALIZA\u00C7\u00C3O DESCONHECIDA")),
                            React.createElement("div", { className: "file-bottom" },
                                React.createElement("span", null, "18:18 / REGISTRO 04"),
                                React.createElement("span", null, "ACESSO N\u00BA 0004"))),
                        React.createElement("div", { className: "art-coordinate" }, "-08.4738 / -34.8829"))),
                React.createElement("div", { className: "start-footer" },
                    React.createElement("span", null, "UMA HIST\u00D3RIA FICT\u00CDCIA \u2022 TODOS OS PERSONAGENS E REGISTROS S\u00C3O INVENTADOS"),
                    React.createElement("span", null, "PRONTO PARA INVESTIGA\u00C7\u00C3O"))));
    }
    renderHero() { const { team, solved, report } = this.state; return React.createElement("section", { className: "overview-hero" },
        React.createElement("div", { className: "hero-orbit orbit-one" }),
        React.createElement("div", { className: "hero-orbit orbit-two" }),
        React.createElement("div", { className: "hero-coordinates" }, "SECURE ACCESS // CASE VX-044 / 2041"),
        React.createElement("div", { className: "hero-main-copy" },
            React.createElement("span", { className: "hero-top-label" },
                React.createElement("span", { className: "signal-dot" }),
                " INVESTIGA\u00C7\u00C3O ",
                report ? 'CONCLUÍDA' : 'EM ANDAMENTO'),
            React.createElement("h1", null,
                "O arquivo",
                React.createElement("br", null),
                React.createElement("span", null, "desapareceu.")),
            React.createElement("p", null, "O F-404 sumiu \u00E0s 18h18. A verdade est\u00E1 espalhada entre documentos, registros e o que ainda n\u00E3o foi dito."),
            React.createElement(Action, { icon: "arrow", variant: "light", onClick: () => this.go(report ? 'verdict' : 'missions') }, report ? 'VER RELATÓRIO FINAL' : solved.length ? 'CONTINUAR INVESTIGAÇÃO' : 'ABRIR PRIMEIRA MISSÃO')),
        React.createElement("div", { className: "hero-file-graphic" },
            React.createElement("div", { className: "graphic-ring ring-a" }),
            React.createElement("div", { className: "graphic-ring ring-b" }),
            React.createElement("div", { className: "graphic-nucleus" },
                React.createElement("span", null, "F / 404"),
                React.createElement("div", { className: "graphic-line" }),
                React.createElement("strong", null, "NOT FOUND"),
                React.createElement("small", null, "ARQUIVO PROTEGIDO")),
            React.createElement("span", { className: "g-side g-a" }, "REC_18:18"),
            React.createElement("span", { className: "g-side g-b" }, "V\u00C9RTICE.OS")),
        React.createElement("div", { className: "hero-bar" },
            React.createElement("span", null, "OPERA\u00C7\u00C3O DE RECUPERA\u00C7\u00C3O"),
            React.createElement("span", null,
                "INVESTIGADORES: ",
                team.toUpperCase()))); }
    renderOverview() {
        const { solved, report, pinned } = this.state;
        const pct = solved.length / 4 * 100;
        const current = PHASES[Math.min(solved.length, 3)];
        return React.createElement("div", { className: "page-stack" },
            this.renderHero(),
            React.createElement("div", { className: "stat-grid" },
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "folder", size: 17 }),
                        " EVID\u00CANCIAS DISPON\u00CDVEIS"),
                    React.createElement("strong", null,
                        this.unlockedEvidence().length,
                        React.createElement("small", null, " / 8")),
                    React.createElement("div", { className: "stat-tick" }, "REGISTROS F\u00CDSICOS + DIGITAIS")),
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "scan", size: 17 }),
                        " FASES DESBLOQUEADAS"),
                    React.createElement("strong", null,
                        solved.length,
                        React.createElement("small", null, " / 4")),
                    React.createElement("div", { className: "mini-meter" },
                        React.createElement("i", { style: { width: pct + '%' } }))),
                React.createElement("div", { className: "stat-card" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "bolt", size: 17 }),
                        " PONTUA\u00C7\u00C3O ATUAL"),
                    React.createElement("strong", null,
                        this.getScore(),
                        React.createElement("small", null, " / 650")),
                    React.createElement("div", { className: "stat-tick" }, "INCLUI EVENTUAIS DICAS"))),
            React.createElement("div", { className: "dashboard-columns" },
                React.createElement("section", { className: "paper-panel panel-current" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement(SmallLabel, null, "PR\u00D3XIMA ETAPA"),
                            React.createElement("h3", null, report ? 'Investigação encerrada' : solved.length === 4 ? 'Emitir veredito' : `0${current.id} / ${current.title}`)),
                        React.createElement("span", { className: "angular-tag" }, report ? 'ENCERRADO' : solved.length === 4 ? 'PRONTO' : 'EM ABERTO')),
                    React.createElement("p", null, report ? 'O relatório da equipe foi registrado. Confira as conclusões e a pontuação final.' : solved.length === 4 ? 'Todas as evidências foram reunidas. É hora de conectar as provas e registrar suas conclusões.' : current.description),
                    React.createElement("div", { className: "divider-line" }),
                    React.createElement("div", { className: "current-foot" },
                        React.createElement("span", null,
                            React.createElement(Icon, { name: "folder", size: 17 }),
                            " ",
                            report ? 'DOSSIÊ CONCLUÍDO' : solved.length === 4 ? 'ENVELOPE 04' : `ABRIR ENVELOPE ${current.envelope}`),
                        React.createElement("button", { className: "text-link", onClick: () => this.go(solved.length === 4 ? 'verdict' : 'missions') },
                            "ACESSAR ",
                            React.createElement(Icon, { name: "arrow", size: 16 })))),
                React.createElement("section", { className: "paper-panel panel-log" },
                    React.createElement("div", { className: "panel-head" },
                        React.createElement("div", null,
                            React.createElement(SmallLabel, null, "\u00DALTIMOS REGISTROS"),
                            React.createElement("h3", null, "Rastro do caso")),
                        React.createElement("button", { className: "text-link", onClick: () => this.go('comms') },
                            "VER TODOS ",
                            React.createElement(Icon, { name: "arrow", size: 15 }))),
                    React.createElement("div", { className: "mini-log" }, LOGS.slice(-3).map((log, i) => React.createElement("div", { className: "mini-log-row", key: log.time },
                        React.createElement("time", null, log.time),
                        React.createElement("div", null,
                            React.createElement("strong", null, log.title),
                            React.createElement("span", null, log.desc)),
                        React.createElement("i", null)))))),
            React.createElement("section", { className: "paper-panel investigators-strip" },
                React.createElement("div", { className: "panel-head" },
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null, "PESSOAS DE INTERESSE"),
                        React.createElement("h3", null, "Tr\u00EAs vers\u00F5es. Uma hist\u00F3ria.")),
                    React.createElement("button", { className: "text-link", onClick: () => this.go('suspects') },
                        "ANALISAR PERFIS ",
                        React.createElement(Icon, { name: "arrow", size: 16 }))),
                React.createElement("div", { className: "suspect-mini-grid" }, SUSPECTS.map((s, i) => React.createElement("button", { onClick: () => this.mutate({ detailSuspect: s.id, activeNav: 'suspects' }), className: "suspect-mini", key: s.id },
                    React.createElement("div", { className: 'avatar small-avatar ' + s.color },
                        React.createElement("span", null, s.id),
                        React.createElement("i", null)),
                    React.createElement("div", null,
                        React.createElement("strong", null, s.name),
                        React.createElement("span", null, s.role)),
                    React.createElement(Icon, { name: "chevron", size: 16 }))))));
    }
    renderPhaseVisual(id) {
        if (id === 1)
            return React.createElement("div", { className: "intel-timeline" }, LOGS.map((e, i) => React.createElement("div", { className: "intel-row", key: i },
                React.createElement("div", { className: "intel-time" }, e.time.slice(0, 5)),
                React.createElement("div", { className: "intel-marker" }),
                React.createElement("div", { className: "intel-event" },
                    React.createElement("span", null,
                        e.type,
                        " \u00B7 EVT_",
                        String(i + 1).padStart(2, '0')),
                    React.createElement("strong", null, e.title)))));
        if (id === 2)
            return React.createElement("div", { className: "camera-view" },
                React.createElement("div", { className: "camera-scanline" }),
                React.createElement("div", { className: "camera-corner top-left" }),
                React.createElement("div", { className: "camera-corner top-right" }),
                React.createElement("div", { className: "camera-corner bottom-left" }),
                React.createElement("div", { className: "camera-corner bottom-right" }),
                React.createElement("div", { className: "camera-noise" }),
                React.createElement("div", { className: "camera-circle" },
                    React.createElement(Icon, { name: "scan", size: 66 })),
                React.createElement("div", { className: "camera-overlay" },
                    "CAM_04 / CORREDOR LATERAL ",
                    React.createElement("span", null, "18:16:07")),
                React.createElement("div", { className: "camera-label" }, "IMAGEM RECUPERADA PARCIALMENTE"));
        if (id === 3)
            return React.createElement("div", { className: "cipher-box" },
                React.createElement("div", { className: "cipher-left" },
                    React.createElement(SmallLabel, null, "IDENTIFICA\u00C7\u00C3O PROTEGIDA"),
                    React.createElement("strong", null, "OLD"),
                    React.createElement("span", null, "Criptografia: deslocamento +3")),
                React.createElement("div", { className: "cipher-arrow" },
                    React.createElement(Icon, { name: "arrow", size: 26 })),
                React.createElement("div", { className: "cipher-right" },
                    React.createElement(SmallLabel, null, "DECODIFICA\u00C7\u00C3O"),
                    React.createElement("div", null, "?"),
                    React.createElement("small", null, "USE O DISCO DO ENVELOPE 03")));
        return React.createElement("div", { className: "fragment-visual" },
            React.createElement("div", { className: "fragment-paper f-a" },
                "ANOTA\u00C7\u00C3O RECUPERADA",
                React.createElement("span", null, "01 / 04")),
            React.createElement("div", { className: "fragment-paper f-b" },
                "REGISTRO DANIFICADO",
                React.createElement("span", null, "02 / 04")),
            React.createElement("div", { className: "fragment-paper f-c" },
                "ACESSO RESTRITO",
                React.createElement("span", null, "03 / 04")),
            React.createElement("div", { className: "fragment-paper f-d" },
                "ORDEM DESCONHECIDA",
                React.createElement("span", null, "04 / 04")));
    }
    renderMissions() {
        const { solved, phase, inputCode, entryAnim } = this.state;
        const current = PHASES.find(p => p.id === Math.min(phase, 4));
        return React.createElement("div", { className: "page-stack" },
            React.createElement(SectorHeading, { index: "01", label: "DOSSI\u00CA DE OPERA\u00C7\u00C3O", title: "Sequ\u00EAncia de miss\u00F5es", right: React.createElement("div", { className: "mission-counter" },
                    React.createElement(Icon, { name: "shield", size: 16 }),
                    " ",
                    solved.length,
                    " DE 4 ETAPAS CONCLU\u00CDDAS") }),
            React.createElement("div", { className: "stepper" }, PHASES.map(p => React.createElement("button", { key: p.id, disabled: p.id > phase, onClick: () => solved.includes(p.id) ? this.setState({ modal: { type: 'review', id: p.id } }) : this.toast('Esta é a etapa ativa.'), className: 'step ' + (solved.includes(p.id) ? 'complete' : phase === p.id ? 'current' : 'locked') },
                React.createElement("span", null, solved.includes(p.id) ? React.createElement(Icon, { name: "check", size: 18 }) : p.id > phase ? React.createElement(Icon, { name: "lock", size: 16 }) : String(p.id).padStart(2, '0')),
                React.createElement("div", null,
                    React.createElement("strong", null, p.title),
                    React.createElement("small", null, solved.includes(p.id) ? 'CONCLUÍDA' : phase === p.id ? 'EM ANÁLISE' : 'AGUARDANDO'))))),
            phase <= 4 && React.createElement("div", { className: 'mission-layout ' + (entryAnim ? 'mission-success' : '') },
                React.createElement("section", { className: "mission-primary" },
                    React.createElement("div", { className: "mission-brief" },
                        React.createElement("div", { className: "mission-brief-top" },
                            React.createElement("span", { className: "tag amber" },
                                "MISS\u00C3O 0",
                                phase),
                            React.createElement("span", { className: "tag ghost" },
                                React.createElement(Icon, { name: "lock", size: 12 }),
                                " ENVELOPE ",
                                current.envelope)),
                        React.createElement(SmallLabel, null, current.eyebrow),
                        React.createElement("h2", null, current.title),
                        React.createElement("p", null, current.description)),
                    React.createElement("div", { className: "visual-panel" },
                        React.createElement("div", { className: "visual-heading" },
                            React.createElement("span", null, "FONTE // SISTEMA V\u00C9RTICE"),
                            React.createElement("span", null, "CANAL SEGURO")),
                        this.renderPhaseVisual(phase)),
                    React.createElement("div", { className: "mission-answer" },
                        React.createElement("div", null,
                            React.createElement(SmallLabel, null, "CONFIRMA\u00C7\u00C3O DE EVID\u00CANCIA"),
                            React.createElement("h3", null, current.prompt),
                            React.createElement("p", null, "Combine o material impresso com os registros exibidos no sistema.")),
                        React.createElement("form", { className: "code-form", onSubmit: e => { e.preventDefault(); this.checkCode(phase); } },
                            React.createElement("div", { className: "input-underline" },
                                React.createElement(Icon, { name: "terminal", size: 19 }),
                                React.createElement("input", { autoComplete: "off", spellCheck: "false", "aria-label": current.prompt, placeholder: current.placeholder, value: inputCode, onChange: e => this.setState({ inputCode: e.target.value }) })),
                            React.createElement(Action, { variant: "solid", icon: "arrow", type: "submit" }, "VALIDAR C\u00D3DIGO")))),
                React.createElement("aside", { className: "mission-side" },
                    React.createElement("div", { className: "side-detail" },
                        React.createElement("div", { className: "side-detail-head" },
                            React.createElement(Icon, { name: "folder", size: 18 }),
                            React.createElement("span", null, "KIT F\u00CDSICO")),
                        React.createElement("span", { className: "large-index" }, current.envelope),
                        React.createElement("h3", null,
                            "Abra o envelope ",
                            current.envelope),
                        React.createElement("p", null, "As pe\u00E7as f\u00EDsicas s\u00E3o indispens\u00E1veis nesta etapa.")),
                    React.createElement("div", { className: "side-detail muted" },
                        React.createElement("div", { className: "side-detail-head" },
                            React.createElement(Icon, { name: "help", size: 18 }),
                            React.createElement("span", null, "PRECISA DE AJUDA?")),
                        React.createElement("h3", null, "Uma pista pode mudar tudo."),
                        React.createElement("p", null, "Uma dica custa 20 pontos. Use apenas quando necess\u00E1rio."),
                        React.createElement(Action, { variant: "outlined", icon: "help", onClick: () => this.showHint(phase) }, this.state.hinted.includes(phase) ? 'REVER DICA' : 'SOLICITAR DICA')),
                    React.createElement("div", { className: "secure-note" },
                        React.createElement(Icon, { name: "shield", size: 17 }),
                        " Apenas um c\u00F3digo correto libera a etapa seguinte."))),
            phase >= 5 && React.createElement("div", { className: "case-unlocked" },
                React.createElement("div", { className: "check-emblem" },
                    React.createElement(Icon, { name: "check", size: 40 })),
                React.createElement(SmallLabel, null, "ARQUIVO RECONSTITU\u00CDDO"),
                React.createElement("h2", null, "As quatro camadas foram rompidas."),
                React.createElement("p", null, "O sistema reuniu registros suficientes. O pr\u00F3ximo passo \u00E9 interpretar as provas e assinar o veredito."),
                React.createElement(Action, { variant: "solid", icon: "arrow", onClick: () => this.go('verdict') }, "IR AO VEREDITO")),
            React.createElement("section", { className: "mission-archive" },
                React.createElement(SmallLabel, null, "ARQUIVO DE ETAPAS"),
                React.createElement("div", { className: "archive-list" },
                    PHASES.filter(p => solved.includes(p.id)).map(p => React.createElement("div", { className: "archive-item", key: p.id },
                        React.createElement("div", { className: "archive-number" },
                            "0",
                            p.id),
                        React.createElement("div", null,
                            React.createElement("strong", null, p.label),
                            React.createElement("span", null,
                                p.title,
                                " \u00B7 PROTOCOLO ",
                                p.proof)),
                        React.createElement(Icon, { name: "check", size: 20 }))),
                    solved.length === 0 && React.createElement("div", { className: "empty-archive" }, "Nenhuma evid\u00EAncia digital liberada at\u00E9 o momento."))));
    }
    renderSuspects() { const { detailSuspect } = this.state; const cur = SUSPECTS.find(s => s.id === detailSuspect) || SUSPECTS[0]; return React.createElement("div", { className: "page-stack" },
        React.createElement(SectorHeading, { index: "02", label: "PESSOAS DE INTERESSE", title: "Dossi\u00EAs dos suspeitos", right: React.createElement("span", { className: "count-label" }, "03 ARQUIVOS IDENTIFICADOS") }),
        React.createElement("div", { className: "suspects-layout" },
            React.createElement("div", { className: "suspect-tile-list" }, SUSPECTS.map((s, i) => React.createElement("button", { className: 'suspect-tile ' + (s.id === detailSuspect ? 'active' : ''), onClick: () => this.setState({ detailSuspect: s.id }), key: s.id },
                React.createElement("div", { className: 'avatar ' + s.color },
                    React.createElement("span", null, s.id),
                    React.createElement("i", null)),
                React.createElement("div", { className: "suspect-tile-name" },
                    React.createElement("small", null,
                        "PERFIL 0",
                        i + 1),
                    React.createElement("strong", null, s.name),
                    React.createElement("span", null, s.role)),
                React.createElement(Icon, { name: "chevron", size: 18 })))),
            React.createElement("section", { className: "suspect-file" },
                React.createElement("div", { className: "suspect-file-top" },
                    React.createElement(SmallLabel, null, "V\u00C9RTICE / PERFIL PESSOAL"),
                    React.createElement("span", { className: "tag outline-dark" }, "N\u00C3O CONFIRMADO")),
                React.createElement("div", { className: "suspect-file-main" },
                    React.createElement("div", { className: 'suspect-photo ' + cur.color },
                        React.createElement("div", { className: "photo-grid" }),
                        React.createElement("div", { className: "photo-silhouette" },
                            React.createElement("div", { className: "head-shape" }),
                            React.createElement("div", { className: "torso-shape" })),
                        React.createElement("span", null,
                            "FOTO RESTRITA / ID ",
                            cur.id)),
                    React.createElement("div", { className: "suspect-bio" },
                        React.createElement(SmallLabel, null, "FICHA INDIVIDUAL"),
                        React.createElement("h2", null, cur.name),
                        React.createElement("span", { className: "role-line" }, cur.role),
                        React.createElement("div", { className: "bio-rule" }),
                        React.createElement("p", null, cur.desc),
                        React.createElement("div", { className: "info-pair" },
                            React.createElement("span", null, "\u00DALTIMA \u00C1REA CONHECIDA"),
                            React.createElement("strong", null, cur.location)),
                        React.createElement("div", { className: "info-pair" },
                            React.createElement("span", null, "REGISTRO EM DESTAQUE"),
                            React.createElement("strong", null, cur.tag)))),
                React.createElement("div", { className: "suspect-file-bottom" },
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null, "NOTA DE INVESTIGA\u00C7\u00C3O"),
                        React.createElement("p", null, cur.detail)),
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null, "QUEST\u00C3O EM ABERTO"),
                        React.createElement("p", null, cur.question))))),
        React.createElement("div", { className: "footnote-panel" },
            React.createElement(Icon, { name: "shield", size: 18 }),
            React.createElement("p", null, "Um registro isolado n\u00E3o \u00E9 uma conclus\u00E3o. Compare o hor\u00E1rio, a credencial e as declara\u00E7\u00F5es antes de emitir qualquer acusa\u00E7\u00E3o."))); }
    renderEvidence() { const { pinned, searchQuery, evidenceType, solved } = this.state; const list = this.unlockedEvidence(); const types = ['Todas', 'Físicas', 'Digitais', 'Fixadas']; const filtered = list.filter(e => { const q = searchQuery.toLowerCase(); const matches = (e.title + ' ' + e.detail + ' ' + e.id).toLowerCase().includes(q); return matches && (evidenceType === 'Todas' || (evidenceType === 'Físicas' && e.phase === 0) || (evidenceType === 'Digitais' && e.phase > 0) || (evidenceType === 'Fixadas' && pinned.includes(e.id))); }); return React.createElement("div", { className: "page-stack" },
        React.createElement(SectorHeading, { index: "03", label: "ARQUIVO DE PROVAS", title: "Invent\u00E1rio de evid\u00EAncias", right: React.createElement("span", { className: "count-label" },
                list.length,
                " DE 8 DISPON\u00CDVEIS") }),
        React.createElement("div", { className: "evidence-tools" },
            React.createElement("div", { className: "evidence-search" },
                React.createElement(Icon, { name: "search", size: 19 }),
                React.createElement("input", { "aria-label": "Pesquisar evid\u00EAncias", value: searchQuery, onChange: e => this.setState({ searchQuery: e.target.value }), placeholder: "Pesquisar por nome, c\u00F3digo ou descri\u00E7\u00E3o..." })),
            React.createElement("div", { className: "filter-chips" }, types.map(t => React.createElement("button", { key: t, className: t === evidenceType ? 'selected' : '', onClick: () => this.setState({ evidenceType: t }) }, t)))),
        React.createElement("div", { className: "evidence-card-grid" },
            filtered.map(e => React.createElement("article", { className: "evidence-tile", key: e.id },
                React.createElement("div", { className: "evidence-tile-header" },
                    React.createElement("span", { className: "doc-mark" },
                        React.createElement(Icon, { name: e.phase === 0 ? 'file' : 'scan', size: 22 })),
                    React.createElement("button", { className: 'pin-btn ' + (pinned.includes(e.id) ? 'active' : ''), onClick: () => this.togglePin(e.id), "aria-label": pinned.includes(e.id) ? 'Desafixar prova' : 'Fixar prova', title: pinned.includes(e.id) ? 'Desafixar' : 'Fixar no painel' },
                        React.createElement(Icon, { name: "pin", size: 18 }))),
                React.createElement(SmallLabel, null, e.type.toUpperCase()),
                React.createElement("h3", null, e.title),
                React.createElement("p", null, e.detail),
                React.createElement("div", { className: "evidence-tile-foot" },
                    React.createElement("span", null,
                        e.id,
                        " / ",
                        e.phase === 0 ? 'ENVELOPE 01' : `FASE 0${e.phase}`),
                    React.createElement("span", { className: "tag outline-dark" }, e.phase === 0 ? 'DOCUMENTO' : 'DESBLOQUEADA')))),
            !filtered.length && React.createElement("div", { className: "no-results" },
                React.createElement(Icon, { name: "search", size: 32 }),
                React.createElement("h3", null, "N\u00E3o encontramos provas com esse filtro."),
                React.createElement("p", null, "Tente outra busca ou conclua novas fases para liberar outros registros."))),
        React.createElement("div", { className: "evidence-footer" },
            React.createElement("div", null,
                React.createElement(SmallLabel, null, "CONTROLE DE ACESSO"),
                React.createElement("h3", null,
                    4 - solved.length,
                    " arquivos digitais ainda bloqueados"),
                React.createElement("p", null, "Novas provas s\u00E3o adicionadas quando as miss\u00F5es s\u00E3o conclu\u00EDdas.")),
            React.createElement(Action, { variant: "outlined", icon: "arrow", onClick: () => this.go('missions') }, "IR \u00C0S MISS\u00D5ES"))); }
    renderComms() { const { solved, speaker } = this.state; return React.createElement("div", { className: "page-stack" },
        React.createElement(SectorHeading, { index: "04", label: "REGISTROS DO SISTEMA", title: "Comunica\u00E7\u00F5es e rastros", right: React.createElement("span", { className: "count-label" }, "DOSSI\u00CA / TERMINAL 04") }),
        React.createElement("div", { className: "comms-layout" },
            React.createElement("section", { className: "comms-main paper-panel" },
                React.createElement("div", { className: "section-toolbar" },
                    React.createElement(SmallLabel, null, "LOG CRONOL\u00D3GICO"),
                    React.createElement("span", { className: "tag outline-dark" }, "5 EVENTOS")),
                React.createElement("div", { className: "comms-timeline" }, LOGS.map((l, i) => React.createElement("div", { key: l.time, className: 'log-card ' + (i === 4 ? 'alert' : '') },
                    React.createElement("time", null, l.time),
                    React.createElement("div", { className: "log-rail" },
                        React.createElement("i", null)),
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null, l.type),
                        React.createElement("h3", null, l.title),
                        React.createElement("p", null, l.desc)))))),
            React.createElement("aside", { className: "comms-aside" },
                React.createElement("div", { className: "terminal-window" },
                    React.createElement("div", { className: "terminal-bar" },
                        React.createElement("div", null,
                            React.createElement("i", null),
                            React.createElement("i", null),
                            React.createElement("i", null)),
                        React.createElement("span", null, "VERTICE.OS / TERMINAL 04")),
                    React.createElement("div", { className: "terminal-body" },
                        React.createElement("span", { className: "terminal-comment" }, "# SISTEMA DE ARQUIVOS"),
                        React.createElement("p", null,
                            React.createElement("b", null, "$"),
                            " scan /arquivo/F-404"),
                        React.createElement("p", null,
                            React.createElement("i", null, "verificando...")),
                        React.createElement("p", { className: "term-alert" }, "ERRO 404: FILE NOT FOUND"),
                        React.createElement("p", null,
                            React.createElement("b", null, "$"),
                            " tail -n 3 auth.log"),
                        React.createElement("p", null, "18:16 / T-27 / acesso concedido"),
                        React.createElement("p", null, "18:18 / hugo.v / sess\u00E3o ativa"),
                        React.createElement("p", null,
                            React.createElement("b", null, "$"),
                            " ",
                            React.createElement("span", { className: "cursor" }, "_")))),
                React.createElement("div", { className: "paper-panel voice-panel" },
                    React.createElement("div", { className: "section-toolbar" },
                        React.createElement(SmallLabel, null, "DEPOIMENTOS"),
                        React.createElement("span", { className: "tag outline-dark" }, solved.includes(3) ? 'ARQUIVOS LIBERADOS' : 'BLOQUEADO')),
                    solved.includes(3) ? React.createElement("div", null,
                        React.createElement("div", { className: "voice-tabs" }, VOICES.map((v, i) => React.createElement("button", { key: i, className: i === speaker ? 'active' : '', onClick: () => this.setState({ speaker: i }) }, v.name.split(' ')[0]))),
                        React.createElement("div", { className: "voice-player" },
                            React.createElement("div", { className: "voice-icon" },
                                React.createElement(Icon, { name: "message", size: 24 })),
                            React.createElement("div", null,
                                React.createElement(SmallLabel, null,
                                    "TRANSCRI\u00C7\u00C3O / ",
                                    VOICES[speaker].time),
                                React.createElement("h3", null, VOICES[speaker].name),
                                React.createElement("p", null,
                                    "\u201C",
                                    VOICES[speaker].quote.replace(/^“|”$/g, ''),
                                    "\u201D"),
                                React.createElement("div", { className: "voice-flag" },
                                    React.createElement(Icon, { name: "check", size: 14 }),
                                    VOICES[speaker].flag)))) : React.createElement("div", { className: "voice-locked" },
                        React.createElement(Icon, { name: "lock", size: 27 }),
                        React.createElement("h3", null, "Interrogat\u00F3rios protegidos"),
                        React.createElement("p", null, "Conclua a Fase 03 para liberar os depoimentos.")))))); }
    renderVerdict() {
        const { solved, answers, proofs, decision, report } = this.state;
        const avail = this.unlockedEvidence();
        if (solved.length < 4)
            return React.createElement("div", { className: "verdict-locked" },
                React.createElement("div", { className: "verdict-lock-circle" },
                    React.createElement(Icon, { name: "lock", size: 44 })),
                React.createElement(SmallLabel, null, "ACESSO N\u00C3O AUTORIZADO"),
                React.createElement("h1", null, "O veredito ainda est\u00E1 bloqueado."),
                React.createElement("p", null, "Para emitir uma conclus\u00E3o consistente, sua equipe precisa concluir todas as quatro miss\u00F5es e recuperar o registro final."),
                React.createElement("div", { className: "verdict-progress" },
                    React.createElement("div", { className: "mini-meter" },
                        React.createElement("i", { style: { width: (solved.length / 4 * 100) + '%' } })),
                    React.createElement("span", null,
                        solved.length,
                        " / 4 MISS\u00D5ES CONCLU\u00CDDAS")),
                React.createElement(Action, { variant: "solid", icon: "arrow", onClick: () => this.go('missions') }, "CONTINUAR INVESTIGA\u00C7\u00C3O"));
        if (report) {
            const score = this.getScore();
            const grade = score >= 620 ? 'EXCELÊNCIA' : score >= 500 ? 'CASO RESOLVIDO' : score >= 350 ? 'PARCIAL' : 'INCONCLUSIVO';
            return React.createElement("div", { className: "page-stack" },
                React.createElement(SectorHeading, { index: "05", label: "RELAT\u00D3RIO DE ENCERRAMENTO", title: "Veredito registrado", right: React.createElement("span", { className: "tag amber" }, grade) }),
                React.createElement("div", { className: "report-hero" },
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null, "CLASSIFICA\u00C7\u00C3O FINAL"),
                        React.createElement("h1", null, grade),
                        React.createElement("p", null,
                            "Investiga\u00E7\u00E3o encerrada para ",
                            React.createElement("strong", null, this.state.team),
                            "."),
                        React.createElement(Action, { variant: "light", icon: "download", onClick: () => downloadReport({ ...this.state, elapsedMs: this.getElapsed() }, score) }, "BAIXAR RELAT\u00D3RIO")),
                    React.createElement("div", { className: "report-score" },
                        React.createElement("span", null, "PONTUA\u00C7\u00C3O"),
                        React.createElement("strong", null, score),
                        React.createElement("small", null, "DE 650 PONTOS"))),
                React.createElement("div", { className: "report-metrics" },
                    React.createElement("div", null,
                        React.createElement("span", null, "VEREDITOS FUNDAMENTADOS"),
                        React.createElement("strong", null,
                            report.supported,
                            " / 4")),
                    React.createElement("div", null,
                        React.createElement("span", null, "ETAPAS CONCLU\u00CDDAS"),
                        React.createElement("strong", null, "4 / 4")),
                    React.createElement("div", null,
                        React.createElement("span", null, "DICAS UTILIZADAS"),
                        React.createElement("strong", null, this.state.hinted.length)),
                    React.createElement("div", null,
                        React.createElement("span", null, "TEMPO TOTAL"),
                        React.createElement("strong", null, formatClock(this.getElapsed())))),
                React.createElement("div", { className: "paper-panel final-story" },
                    React.createElement(SmallLabel, null, "O QUE DE FATO ACONTECEU"),
                    React.createElement("h2", null, "Nem todo desaparecimento \u00E9 um roubo."),
                    React.createElement("p", null, "Lia Torres transferiu o Arquivo F-404 para o Cofre B depois de acessar a sala t\u00E9cnica com a credencial T-27. A sess\u00E3o de Hugo havia permanecido aberta. Sua inten\u00E7\u00E3o era impedir que depoimentos fossem exibidos sem autoriza\u00E7\u00E3o \u2014 embora o m\u00E9todo usado n\u00E3o tenha sido adequado."),
                    React.createElement("p", null, "A decis\u00E3o respons\u00E1vel \u00E9 recuperar o conte\u00FAdo e concluir as autoriza\u00E7\u00F5es antes de torn\u00E1-lo p\u00FAblico."),
                    React.createElement("div", { className: "story-sign" },
                        React.createElement(Icon, { name: "shield", size: 18 }),
                        " INSTITUTO V\u00C9RTICE \u00B7 CASO ENCERRADO")),
                React.createElement(Action, { variant: "outlined", icon: "reset", onClick: () => this.reset() }, "INICIAR NOVA PARTIDA"));
        }
        return React.createElement("div", { className: "page-stack" },
            React.createElement(SectorHeading, { index: "05", label: "JULGAMENTO FINAL", title: "Assine o seu veredito", right: React.createElement("span", { className: "tag amber" }, "5 DECIS\u00D5ES") }),
            React.createElement("div", { className: "verdict-intro" },
                React.createElement(Icon, { name: "scale", size: 31 }),
                React.createElement("div", null,
                    React.createElement("h3", null, "Acusar n\u00E3o \u00E9 suficiente. \u00C9 preciso provar."),
                    React.createElement("p", null, "Registre as quatro conclus\u00F5es e associe cada uma a uma evid\u00EAncia. Cada resposta fundamentada vale at\u00E9 50 pontos."))),
            React.createElement("div", { className: "verdict-form" },
                VERDICT_FIELDS.map(q => React.createElement("section", { className: "verdict-question", key: q.id },
                    React.createElement("div", null,
                        React.createElement(SmallLabel, null,
                            "REGISTRO ",
                            q.label.slice(0, 2)),
                        React.createElement("h3", null, q.label.slice(5))),
                    React.createElement("div", { className: "verdict-question-inputs" },
                        React.createElement("label", null,
                            "CONCLUS\u00C3O",
                            React.createElement("select", { value: answers[q.id] || '', onChange: e => this.setAnswer(q.id, e.target.value) },
                                React.createElement("option", { value: "" }, "Selecione sua hip\u00F3tese..."),
                                q.options.map(x => React.createElement("option", { key: x, value: x }, x)))),
                        React.createElement("label", null,
                            "EVID\u00CANCIA QUE SUSTENTA",
                            React.createElement("select", { value: proofs[q.id] || '', onChange: e => this.setProof(q.id, e.target.value) },
                                React.createElement("option", { value: "" }, "Escolha uma evid\u00EAncia..."),
                                avail.map(e => React.createElement("option", { key: e.id, value: e.id },
                                    e.id,
                                    " \u00B7 ",
                                    e.title))))))),
                React.createElement("section", { className: "verdict-question decision" },
                    React.createElement(SmallLabel, null, "DECIS\u00C3O \u00C9TICA / +50 PONTOS"),
                    React.createElement("h3", null, "O que a equipe recomenda fazer com o arquivo?"),
                    React.createElement("div", { className: "decision-options" }, ['Recuperar e divulgar tudo imediatamente', 'Recuperar o arquivo e aguardar as autorizações antes de divulgar', 'Apagar definitivamente o arquivo'].map(x => React.createElement("label", { key: x, className: 'radio-card ' + (decision === x ? 'selected' : '') },
                        React.createElement("input", { type: "radio", name: "decision", checked: decision === x, onChange: () => this.mutate({ decision: x }) }),
                        React.createElement("span", null, x),
                        decision === x && React.createElement(Icon, { name: "check", size: 18 }))))),
                React.createElement("button", { className: "submit-verdict", onClick: () => this.mutate({ modal: 'submit' }) },
                    React.createElement(Icon, { name: "shield", size: 22 }),
                    " REGISTRAR VEREDITO E ENCERRAR CASO ",
                    React.createElement(Icon, { name: "arrow", size: 21 }))));
    }
    renderModal() {
        const modal = this.state.modal;
        if (!modal)
            return null;
        const hint = typeof modal === 'object' && modal.type === 'hint';
        const review = typeof modal === 'object' && modal.type === 'review';
        const reset = modal === 'reset';
        const revealed = hint && this.state.hinted.includes(modal.id);
        const phase = (hint || review) ? PHASES[modal.id - 1] : null;
        const title = hint ? `Dica da Missão 0${modal.id}` : review ? `Missão 0${modal.id} — ${phase.title}` : reset ? 'Reiniciar investigação?' : 'Encerrar o caso agora?';
        const body = hint ? (revealed ? phase.hint : 'Uma pequena orientação para o enigma atual será revelada após confirmar a utilização da dica.') :
            review ? `Etapa concluída. Código validado: ${CODE[modal.id]}. Registro arquivado: ${phase.label}.` :
                reset ? 'O progresso, o tempo, a pontuação e o relatório desta dupla serão apagados deste navegador.' :
                    'O sistema vai registrar o veredito da equipe, conferir as evidências selecionadas e calcular a pontuação. Esta decisão encerra a partida.';
        return React.createElement("div", { role: "presentation", className: "modal-backdrop", onMouseDown: e => { if (e.target === e.currentTarget)
                this.setState({ modal: null }); } },
            React.createElement("div", { className: "dialog", role: "dialog", "aria-modal": "true", "aria-label": title },
                React.createElement("button", { className: "dialog-close", "aria-label": "Fechar", onClick: () => this.setState({ modal: null }) },
                    React.createElement(Icon, { name: "x", size: 19 })),
                React.createElement("div", { className: "dialog-icon" },
                    React.createElement(Icon, { name: hint ? 'help' : review ? 'file' : reset ? 'reset' : 'shield', size: 25 })),
                React.createElement(SmallLabel, null, hint ? 'SISTEMA DE APOIO' : review ? 'ARQUIVO DE MISSÕES' : reset ? 'REINICIAR PROTOCOLO' : 'CONFIRMAÇÃO FINAL'),
                React.createElement("h2", null, title),
                React.createElement("p", null, body),
                hint && React.createElement("div", { className: "dialog-footnote" },
                    React.createElement(Icon, { name: "bolt", size: 16 }),
                    revealed ? 'Dica já registrada. Não haverá novo desconto.' : 'A dica reduzirá a pontuação em 20 pontos.'),
                React.createElement("div", { className: "dialog-actions" },
                    React.createElement(Action, { variant: "outlined", onClick: () => this.setState({ modal: null }) }, revealed || review ? 'FECHAR' : 'CANCELAR'),
                    !revealed && !review && React.createElement(Action, { variant: "solid", icon: reset ? 'reset' : 'check', onClick: () => hint ? this.claimHint(modal.id) : reset ? this.performReset() : this.setState({ modal: null }, () => this.finishVerdict()) }, hint ? 'REVELAR DICA' : reset ? 'REINICIAR' : 'ENCERRAR CASO'))));
    }
    render() {
        const { started, activeNav, toast, mobileMenu, highContrast } = this.state;
        return React.createElement("div", { className: 'app ' + (highContrast ? 'high-contrast' : '') },
            !started ? this.renderStart() : React.createElement("div", { className: "app-layout" },
                React.createElement("aside", { className: "desktop-sidebar" }, this.renderNav()),
                mobileMenu && React.createElement("div", { className: "mobile-overlay", onMouseDown: () => this.setState({ mobileMenu: false }) },
                    React.createElement("div", { className: "mobile-menu", onMouseDown: e => e.stopPropagation() },
                        React.createElement("button", { "aria-label": "Fechar menu", className: "mobile-close", onClick: () => this.setState({ mobileMenu: false }) },
                            React.createElement(Icon, { name: "x", size: 20 })),
                        this.renderNav())),
                React.createElement("div", { className: "main-area" },
                    this.renderTopbar(),
                    React.createElement("main", { id: "main-content", className: "main-content" },
                        activeNav === 'overview' && this.renderOverview(),
                        activeNav === 'missions' && this.renderMissions(),
                        activeNav === 'suspects' && this.renderSuspects(),
                        activeNav === 'evidence' && this.renderEvidence(),
                        activeNav === 'comms' && this.renderComms(),
                        activeNav === 'verdict' && this.renderVerdict()),
                    React.createElement("footer", { className: "page-footer" },
                        React.createElement("span", null, "ARQUIVO 404 \u2014 UMA EXPERI\u00CANCIA DE INVESTIGA\u00C7\u00C3O FICT\u00CDCIA"),
                        React.createElement("span", null, "V\u00C9RTICE SECURITY DIVISION \u00B7 VX/404"))),
                React.createElement("nav", { className: "mobile-bottom-nav", "aria-label": "Navega\u00E7\u00E3o r\u00E1pida" }, NAVS.slice(0, 6).map(n => React.createElement("button", { key: n.id, className: activeNav === n.id ? 'active' : '', onClick: () => this.go(n.id) },
                    React.createElement(Icon, { name: n.icon, size: 19 }),
                    React.createElement("span", null, n.name))))),
            this.renderModal(),
            toast && React.createElement("div", { className: "toast", role: "status" },
                React.createElement(Icon, { name: "activity", size: 18 }),
                React.createElement("span", null, toast),
                React.createElement("button", { "aria-label": "Fechar notifica\u00E7\u00E3o", onClick: () => this.setState({ toast: '' }) },
                    React.createElement(Icon, { name: "x", size: 17 }))));
    }
}

window.Arquivo404App=App;
