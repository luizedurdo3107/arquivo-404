# Arquivo 404 — deploy das salas

## 1. Publicar o servidor em Render

- New > Web Service > conectar o repositório GitHub `luizedurdo3107/arquivo-404`.
- Root Directory: raiz do projeto.
- Runtime: Node.
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment Variable `ALLOWED_ORIGINS`: `https://arquivo-404-delta.vercel.app`
- Aguarde até abrir `https://SEU-SERVICO.onrender.com/api/health` e ver `{ "ok": true, ... }`.

## 2. Vercel: React

- Settings > Environment Variables > Production
- `VITE_API_URL`: `https://SEU-SERVICO.onrender.com` (SEM barra final, SEM /api)
- Framework: Vite; Build: `npm run build`; Output: `dist`
- Redeploy para que a nova variável seja incluída no build.

## 3. Atenção ao banco

Este servidor usa SQLite em arquivo local. Render Free pode reiniciar ou suspender e perder os dados do SQLite.
Para preservar sessões, use Render pago com Persistent Disk montado em `/var/data` e variável `ARQUIVO404_DATA_DIR=/var/data`, ou migre para um banco gerenciado (Postgres).

## 4. Desenvolvimento local

`npm run dev` continua usando o proxy do Vite e a API local. Não configure VITE_API_URL no ambiente de desenvolvimento salvo se desejar conectar à API online.
