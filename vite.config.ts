import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import { neon } from "@neondatabase/serverless";

const DB_URL = "postgresql://neondb_owner:npg_8Rt5gjsKrYzJ@ep-aged-credit-antv5fq0-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Use the proven @neondatabase/serverless driver
const sql = neon(DB_URL);

async function runNeonQuery(query: string, params: unknown[]): Promise<unknown[]> {
  // sql.query() with default options returns rows directly as Record<string, any>[]
  const rows = await sql.query(query, params as any[]);
  return rows;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    sourcemap: false,
    target: "es2020",
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-toast", "@radix-ui/react-tooltip", "lucide-react"],
        },
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Local SQL proxy plugin — handles /api/sql in dev so browser doesn't call Neon directly
    {
      name: "local-sql-proxy",
      configureServer(server: ViteDevServer) {
        server.middlewares.use("/api/sql", (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "application/json");

          if (req.method === "OPTIONS") {
            res.statusCode = 200;
            return res.end();
          }

          let body = "";
          req.on("data", (chunk: Buffer) => (body += chunk.toString()));
          req.on("end", async () => {
            try {
              const { query, params = [] } = JSON.parse(body);
              const rows = await runNeonQuery(query, params);
              res.statusCode = 200;
              res.end(JSON.stringify({ rows }));
            } catch (err: any) {
              console.error("[sql-proxy] error:", err.message);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // ── /api/send-message ──────────────────────────────────────────────
        server.middlewares.use("/api/send-message", (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Content-Type", "application/json");
          if (req.method === "OPTIONS") { res.statusCode = 200; return res.end(); }

          let body = "";
          req.on("data", (chunk: Buffer) => (body += chunk.toString()));
          req.on("end", async () => {
            try {
              const payload = JSON.parse(body);
              const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
              const MASTER_EMAIL = "tsribatsapatro@gmail.com";
              if (!RESEND_API_KEY) {
                console.warn("[send-message] RESEND_API_KEY not set — email skipped in dev");
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, dev: true }));
              }

              const { guestName, nickname, message, adminEmail, adminName, invitationUrl } = payload;
              const displayName = nickname ? `${guestName} (${nickname})` : guestName || "A Guest";
              const ccList = adminEmail?.toLowerCase().trim() !== MASTER_EMAIL.toLowerCase() ? [MASTER_EMAIL] : [];

              const emailPayload: Record<string, unknown> = {
                from: "SADA SRI NILAYAM <noreply@sadasrinilayam.com>",
                to: [adminEmail],
                subject: `💌 Message from your guest ${guestName} — SADA SRI NILAYAM`,
                html: `<p>Message from <strong>${displayName}</strong>:</p><blockquote>${message?.replace(/</g,"&lt;")}</blockquote><p>Invitation: ${invitationUrl || "N/A"}</p>`,
                text: `Message from ${displayName}:\n\n${message}\n\nInvitation: ${invitationUrl || "N/A"}`,
              };
              if (ccList.length) emailPayload.cc = ccList;

              const r = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify(emailPayload),
              });
              const data = await r.json() as Record<string, unknown>;
              if (!r.ok) { res.statusCode = 500; return res.end(JSON.stringify({ error: (data as {message?:string}).message || "Resend error" })); }
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Unknown error";
              console.error("[send-message]", msg);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: msg }));
            }
          });
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
