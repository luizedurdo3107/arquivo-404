# ARQUIVO 404 — Atualização cooperativa sem substituir o ZIP

Esta atualização modifica diretamente os arquivos **da pasta de projeto extraída**. O ZIP original permanece intacto.

## Iniciar

```bash
cd ~/Downloads/Arquivo404_React_Definitivo
npm install
npm run dev
```

Abra o endereço informado pelo Vite, normalmente http://localhost:5173. O comando acima inicia o back-end e o Vite juntos.

## Testar com dois investigadores

1. No primeiro navegador, informe o nome da dupla e seu apelido. Clique em **CRIAR SALA PARA DUPLA**.
2. Copie o código de seis caracteres da sala.
3. No segundo navegador ou celular, use o mesmo endereço da aplicação (no celular, o **IP do computador na rede local**, não localhost).
4. Informe o apelido do segundo investigador, digite o código e clique em **ENTRAR**.
5. Resolva uma missão no primeiro dispositivo. O segundo recebe o progresso automaticamente sem F5.
6. Teste também dicas, seleção de evidências e veredito. Todas as alterações relevantes são compartilhadas.

## Acessar pelo celular na mesma rede

Se o computador estiver na rede Wi-Fi, descubra o IP local:

```bash
hostname -I
```

Exemplo: se mostrar `192.168.1.24`, no celular acesse `http://192.168.1.24:5173`.

**Ambos os dispositivos devem alcançar o servidor**. Computador desligado ou rede diferente interrompem a sincronização. O progresso já salvo permanece no banco e será recuperado ao reconectar.

## Banco de dados

O banco SQLite é mantido em `server/data/arquivo404.sqlite`, criado automaticamente usando `sql.js`. Ele contém as salas, os dois participantes e o progresso compartilhado.

## Produção (somente com servidor ativo)

```bash
npm run build
npm start
```

Servidor único: http://localhost:3001. Para acesso pela internet fora da rede local, hospede o Node.js em um serviço que permita WebSockets e **armazenamento persistente**, com HTTPS e HTTPS/WSS configurados pelo provedor.

## Privacidade e limitações

- A sala admite até dois jogadores; cada navegador recebe uma credencial distinta, armazenada localmente.
- Quem conhece o código da sala pode ocupar a segunda vaga disponível. Não use dados pessoais sensíveis nos apelidos.
- Botão **Sair da sala** libera a vaga. O botão de reset reinicia a investigação para a dupla toda.
- Os códigos das fases são validados pelo servidor, não apenas no navegador.
- Os arquivos antigos da pasta `offline/` continuam com o comportamento individual anterior. Para sincronizar, use o React com o back-end ativo (`npm run dev` ou `npm start`).
- Em hospedagens com disco temporário, faça backups do arquivo SQLite ou configure volume persistente.
