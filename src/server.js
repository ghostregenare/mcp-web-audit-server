import express from 'express';
import { crawlSite } from './siteCrawler.js';
import { auditAxe } from './tools/axeAudit.js';
import { auditLighthouse } from './tools/lighthouseAudit.js';
import { ensureManifest, generateSW, injectSW } from './tools/workboxTools.js';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req,res)=>res.json({ok:true}));

app.post('/crawl', async (req,res)=>{
  try {
    const { startUrl, maxPages=200, sameOrigin=true } = req.body||{};
    const out = await crawlSite({ startUrl, maxPages, sameOrigin });
    res.json({ok:true, ...out});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/audit/axe', async (req,res)=>{
  try {
    const { url } = req.body||{};
    const result = await auditAxe(url);
    res.json({ok:true, url, result});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/audit/lighthouse', async (req,res)=>{
  try {
    const { url, categories } = req.body||{};
    const report = await auditLighthouse(url, categories);
    res.json({ok:true, url, report});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/audit/site', async (req,res)=>{
  try {
    const { startUrl, maxPages=200, categories } = req.body||{};
    const { urls } = await crawlSite({ startUrl, maxPages });
    const out=[];
    for(const u of urls){
      const [lh,axe] = await Promise.all([auditLighthouse(u,categories), auditAxe(u)]);
      out.push({url:u, lighthouse:lh, axe});
    }
    res.json({ok:true, results:out});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/pwa/ensure-manifest', async (req,res)=>{
  try {
    const r = await ensureManifest(req.body||{});
    res.json({ok:true,...r});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/pwa/generate-sw', async (req,res)=>{
  try {
    const r = await generateSW(req.body||{});
    res.json({ok:true,...r});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

app.post('/pwa/inject-sw', async (req,res)=>{
  try {
    const r = await injectSW(req.body||{});
    res.json({ok:true,...r});
  } catch(e){res.status(500).json({ok:false,error:e.message});}
});

const PORT = process.env.PORT || 3330;
app.listen(PORT, ()=>console.log("Server running on port "+PORT));
