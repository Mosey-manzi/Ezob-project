// Automated tests. Run with:  npm run test:api   (needs Node 22.6 or newer)
//
// They start the real API handler, post real multipart forms to it (exactly like
// the browser does) and capture what would be sent to Resend with a fake
// Resend server, so nothing is ever emailed and no API key is needed.

/* eslint-disable @typescript-eslint/no-explicit-any -- loose types are fine for fake-Resend payloads */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createApiMiddleware, type ApiConfig } from "./api.ts";
import { FILE_LIMITS, MB, validateFiles } from "../src/lib/fileRules.ts";
import { en } from "../src/i18n/en.ts";
import { rw } from "../src/i18n/rw.ts";

const realLog = console.log;
const realError = console.error;
console.log = () => {};
console.error = () => {};
after(() => {
  console.log = realLog;
  console.error = realError;
});

// ---------- fake Resend + API server helpers ----------
type ResendCall = Record<string, any>;

async function listen(server: http.Server): Promise<string> {
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
}

async function startFakeResend(status = 200) {
  const calls: ResendCall[] = [];
  const server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    calls.push({ headers: req.headers, body: JSON.parse(Buffer.concat(chunks).toString()) });
    res.statusCode = status;
    res.setHeader("content-type", "application/json");
    res.end(status === 200 ? '{"id":"fake"}' : '{"message":"domain is not verified"}');
  });
  const url = await listen(server);
  return { calls, url: `${url}/emails`, close: () => server.close() };
}

const REAL_KEY = "re_realistic_key_123";
const ADMIN = "admin@ezob.test";
const FROM = "Ezob Website <noreply@ezob.test>";

async function startApi(config: Partial<ApiConfig> = {}, resendStatus = 200) {
  const resend = await startFakeResend(resendStatus);
  const handler = createApiMiddleware({
    resendApiKey: REAL_KEY,
    adminEmail: ADMIN,
    fromEmail: FROM,
    resendApiUrl: resend.url,
    ...config,
  });
  const server = http.createServer((req, res) => {
    void handler(req, res, () => {
      res.statusCode = 404;
      res.end();
    });
  });
  const base = await listen(server);
  return {
    base,
    resend,
    close: () => {
      server.close();
      resend.close();
    },
    post: async (route: string, form: FormData) => {
      const res = await fetch(`${base}/api/${route}`, { method: "POST", body: form });
      return { status: res.status, json: (await res.json()) as Record<string, any> };
    },
  };
}

// ---------- sample files (real file signatures) ----------
const PDF = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF");
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);
const JPG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64)]);
const DOCX = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(64)]);
const DOC = Buffer.concat([Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), Buffer.alloc(64)]);
const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP"), Buffer.alloc(32)]);
const EXE = Buffer.concat([Buffer.from("MZ"), Buffer.alloc(64)]);

const file = (bytes: Buffer, name: string, type = "application/octet-stream") =>
  new File([new Uint8Array(bytes)], name, { type });

function formOf(fields: Record<string, string>, files: [string, File][] = []): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  for (const [k, f] of files) form.append(k, f);
  return form;
}

const INQUIRY = { name: "Aline Uwase", email: "aline@example.com", subject: "Booking for a wedding", message: "Hello,\nCan you sing at our wedding?" };
const INVITATION = {
  organization: "Grace Chapel Kigali",
  contactName: "Pastor Jean",
  email: "jean@grace.test",
  phone: "+250 788 123 456",
  eventName: "Annual Praise Night",
  proposedDate: "2026-12-12",
  eventLocation: "Kigali Convention Centre",
  eventDescription: "A night of worship with many churches.",
};
const MEMBERSHIP = {
  fullName: "Keza Marie",
  age: "24",
  gender: "Female",
  maritalStatus: "Single",
  residence: "Kimironko, Kigali",
  church: "Grace Chapel",
  email: "keza@example.com",
  ministry: "Ministry of Singers",
  journey: "I met Jesus at 15.",
  abilities: "Alto voice and piano.",
  clarity: "I have a few ideas",
  commitmentsAccepted: "on",
  language: "rw",
};

