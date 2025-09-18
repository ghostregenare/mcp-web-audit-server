import { chromium } from 'playwright';
import fs from 'fs/promises';

export async function auditAxe(url){
  const browser=await chromium.launch({headless:true, channel:'chrome'});
  const context=await browser.newContext();
  const page=await context.newPage();
  try{
    await page.goto(url,{waitUntil:'load',timeout:60000});
    const axe=await fs.readFile(new URL('../../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
    await page.addScriptTag({content:axe});
    return await page.evaluate(async()=>await window.axe.run());
  }finally{await page.close(); await context.close(); await browser.close();}
}
