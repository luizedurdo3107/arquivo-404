# Arquivo 404 — Configuração obrigatória da produção

1. Render: crie um Web Service para este mesmo repositório, Build `npm ci && npm run build`, Start `npm start`, Health Check `/api/health`. Configure `ALLOWED_ORIGINS=https://arquivo-404-delta.vercel.app`.
2. Copie a URL REAL da API, exemplo `https://arquivo404-api.onrender.com` (não é um endereço garantido!). Abra `<URL_REAL>/api/health` e confira HTTP 200 com `{"ok":true}`. Se retornar HTML 404, a API não está correta/publicada.
3. Vercel > Project > Settings > Environment Variables > Production: `VITE_API_URL` = URL REAL do Render, SEM `/api` e sem barra final. A variável é pública; não insira segredos.
4. Vercel > Deployments > Redeploy (Production). Variáveis Vite são incorporadas na construção, não em runtime.
5. Teste criar uma sala na Vercel; use dois navegadores/dispositivos. Se persistir, abra DevTools > Network > `/api/rooms` e confira o Request URL. Deve começar pelo URL REAL do Render, nunca pelo domínio da Vercel.
6. Render gratuito pode suspender e usa disco efêmero; para garantir continuidade das salas, configure persistência externa. A sincronização em tempo real requer servidor ativo com Socket.IO.

Não tente colocar `ALLOWED_ORIGINS` na Vercel; essa variável pertence ao servidor no Render. Não use `localhost`, IP privado ou URL da própria Vercel como `VITE_API_URL`.
