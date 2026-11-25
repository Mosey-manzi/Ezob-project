import { mkdir, writeFile } from "node:fs/promises";
import { randomInt } from "node:crypto";
import path from "node:path";
import { FILE_LIMITS, MB } from "../src/lib/fileRules.js";
import { buildEmail } from "./emails.js";
import { ApiError, parseSubmission, } from "./validation.js";
const ROUTES = {
    "/membership": "membership",
    "/inquiry": "inquiry",
    "/invitation": "invitation",
};
const PLACEHOLDER_KEY = "re_YOUR_RESEND_API_KEY";
const PLACEHOLDER_ADMIN = "email@example.org";
const MAX_REQUEST_BYTES = Math.round((FILE_LIMITS.maxTotalMB + 0.4) * MB);
export function isPlaceholder(value, placeholder) {
    return !value || value.trim() === "" || value.trim() === placeholder || value.includes("YOUR_");
}
export function makeReference(now = new Date()) {
    const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no look-alike characters
    let code = "";
    for (let i = 0; i < 5; i++)
        code += alphabet[randomInt(alphabet.length)];
    return `TWF-${now.getFullYear()}-${code}`;
}
async function readBody(req, limit) {
    const preRead = req.body;
    if (Buffer.isBuffer(preRead)) {
        if (preRead.length > limit)
            throw new ApiError(413, "too_large", "request too large");
        return preRead;
    }
    const declared = Number(req.headers["content-length"] ?? 0);
    if (declared > limit)
        throw new ApiError(413, "too_large", "request too large");
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        const buf = chunk;
        size += buf.length;
        if (size > limit)
            throw new ApiError(413, "too_large", "request too large");
        chunks.push(buf);
    }
    return Buffer.concat(chunks);
}
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
}
function clientIp(req, trustProxy) {
    if (trustProxy) {
        const forwarded = req.headers["x-forwarded-for"];
        const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
        if (first)
            return first;
    }
    return req.socket.remoteAddress ?? "unknown";
}
function createLimiter(max, windowMs) {
    const hits = new Map();
    return (key) => {
        const now = Date.now();
        const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
        if (recent.length >= max) {
            hits.set(key, recent);
            return false;
        }
        recent.push(now);
        hits.set(key, recent);
        return true;
    };
}
async function sendWithResend(config, sub, reference, receivedAt) {
    const { subject, html, text } = buildEmail(sub, { reference, receivedAt, logoUrl: config.logoUrl });
    const to = (config.adminEmail ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const payload = {
        from: config.fromEmail,
        to,
        reply_to: sub.fields.email, // "Reply" in the admin's mailbox goes to the visitor
        subject,
        html,
        text,
        ...(sub.attachments.length > 0 && {
            attachments: sub.attachments.map((a) => ({
                filename: a.filename,
                content: a.content.toString("base64"),
            })),
        }),
    };
    const res = await fetch(config.resendApiUrl ?? "https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.resendApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(`Resend answered ${res.status}: ${detail}`);
    }
}
// Preview mode: no real key yet, so write the finished email to disk instead.
async function writePreview(config, sub, reference, receivedAt) {
    const { subject, html } = buildEmail(sub, { reference, receivedAt, logoUrl: config.logoUrl });
    const dir = path.resolve(config.previewDir ?? ".email-previews");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${reference}-${sub.kind}.html`);
    await writeFile(file, html, "utf8");
    for (const a of sub.attachments) {
        const folder = path.join(dir, `${reference}-attachments`);
        await mkdir(folder, { recursive: true });
        await writeFile(path.join(folder, a.filename), a.content);
    }
    console.log(`[ezob-api] PREVIEW MODE - no email sent (no real RESEND_API_KEY yet).\n` +
        `           ${subject}\n` +
        `           attachments: ${sub.attachments.map((a) => a.filename).join(", ") || "none"}\n` +
        `           open: ${file}`);
}
export function createApiMiddleware(config) {
    const allow = createLimiter(config.rateLimitMax ?? 20, config.rateLimitWindowMs ?? 15 * 60_000);
    const previewMode = isPlaceholder(config.resendApiKey, PLACEHOLDER_KEY);
    const previewAllowed = config.allowPreview ?? true;
    if (previewMode && previewAllowed) {
        console.log("[ezob-api] No real RESEND_API_KEY found: running in PREVIEW MODE (emails are saved to .email-previews/, not sent).");
    }
    return async function handle(req, res, next) {
        // When mounted with `app.use("/api", ...)` the server strips "/api" from req.url
        // and keeps the original in req.originalUrl; handle both ways of being called.
        const originalUrl = req.originalUrl ?? req.url ?? "";
        const route = (req.url ?? "").split("?")[0].replace(/^\/api(?=\/)/, "");
        const kind = ROUTES[route];
        if (!kind) {
            if (next && !originalUrl.startsWith("/api"))
                return next();
            return sendJson(res, 404, { ok: false, error: "server" });
        }
        if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            return sendJson(res, 405, { ok: false, error: "server" });
        }
        try {
            if (!allow(clientIp(req, config.trustProxy ?? false)))
                throw new ApiError(429, "rate_limited", "too many submissions");
            if (previewMode && !previewAllowed) {
                console.error("[ezob-api] RESEND_API_KEY is missing or still the placeholder. In Vercel: Project > Settings > Environment Variables, then redeploy.");
                throw new ApiError(500, "server", "resend key not configured");
            }
            if (!previewMode && isPlaceholder(config.adminEmail, PLACEHOLDER_ADMIN)) {
                console.error("[ezob-api] ADMIN_EMAIL is not set (or still the placeholder). Set it in .env.local (local) or Vercel Environment Variables (production).");
                throw new ApiError(500, "server", "admin email not configured");
            }
            if (!previewMode && !config.fromEmail) {
                console.error("[ezob-api] FROM_EMAIL is not set. Set it in .env.local (local) or Vercel Environment Variables (production).");
                throw new ApiError(500, "server", "from email not configured");
            }
            const contentType = String(req.headers["content-type"] ?? "");
            if (!contentType.startsWith("multipart/form-data"))
                throw new ApiError(400, "invalid_input", "expected multipart/form-data");
            const body = await readBody(req, MAX_REQUEST_BYTES);
            let form;
            try {
                form = await new Request("http://localhost/", {
                    method: "POST",
                    headers: { "content-type": contentType },
                    body: new Uint8Array(body),
                }).formData();
            }
            catch {
                throw new ApiError(400, "invalid_input", "could not read the form");
            }
            const submission = await parseSubmission(kind, form);
            const receivedAt = new Date();
            const reference = makeReference(receivedAt);
            if (previewMode)
                await writePreview(config, submission, reference, receivedAt);
            else
                await sendWithResend(config, submission, reference, receivedAt);
            return sendJson(res, 200, { ok: true, reference });
        }
        catch (err) {
            if (err instanceof ApiError) {
                if (err.status >= 500)
                    console.error(`[ezob-api] ${err.message}`);
                return sendJson(res, err.status, { ok: false, error: err.code });
            }
            console.error("[ezob-api] Could not send the email:", err instanceof Error ? err.message : err);
            return sendJson(res, 502, { ok: false, error: "server" });
        }
    };
}
