import { chromium } from 'playwright';
import { URL } from 'url';

export async function crawlSite({ startUrl, maxPages=200, sameOrigin=true }) {
  const visited=new Set(), queue=[startUrl], urls=[];
  const origin=new URL(startUrl).origin;
  const browser=await chromium.launch({headless:true, channel:'chrome'});
  const context=await browser.newContext();
  try{
    while(queue.length && urls.length<maxPages){
      const url=queue.shift();
      if(visited.has(url)) continue;
      visited.add(url);
      if(sameOrigin && new URL(url).origin!==origin) continue;
      const page=await context.newPage();
      try{
        await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
        urls.push(url);
        const links=await page.$$eval('a[href]', as=>as.map(a=>a.href));
        for(const l of links) if(!visited.has(l)) queue.push(l);
      }catch{} finally{await page.close();}
    }
  }finally{await context.close(); await browser.close();}
  return {urls};
}
