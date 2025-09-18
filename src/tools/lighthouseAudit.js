import { execFile } from 'child_process';

export async function auditLighthouse(url,categories=['performance','accessibility','best-practices','seo','pwa']){
  return new Promise((resolve,reject)=>{
    const args=[url,'--quiet','--output=json',`--only-categories=${categories.join(',')}`];
    execFile('lighthouse',args,{maxBuffer:1024*1024*50},(err,stdout)=>{
      if(err) return reject(err);
      try{resolve(JSON.parse(stdout));}catch(e){reject(e);} });
  });
}