// =====================================================================
describe("email API: successful submissions", () => {
  let api: Awaited<ReturnType<typeof startApi>>;
  before(async () => {
    api = await startApi({ rateLimitMax: 1000 });
  });
  after(() => api.close());

  test("general inquiry is emailed to the admin with reply-to the visitor", async () => {
    const { status, json } = await api.post("inquiry", formOf(INQUIRY));
    assert.equal(status, 200);
    assert.equal(json.ok, true);
    assert.match(json.reference, /^TWF-\d{4}-[A-Z0-9]{5}$/);
    const call = api.resend.calls.at(-1)!;
    assert.equal(call.headers.authorization, `Bearer ${REAL_KEY}`);
    assert.equal(call.body.from, FROM);
    assert.deepEqual(call.body.to, [ADMIN]);
    assert.equal(call.body.reply_to, "aline@example.com");
    assert.equal(call.body.subject, "[General Inquiry] Booking for a wedding — Aline Uwase");
    assert.match(call.body.html, /New general inquiry/);
    assert.match(call.body.html, /Can you sing at our wedding\?/);
    assert.match(call.body.text, /Reference: TWF-/);
    assert.equal(call.body.attachments, undefined);
  });

  test("invitation with a PDF letter attaches the exact file", async () => {
    const { status, json } = await api.post("invitation", formOf(INVITATION, [["letter", file(PDF, "invitation letter.pdf", "application/pdf")]]));
    assert.equal(status, 200);
    const call = api.resend.calls.at(-1)!;
    assert.equal(call.body.subject, "[Official Invitation] Annual Praise Night — Grace Chapel Kigali");
    assert.match(call.body.html, /Saturday, 12 December 2026/);
    assert.match(call.body.html, /New official invitation/);
    assert.equal(call.body.attachments.length, 1);
    assert.equal(call.body.attachments[0].filename, "invitation letter.pdf");
    assert.deepEqual(Buffer.from(call.body.attachments[0].content, "base64"), PDF);
    assert.ok(json.reference);
  });

  test("invitation without a letter is still accepted", async () => {
    const { status } = await api.post("invitation", formOf(INVITATION));
    assert.equal(status, 200);
    assert.match(api.resend.calls.at(-1)!.body.html, /No invitation letter was attached/);
  });

  test("an empty file input (browser sends a blank part) is ignored, not an error", async () => {
    const form = formOf(INVITATION);
    form.append("letter", new File([], "")); // what browsers send for an unselected file input
    const { status } = await api.post("invitation", form);
    assert.equal(status, 200);
  });

  test("membership application with several documents attaches them all, in any supported format", async () => {
    const docs: [string, File][] = [
      ["documents", file(DOCX, "reference.docx")],
      ["documents", file(PNG, "id-card.png", "image/png")],
      ["documents", file(JPG, "photo.jpeg", "image/jpeg")],
      ["documents", file(DOC, "old.doc")],
      ["documents", file(WEBP, "pic.webp", "image/webp")],
    ];
    const { status } = await api.post("membership", formOf(MEMBERSHIP, docs));
    assert.equal(status, 200);
    const body = api.resend.calls.at(-1)!.body;
    assert.equal(body.subject, "[Membership Application] Keza Marie · Ministry of Singers");
    assert.match(body.html, /New membership application/);
    assert.match(body.html, /ACCEPTED/);
    assert.match(body.html, /Website language used: Kinyarwanda|Kinyarwanda/);
    assert.deepEqual(body.attachments.map((a: any) => a.filename), ["reference.docx", "id-card.png", "photo.jpeg", "old.doc", "pic.webp"]);
    assert.equal(body.reply_to, "keza@example.com");
  });

  test("membership without documents works", async () => {
    const { status } = await api.post("membership", formOf(MEMBERSHIP));
    assert.equal(status, 200);
    assert.match(api.resend.calls.at(-1)!.body.html, /No supporting documents were attached/);
  });

  test("filenames are sanitised and duplicates renamed", async () => {
    const docs: [string, File][] = [
      ["documents", file(PDF, "../../evil name.pdf", "application/pdf")],
      ["documents", file(PDF, "a.pdf", "application/pdf")],
      ["documents", file(PDF, "A.pdf", "application/pdf")],
    ];
    const { status } = await api.post("membership", formOf(MEMBERSHIP, docs));
    assert.equal(status, 200);
    const names = api.resend.calls.at(-1)!.body.attachments.map((a: any) => a.filename);
    assert.deepEqual(names, ["evil name.pdf", "a.pdf", "A (2).pdf"]);
  });

  test("visitor input cannot inject HTML or email headers", async () => {
    const { status } = await api.post("inquiry", formOf({ ...INQUIRY, name: "<script>alert(1)</script>", subject: "Hi\r\nBcc: evil@x.com" }));
    assert.equal(status, 200);
    const body = api.resend.calls.at(-1)!.body;
    assert.ok(!body.html.includes("<script>alert(1)"));
    assert.match(body.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.ok(!/[\r\n]/.test(body.subject));
  });

  test("several admin addresses can be configured", async () => {
    const multi = await startApi({ adminEmail: "a@ezob.test, b@ezob.test" });
    await multi.post("inquiry", formOf(INQUIRY));
    assert.deepEqual(multi.resend.calls.at(-1)!.body.to, ["a@ezob.test", "b@ezob.test"]);
    multi.close();
  });

  test("optional logo url appears in the email header", async () => {
    const withLogo = await startApi({ logoUrl: "https://ezob.test/logo.png" });
    await withLogo.post("inquiry", formOf(INQUIRY));
    assert.match(withLogo.resend.calls.at(-1)!.body.html, /<img src="https:\/\/ezob\.test\/logo\.png"/);
    withLogo.close();
  });
});

// =====================================================================
describe("email API: validation and rejected files", () => {
  let api: Awaited<ReturnType<typeof startApi>>;
  before(async () => {
    api = await startApi({ rateLimitMax: 1000 });
  });
  after(() => api.close());
  const sent = () => api.resend.calls.length;

  test("missing / malformed fields are refused and nothing is emailed", async () => {
    const before = sent();
    const bad: [string, Record<string, string>][] = [
      ["inquiry", { ...INQUIRY, message: "" }],
      ["inquiry", { ...INQUIRY, email: "not-an-email" }],
      ["invitation", { ...INVITATION, proposedDate: "2026-02-31" }],
      ["invitation", { ...INVITATION, phone: "abc" }],
      ["membership", { ...MEMBERSHIP, age: "15" }],
      ["membership", { ...MEMBERSHIP, gender: "Other" }],
      ["membership", { ...MEMBERSHIP, commitmentsAccepted: "" }],
      ["membership", { ...MEMBERSHIP, ministry: "Hacking" }],
      ["inquiry", { ...INQUIRY, message: "x".repeat(5001) }],
    ];
    for (const [route, fields] of bad) {
      const { status, json } = await api.post(route, formOf(fields));
      assert.equal(status, 400, JSON.stringify(fields));
      assert.equal(json.error, "invalid_input");
    }
    assert.equal(sent(), before);
  });

  test("unsupported file types are refused (exe, zip, txt)", async () => {
    for (const name of ["virus.exe", "archive.zip", "notes.txt", "noextension"]) {
      const { status, json } = await api.post("invitation", formOf(INVITATION, [["letter", file(PDF, name)]]));
      assert.equal(status, 400, name);
      assert.equal(json.error, "invalid_file");
    }
  });

  test("a file whose contents do not match its extension is refused", async () => {
    const r1 = await api.post("invitation", formOf(INVITATION, [["letter", file(EXE, "totally-a-letter.pdf", "application/pdf")]]));
    assert.equal(r1.json.error, "invalid_file");
    const r2 = await api.post("membership", formOf(MEMBERSHIP, [["documents", file(PDF, "pic.png", "image/png")]]));
    assert.equal(r2.json.error, "invalid_file");
  });

  test("an empty (0 byte) named file is refused", async () => {
    const { json } = await api.post("invitation", formOf(INVITATION, [["letter", new File([], "empty.pdf")]]));
    assert.equal(json.error, "invalid_file");
  });

  test("an oversized file is refused with too_large", async () => {
    const big = Buffer.concat([PDF, Buffer.alloc(FILE_LIMITS.maxFileMB * MB + 1)]);
    const { status, json } = await api.post("invitation", formOf(INVITATION, [["letter", file(big, "big.pdf", "application/pdf")]]));
    assert.equal(status, 413);
    assert.equal(json.error, "too_large");
  });

  test("files together over the total limit are refused", async () => {
    const chunk = Buffer.concat([PDF, Buffer.alloc(4.9 * MB)]);
    const docs: [string, File][] = [1, 2, 3, 4].map((n) => ["documents", file(chunk, `d${n}.pdf`, "application/pdf")]);
    const { status, json } = await api.post("membership", formOf(MEMBERSHIP, docs));
    assert.equal(status, 413);
    assert.equal(json.error, "too_large");
  });

  test("too many files, and files in the wrong field, are refused", async () => {
    const six: [string, File][] = Array.from({ length: 6 }, (_, i) => ["documents", file(PDF, `d${i}.pdf`, "application/pdf")]);
    assert.equal((await api.post("membership", formOf(MEMBERSHIP, six))).json.error, "invalid_file");
    const two: [string, File][] = [["letter", file(PDF, "a.pdf")], ["letter", file(PDF, "b.pdf")]];
    assert.equal((await api.post("invitation", formOf(INVITATION, two))).json.error, "invalid_file");
    assert.equal((await api.post("inquiry", formOf(INQUIRY, [["letter", file(PDF, "a.pdf")]]))).json.error, "invalid_input");
    assert.equal((await api.post("invitation", formOf(INVITATION, [["documents", file(PDF, "a.pdf")]]))).json.error, "invalid_input");
  });

  test("wrong method, unknown route and non-form bodies are handled", async () => {
    const emailsBefore = sent();
    assert.equal((await fetch(`${api.base}/api/inquiry`)).status, 405);
    assert.equal((await fetch(`${api.base}/api/nothing`, { method: "POST" })).status, 404);
    const res = await fetch(`${api.base}/api/inquiry`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal(res.status, 400);
    assert.equal(sent(), emailsBefore);
  });
});

// =====================================================================
describe("email API: configuration and failure states", () => {
  test("Resend failing gives a clean 'server' error (and never leaks details)", async () => {
    const api = await startApi({}, 422);
    const { status, json } = await api.post("inquiry", formOf(INQUIRY));
    assert.equal(status, 502);
    assert.deepEqual(json, { ok: false, error: "server" });
    api.close();
  });

  test("a real key with the placeholder admin address refuses to send", async () => {
    const api = await startApi({ adminEmail: "email@example.org" });
    const { status, json } = await api.post("inquiry", formOf(INQUIRY));
    assert.equal(status, 500);
    assert.equal(json.error, "server");
    assert.equal(api.resend.calls.length, 0);
    api.close();
  });

  test("a real key without a FROM address refuses to send", async () => {
    const api = await startApi({ fromEmail: "" });
    const { status } = await api.post("inquiry", formOf(INQUIRY));
    assert.equal(status, 500);
    assert.equal(api.resend.calls.length, 0);
    api.close();
  });

  test("PREVIEW MODE (placeholder key): succeeds, sends nothing, saves the email and attachments", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "ezob-preview-"));
    const api = await startApi({ resendApiKey: "re_YOUR_RESEND_API_KEY", adminEmail: "email@example.org", previewDir: dir });
    const { status, json } = await api.post("invitation", formOf(INVITATION, [["letter", file(PDF, "letter.pdf", "application/pdf")]]));
    assert.equal(status, 200);
    assert.equal(api.resend.calls.length, 0);
    const files = await readdir(dir);
    assert.ok(files.includes(`${json.reference}-invitation.html`));
    const html = await readFile(path.join(dir, `${json.reference}-invitation.html`), "utf8");
    assert.match(html, /Annual Praise Night/);
    assert.deepEqual(await readFile(path.join(dir, `${json.reference}-attachments`, "letter.pdf")), PDF);
    api.close();
  });

  test("rate limiting stops floods (HTTP 429, error 'rate_limited')", async () => {
    const api = await startApi({ rateLimitMax: 2 });
    assert.equal((await api.post("inquiry", formOf(INQUIRY))).status, 200);
    assert.equal((await api.post("inquiry", formOf(INQUIRY))).status, 200);
    const third = await api.post("inquiry", formOf(INQUIRY));
    assert.equal(third.status, 429);
    assert.equal(third.json.error, "rate_limited");
    assert.equal(api.resend.calls.length, 2);
    api.close();
  });
});

