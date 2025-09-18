#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { crawlSite } from './siteCrawler.js';
import { auditAxe } from './tools/axeAudit.js';
import { auditLighthouse } from './tools/lighthouseAudit.js';
import { ensureManifest, generateSW } from './tools/workboxTools.js';

const server = new Server(
  {
    name: "web-audit",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "crawl_site",
        description: "Crawl a website and return all URLs found",
        inputSchema: {
          type: "object",
          properties: {
            startUrl: {
              type: "string",
              description: "The starting URL to crawl",
            },
            maxPages: {
              type: "number",
              description: "Maximum number of pages to crawl (default: 200)",
            },
            sameOrigin: {
              type: "boolean",
              description: "Only crawl pages from the same origin (default: true)",
            },
          },
          required: ["startUrl"],
        },
      },
      {
        name: "audit_accessibility",
        description: "Run accessibility audit using axe-core",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to audit for accessibility",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "audit_lighthouse",
        description: "Run Lighthouse audit for performance, SEO, PWA",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "URL to audit with Lighthouse",
            },
            categories: {
              type: "array",
              items: { type: "string" },
              description: "Categories to audit: performance, accessibility, best-practices, seo, pwa",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "audit_entire_site",
        description: "Crawl entire site and run both Lighthouse and accessibility audits",
        inputSchema: {
          type: "object",
          properties: {
            startUrl: {
              type: "string",
              description: "Starting URL for site audit",
            },
            maxPages: {
              type: "number",
              description: "Maximum pages to audit (default: 50)",
            },
            categories: {
              type: "array",
              items: { type: "string" },
              description: "Lighthouse categories to include",
            },
          },
          required: ["startUrl"],
        },
      },
      {
        name: "ensure_pwa_manifest",
        description: "Create or ensure PWA manifest exists",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "App name",
            },
            shortName: {
              type: "string",
              description: "Short app name",
            },
            startUrl: {
              type: "string",
              description: "Start URL",
            },
            backgroundColor: {
              type: "string",
              description: "Background color",
            },
            themeColor: {
              type: "string",
              description: "Theme color",
            },
          },
        },
      },
      {
        name: "generate_service_worker",
        description: "Generate service worker for PWA",
        inputSchema: {
          type: "object",
          properties: {
            globDirectory: {
              type: "string",
              description: "Directory to glob for precaching",
            },
            swDest: {
              type: "string",
              description: "Service worker destination path",
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "crawl_site": {
        const { startUrl, maxPages = 200, sameOrigin = true } = args;
        const result = await crawlSite({ startUrl, maxPages, sameOrigin });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "audit_accessibility": {
        const { url } = args;
        const result = await auditAxe(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ url, result }, null, 2),
            },
          ],
        };
      }

      case "audit_lighthouse": {
        const { url, categories } = args;
        const report = await auditLighthouse(url, categories);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ url, report }, null, 2),
            },
          ],
        };
      }

      case "audit_entire_site": {
        const { startUrl, maxPages = 50, categories } = args;
        const { urls } = await crawlSite({ startUrl, maxPages });
        const results = [];

        for (const url of urls) {
          const [lighthouse, axe] = await Promise.all([
            auditLighthouse(url, categories),
            auditAxe(url)
          ]);
          results.push({ url, lighthouse, axe });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results }, null, 2),
            },
          ],
        };
      }

      case "ensure_pwa_manifest": {
        const result = await ensureManifest(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "generate_service_worker": {
        const result = await generateSW(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Web Audit Server running on stdio");
}

main().catch(console.error);