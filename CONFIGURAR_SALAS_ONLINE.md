# Arquivo 404 — colocar as salas ONLINE (Vercel + Render)

## Se ainda NÃO tem API publicada
1. Faça git commit e push desta atualização.
2. Abra https://dashboard.render.com/ e selecione New > Blueprint.
3. Conecte o MESMO repositório GitHub. O arquivo render.yaml prepara o Web Service Node.
4. Aguarde o status Live, copie a URL que o Render criou, terminada em .onrender.com.
5. Execute novamente no VS Code:
   python3 ~/Downloads/corrigir_arquivo404_online_definitivo.py . --api-url https://SEU-SERVICO.onrender.com
6. Faça git commit/push mais uma vez. A Vercel fará novo deploy.

## Se JÁ tem API no Render
Execute o passo 5, usando a URL real, e envie as alterações ao GitHub.

## Verificações
- Site Vercel: https://arquivo-404-delta.vercel.app
- API health: <URL_REAL_DO_RENDER>/api/health (HTTP 200, JSON ok:true, service:arquivo404)
- Config pública após deploy: https://arquivo-404-delta.vercel.app/arquivo404-config.js (deve mostrar o domínio do Render)
- Ao criar sala, DevTools > Network deve mostrar POST https://SEU-SERVICO.onrender.com/api/rooms, não POST /api/rooms no domínio da Vercel.
- Os dois jogadores devem estar na MESMA sala (código de 6 caracteres).

## Limitação de armazenamento
No Render Free, os dados em SQLite podem desaparecer se o serviço reiniciar/deployar.
Para um evento com partidas importantes, use armazenamento persistente (plano pago com disco ou banco externo) e testes em dois celulares.

Não é necessário VITE_API_URL na Vercel: o arquivo público arquivo404-config.js define a API no momento do carregamento.
O script não publica serviços sozinho; isso exige acesso autorizado às suas contas GitHub/Render/Vercel.