// =====================================================================
describe("browser-side file rules (src/lib/fileRules.ts)", () => {
  const f = (name: string, size: number, type = "", lastModified = 1) => ({ name, size, type, lastModified });
  const opts = { maxFiles: 5 };

  test("accepts PDF, DOC, DOCX and common image types, including empty/generic MIME types", () => {
    const r = validateFiles([], [f("a.pdf", 10, "application/pdf"), f("b.DOCX", 10), f("c.doc", 10, "application/octet-stream"), f("d.jpg", 10, "image/jpeg"), f("e.png", 10, "image/png")], opts);
    assert.equal(r.accepted.length, 5);
    assert.equal(r.problems.length, 0);
  });

  test("reports every rejected file with a reason (nothing silent)", () => {
    const big = FILE_LIMITS.maxFileMB * MB + 1;
    const r = validateFiles([f("old.pdf", 10, "", 9)], [f("x.exe", 10), f("big.pdf", big), f("empty.pdf", 0), f("old.pdf", 10, "", 9), f("fake.pdf", 10, "text/html")], opts);
    assert.deepEqual(r.problems.map((p) => p.code), ["type", "size", "empty", "duplicate", "type"]);
    assert.equal(r.accepted.length, 0);
  });

  test("enforces the file count and the total size", () => {
    const six = Array.from({ length: 6 }, (_, i) => f(`f${i}.pdf`, 10));
    const r = validateFiles([], six, opts);
    assert.equal(r.accepted.length, 5);
    assert.deepEqual(r.problems.map((p) => p.code), ["count"]);
    const each = 4 * MB;
    const t = validateFiles([], [f("a.pdf", each), f("b.pdf", each), f("c.pdf", each), f("d.pdf", each)], opts);
    assert.deepEqual(t.problems.map((p) => p.code), ["total"]);
    assert.equal(t.accepted.length, 3);
  });
});

