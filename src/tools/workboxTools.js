import { generateSW as wbGenerateSW, injectManifest as wbInjectManifest } from 'workbox-build';
import fs from 'fs/promises';

export async function ensureManifest({path='public/manifest.webmanifest',base={}}){
  const def={
    name:base.name||'App',
    short_name:base.short_name||'App',
    start_url:base.start_url||'/',
    scope:base.scope||'/',
    display:base.display||'standalone',
    background_color:base.background_color||'#ffffff',
    theme_color:base.theme_color||'#000000',
    icons:base.icons||[]
  };
  try{await fs.access(path); return {ensured:true,path};}
  catch{await fs.mkdir(path.split('/').slice(0,-1).join('/'),{recursive:true});
        await fs.writeFile(path,JSON.stringify(def,null,2),'utf8');
        return {created:true,path};}
}

export async function generateSW({globDirectory='dist',swDest='dist/sw.js',runtimeCaching=[]}){
  return wbGenerateSW({globDirectory,swDest,clientsClaim:true,skipWaiting:true,runtimeCaching});
}

export async function injectSW({swSrc='src/sw-src.js',swDest='dist/sw.js',globDirectory='dist'}){
  return wbInjectManifest({swSrc,swDest,globDirectory});
}
