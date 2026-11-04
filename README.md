# ARQUIVO 404 — Central de Investigação (React)

Jogo híbrido para duplas, feito para funcionar com o kit impresso do Caso F-404.

## Abrir no VS Code (Linux / Pop!_OS)

```bash
cd ~/Downloads
unzip -o Arquivo404_React_Definitivo.zip -d "$HOME/Downloads"
cd "$HOME/Downloads/Arquivo404_React_Definitivo"
code .
```

## Desenvolvimento: React 18 + Vite

Precisa de Node.js 18 ou superior e conexão com a internet na primeira instalação das dependências.

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar, normalmente http://localhost:5173.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

### Modo offline já incluído

A pasta `offline/` tem uma versão React pré-compilada que não precisa instalar pacotes.
Ela utiliza uma distribuição compacta do runtime React, incluída apenas no modo offline.
Para executar em qualquer navegador moderno:

```bash
cd offline
python3 -m http.server 5500
```

Abra http://localhost:5500.

## Estrutura

- `src/App.jsx` — componentes e lógica das fases, provas, suspeitos e veredito.
- `src/styles.css` — design responsivo.
- `src/main.jsx` — inicialização do React no Vite.
- `offline/` — versão pronta para executar, sem instalar pacotes.
- `package.json` e `vite.config.js` — configuração do projeto.

## Compatibilidade com o kit físico

Usar somente com as evidências impressas do Arquivo 404: envelopes 00 a 04.
- Fase 1: linha do tempo, Envelope 01.
- Fase 2: matriz + visor, Envelope 02.
- Fase 3: disco decodificador, Envelope 03.
- Fase 4: documento fragmentado, Envelope 04.

O progresso é salvo apenas neste navegador (localStorage). O jogo não envia dados a servidores, não possui ranking compartilhado e não solicita login. Use "Reiniciar investigação" para preparar uma nova dupla.

## Recursos

- 6 áreas de investigação
- Quatro fases desbloqueáveis e sistema de dicas
- Dossiê dos suspeitos e transcrições
- Inventário de evidências, favoritos e pesquisa
- Veredito com seleção de provas e pontuação até 650
- Cronômetro, relatório de encerramento e opção de alto contraste
- Responsivo em celular e desktop; modo offline pré-compilado

> Os personagens, o Instituto Vértice e os registros do jogo são fictícios. Não usar dados reais de alunos.

## Atualizar o modo offline após editar o código

```bash
npm run build:offline
```

O modo offline acompanha uma versão pré-compilada baseada em React 16 (incluída no pacote para não depender de CDN). O fluxo principal de desenvolvimento usa React 18 e Vite. A lógica e os componentes são compartilhados entre as duas formas de execução.

Os arquivos de terceiros e suas licenças estão documentados em `THIRD_PARTY_LICENSES.txt`.
