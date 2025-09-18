# 📘 MCP Web Audit Server

**Model Context Protocol (MCP) server** pro automatizované audity webu a PWA optimalizaci.

## ✨ Funkce
1. **Crawler (Playwright)** – projde celý web a vrátí seznam URL
2. **Audit přístupnosti (axe-core)** – kontrola WCAG 2.1/2.2 (alt texty, kontrast, formuláře, role)
3. **Audit kvality (Lighthouse)** – výkon, SEO, Best Practices, PWA compliance
4. **Kombinovaný audit celého webu** – crawler + Lighthouse + axe na všech stránkách
5. **PWA helpery (Workbox)** – práce s manifestem a service workerem

---

## ⚙️ Požadavky
- Node.js 18+
- Chrome (instalace přes Playwright: `npm run install:chrome`)
- Claude Code s MCP podporou

---

## 🚀 Instalace a konfigurace

```bash
# instalace závislostí
npm install

# instalace Chrome pro Playwright
npm run install:chrome
```

### Konfigurace v Claude Code

Přidej do nastavení Claude Code (`claude_code_config.json`):

```json
{
  "mcpServers": {
    "web-audit": {
      "command": "node",
      "args": ["/absolutní/cesta/k/mcp-web-audit-server/src/mcp-server.js"]
    }
  }
}
```

---

## 🔧 Dostupné MCP nástroje

### `crawl_site`
Projde web a vrátí všechny nalezené URL
```json
{
  "startUrl": "https://example.com",
  "maxPages": 200,
  "sameOrigin": true
}
```

### `audit_accessibility`
Spustí audit přístupnosti pomocí axe-core
```json
{
  "url": "https://example.com"
}
```

### `audit_lighthouse`
Spustí Lighthouse audit
```json
{
  "url": "https://example.com",
  "categories": ["performance", "seo", "pwa", "accessibility"]
}
```

### `audit_entire_site`
Projde celý web a spustí kompletní audit
```json
{
  "startUrl": "https://example.com",
  "maxPages": 50,
  "categories": ["performance", "seo", "pwa"]
}
```

### `ensure_pwa_manifest`
Vytvoří nebo aktualizuje PWA manifest
```json
{
  "name": "My App",
  "shortName": "MyApp",
  "startUrl": "/",
  "backgroundColor": "#ffffff",
  "themeColor": "#000000"
}
```

### `generate_service_worker`
Vygeneruje service worker pro PWA
```json
{
  "globDirectory": "./dist",
  "swDest": "./dist/sw.js"
}
```

---

## 🤖 Použití s Claude Code

**Ukázkový prompt:**
> "Spusť audit celého webu na https://example.com. Z výsledků oprav všechny chyby přístupnosti, zlepši výkon a přidej PWA support. Commitni změny a spusť audit znovu pro ověření."

Claude automaticky:
1. Spustí `audit_entire_site`
2. Analyzuje výsledky
3. Opraví kód pomocí dalších MCP serverů
4. Commitne změny
5. Znovu ověří pomocí auditu

---

## ✅ Výhody MCP verze
- **Přímá integrace** s Claude Code bez HTTP portů
- **Automatické opravy** kódu na základě audit výsledků
- **Splnění WCAG 2.1 AA** požadavků
- **PWA readiness** s jedním příkazem
- **Kontinuální monitorování** kvality webu

---

## 📊 Workflow
```
[Claude Code] → [MCP Web Audit] → [Analýza výsledků] → [Opravy kódu] → [Commit] → [Re-audit]
```

---

## 📜 Licence
MIT