// =====================================================================
describe("translations", () => {
  const leaves = (o: unknown, prefix = ""): string[] =>
    typeof o === "string" ? [prefix] : Object.entries(o as object).flatMap(([k, v]) => leaves(v, `${prefix}${prefix ? "." : ""}${k}`));

  test("English and Kinyarwanda have exactly the same keys, none empty", () => {
    const e = leaves(en).sort();
    const r = leaves(rw).sort();
    assert.deepEqual(r, e);
    const get = (o: any, p: string) => p.split(".").reduce((x, k) => x[k], o) as string;
    for (const key of r) assert.ok(get(rw, key).trim().length > 0, key);
  });

  test("every file problem and every API error code has a message in both languages", () => {
    for (const dict of [en, rw]) {
      for (const code of ["type", "size", "empty", "duplicate", "count", "total"]) assert.ok((dict.files.problems as any)[code]);
      for (const code of ["network", "timeout", "too_large", "invalid_file", "invalid_input", "rate_limited", "server"]) assert.ok((dict.errors as any)[code], code);
    }
  });

  test("placeholders used in messages are kept in the Kinyarwanda text", () => {
    for (const code of ["size", "count", "total", "type", "empty", "duplicate"] as const) {
      const placeholders = (en.files.problems[code].match(/\{\w+\}/g) ?? []).sort();
      assert.deepEqual((rw.files.problems[code].match(/\{\w+\}/g) ?? []).sort(), placeholders, code);
    }
    assert.ok(rw.thanks.invitationRef.includes("{ref}"));
  });
});
