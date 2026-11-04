/*
 * Compiles the React JSX source to the prepackaged offline React runtime.
 * Run `npm run build:offline` after `npm install` when editing src/App.jsx.
 */
const fs=require('fs');
const path=require('path');
const ts=require('typescript');
const root=path.resolve(__dirname,'..');
let source=fs.readFileSync(path.join(root,'src','App.jsx'),'utf8');
source=source.replace(/^import React from 'react';\s*/, '');
source=source.replace('export default class App extends React.Component','class App extends React.Component');
const result=ts.transpileModule(source,{
  compilerOptions:{jsx:ts.JsxEmit.React,target:ts.ScriptTarget.ES2019,module:ts.ModuleKind.None},
  fileName:'App.jsx',reportDiagnostics:true
});
if(result.diagnostics.length){
  for(const d of result.diagnostics) console.error(ts.flattenDiagnosticMessageText(d.messageText,'\n'));
  process.exit(1);
}
fs.writeFileSync(path.join(root,'offline','app.js'),result.outputText+'\nwindow.Arquivo404App=App;\n');
fs.copyFileSync(path.join(root,'src','styles.css'),path.join(root,'offline','styles.css'));
console.log('Modo offline atualizado. Abra offline/index.html no navegador.');
