import { defineConfig } from 'vite';
export default defineConfig({
  base:'./',
  build:{outDir:'dist',sourcemap:false},
  server:{host:'0.0.0.0',proxy:{
    '/api':{target:'http://localhost:3002',changeOrigin:true},
    '/socket.io':{target:'http://localhost:3002',ws:true,changeOrigin:true}
  }}
});
