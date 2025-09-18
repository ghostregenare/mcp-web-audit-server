# 📘 mcp-web-audit-server

All-in-one HTTP server (MCP-style) pro **automatizované audity webu a PWA**.

## ✨ Funkce
1. **Crawler (Playwright)** – projde celý web a vrátí seznam URL.  
2. **Audit přístupnosti (axe-core)** – kontrola WCAG 2.1/2.2 (alt texty, kontrast, formuláře, role).  
3. **Audit kvality (Lighthouse)** – výkon, SEO, Best Practices, PWA compliance.  
4. **Kombinovaný audit celého webu** – crawler + Lighthouse + axe na všech stránkách.  
5. **PWA helpery (Workbox)** – práce s manifestem a service workerem.

---

## ⚙️ Požadavky
- Node.js 18+  
- Chrome (instalace přes Playwright: `npm run install:chrome`)  
- Lighthouse CLI (součást NPM balíčku)

---

## 🚀 Instalace a spuštění
```bash
# rozbalení
unzip mcp-web-audit-server.zip -d ./mcp-web-audit-server
cd mcp-web-audit-server

# instalace závislostí
npm install

# instalace Chrome pro Playwright
npm run install:chrome

# spuštění serveru
npm start

# test zdraví
curl http://localhost:3330/health
```

---

## 🔗 End-pointy API

### Health check
```
GET /health
→ { "ok": true }
```

### Crawl webu
```
POST /crawl
{ "startUrl": "http://localhost:5173", "maxPages": 200, "sameOrigin": true }
```

### Audit přístupnosti (axe-core)
```
POST /audit/axe
{ "url": "http://localhost:5173" }
```

### Audit kvality (Lighthouse)
```
POST /audit/lighthouse
{ "url": "http://localhost:5173", "categories": ["performance","seo","pwa","accessibility"] }
```

### Audit celého webu
```
POST /audit/site
{ "startUrl": "http://localhost:5173", "maxPages": 50 }
```

### PWA helpery
- `/pwa/ensure-manifest` → vytvoří/zajistí manifest  
- `/pwa/generate-sw` → vygeneruje service worker  
- `/pwa/inject-sw` → doplní SW o precaching

---

## 🤖 Integrace s Claude Code (VS Code)

```jsonc
{
  "mcpServers": {
    "web-audit": { "type": "http", "baseUrl": "http://localhost:3330" },
    "fs": { "type": "fs", "root": "/ABSOLUTNÍ/CESTA/PROJEKTU" },
    "git": { "type": "git", "root": "/ABSOLUTNÍ/CESTA/PROJEKTU" }
  }
}
```

**Ukázkový prompt pro AI:**
> „Spusť `/audit/site` na `http://localhost:5173`.  
> Z výsledků oprav chyby WCAG, přidej alt texty, zlepši kontrast, uprav manifest a vygeneruj service worker.  
> Navrhni diffy pro FS/Git a po schválení commitni. Pak spusť audit znovu.“

---

## ✅ Proč to používat?
- Automatizace testů výkonu, SEO a přístupnosti.  
- Splnění zákonných povinností (WCAG 2.1 AA, EU/ČR).  
- Přímá integrace s AI agenty → chyby nejen najdou, ale i opraví.  
- Lepší UX, rychlost webu a PWA readiness.

---

## 📊 Architektura
```
[Crawler] → [Audit Lighthouse] + [Audit axe-core] → [Report JSON]
      ↓                                        ↑
   [Claude Code MCP]  ← (FS/Git) → [Opravy kódu]
      ↓
   [Opakovaný audit až do splnění kritérií]
```

---

## 📜 Licence
MIT
