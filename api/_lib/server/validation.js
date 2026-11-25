// Server-side validation. The browser already checks all of this, but a browser
// check can be bypassed, so the server never trusts it.
import { ALLOWED_FILES, FILE_LIMITS, MB, extensionOf } from "../src/lib/fileRules.js";
export class ApiError extends Error {
    status;
    code;
    constructor(status, code, message = code) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
const SHORT = 200;
const LONG = 5000;
const SPECS = {
    inquiry: [
        { name: "name", max: 120, rule: "text", required: true },
        { name: "email", max: 254, rule: "email", required: true },
        { name: "subject", max: SHORT, rule: "text", required: true },
        { name: "message", max: LONG, rule: "text", required: true },
    ],
    invitation: [
        { name: "organization", max: SHORT, rule: "text", required: true },
        { name: "contactName", max: 150, rule: "text", required: true },
        { name: "email", max: 254, rule: "email", required: true },
        { name: "phone", max: 40, rule: "phone", required: true },
        { name: "eventName", max: SHORT, rule: "text", required: true },
        { name: "proposedDate", max: 10, rule: "date", required: true },
        { name: "eventLocation", max: 250, rule: "text", required: true },
        { name: "eventDescription", max: LONG, rule: "text", required: true },
    ],
    membership: [
        { name: "fullName", max: 150, rule: "text", required: true },
        { name: "age", max: 3, rule: "age", required: true },
        { name: "gender", max: 20, rule: ["Female", "Male"], required: true },
        { name: "maritalStatus", max: 20, rule: ["Single", "Married"], required: true },
        { name: "residence", max: SHORT, rule: "text", required: true },
        { name: "church", max: SHORT, rule: "text", required: true },
        { name: "email", max: 254, rule: "email", required: true },
        {
            name: "ministry",
            max: 60,
            rule: ["Ministry of Singers", "Intercession & Prayer", "Care & Fellowship", "I would appreciate guidance"],
            required: true,
        },
        { name: "journey", max: LONG, rule: "text", required: true },
        { name: "abilities", max: LONG, rule: "text", required: true },
        {
            name: "clarity",
            max: 80,
            rule: [
                "I know where I would like to serve",
                "I have a few ideas",
                "I would appreciate guidance",
                "I have not discovered my gifts yet",
            ],
        },
        { name: "commitmentsAccepted", max: 10, rule: "checkbox", required: true },
    ],
};
// which form accepts files, in which field, and how many
const FILE_FIELDS = {
    inquiry: null,
    invitation: { field: "letter", max: 1 },
    membership: { field: "documents", max: FILE_LIMITS.maxDocuments },
};
const EMAIL_RE = /^[^\s@<>"',;:()[\]\\]+@[^\s@<>"',;:()[\]\\]+\.[^\s@<>"',;:()[\]\\]{2,}$/;
// strips control characters (including line breaks) from single-line values
// eslint-disable-next-line no-control-regex -- intentionally strips hidden control characters
const oneLine = (v) => v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
// keeps line breaks in long text but removes other control characters
const multiLine = (v) => 
// eslint-disable-next-line no-control-regex -- intentionally strips hidden control characters
v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "").trim();
function validateField(spec, raw) {
    const isLong = spec.max >= LONG;
    const value = isLong ? multiLine(raw) : oneLine(raw);
    if (value === "") {
        if (spec.required)
            throw new ApiError(400, "invalid_input", `${spec.name} is required`);
        return "";
    }
    if (value.length > spec.max)
        throw new ApiError(400, "invalid_input", `${spec.name} is too long`);
    const bad = () => new ApiError(400, "invalid_input", `${spec.name} is invalid`);
    const rule = spec.rule;
    if (Array.isArray(rule)) {
        if (!rule.includes(value))
            throw bad();
    }
    else if (rule === "email") {
        if (!EMAIL_RE.test(value))
            throw bad();
    }
    else if (rule === "phone") {
        if (!/^[+\d][\d\s().-]{5,}$/.test(value))
            throw bad();
    }
    else if (rule === "age") {
        const n = Number(value);
        if (!/^\d{1,3}$/.test(value) || n < 16 || n > 120)
            throw bad();
    }
    else if (rule === "date") {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!m)
            throw bad();
        const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
        if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3])
            throw bad();
    }
    else if (rule === "checkbox") {
        if (value !== "on" && value !== "true")
            throw bad();
        return "yes";
    }
    return value;
}
function startsWith(buf, bytes, offset = 0) {
    return bytes.every((b, i) => buf[offset + i] === b);
}
// A file's real contents must match its extension, so an .exe renamed to
// .pdf is refused.
function matchesSignature(ext, buf) {
    switch (ext) {
        case "pdf":
            return buf.subarray(0, 1024).includes("%PDF-");
        case "png":
            return startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        case "jpg":
        case "jpeg":
            return startsWith(buf, [0xff, 0xd8, 0xff]);
        case "webp":
            return startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8);
        case "docx":
            return startsWith(buf, [0x50, 0x4b, 0x03, 0x04]); // a .docx is a ZIP container
        case "doc":
            return startsWith(buf, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
        default:
            return false;
    }
}
export function safeFilename(original, ext, taken) {
    let base = original.split(/[\\/]/).pop() ?? "";
    // eslint-disable-next-line no-control-regex -- intentionally strips hidden control characters
    base = base.replace(/[\u0000-\u001f\u007f<>:"|?*]/g, "").replace(/\s+/g, " ").trim();
    base = base.slice(0, base.length - (base.toLowerCase().endsWith(`.${ext}`) ? ext.length + 1 : 0));
    base = base.replace(/^\.+/, "").slice(0, 80).trim() || "attachment";
    let name = `${base}.${ext}`;
    for (let n = 2; taken.has(name.toLowerCase()); n++)
        name = `${base} (${n}).${ext}`;
    taken.add(name.toLowerCase());
    return name;
}
export async function parseSubmission(kind, form) {
    const raw = {};
    const files = [];
    for (const [key, value] of form.entries()) {
        if (typeof value === "string") {
            raw[key] = value;
        }
        else if (value.size === 0 && value.name === "") {
            continue; // an empty file input - the browser sends a blank part; not a real upload
        }
        else {
            const allowed = FILE_FIELDS[kind];
            if (!allowed || allowed.field !== key)
                throw new ApiError(400, "invalid_input", `unexpected file field "${key}"`);
            files.push(value);
        }
    }
    const fields = {};
    for (const spec of SPECS[kind]) {
        const v = validateField(spec, raw[spec.name] ?? "");
        if (v !== "")
            fields[spec.name] = v;
    }
    const lang = raw.language === "rw" ? "rw" : "en";
    const attachments = [];
    const limit = FILE_FIELDS[kind];
    if (files.length > 0 && limit) {
        if (files.length > limit.max)
            throw new ApiError(400, "invalid_file", "too many files");
        const taken = new Set();
        let total = 0;
        for (const file of files) {
            const ext = extensionOf(file.name);
            if (!ALLOWED_FILES[ext])
                throw new ApiError(400, "invalid_file", `type not allowed: ${file.name}`);
            if (file.size === 0)
                throw new ApiError(400, "invalid_file", `empty file: ${file.name}`);
            if (file.size > FILE_LIMITS.maxFileMB * MB)
                throw new ApiError(413, "too_large", `too big: ${file.name}`);
            total += file.size;
            if (total > FILE_LIMITS.maxTotalMB * MB)
                throw new ApiError(413, "too_large", "total size too big");
            const content = Buffer.from(await file.arrayBuffer());
            if (!matchesSignature(ext, content))
                throw new ApiError(400, "invalid_file", `contents do not match type: ${file.name}`);
            attachments.push({ filename: safeFilename(file.name, ext, taken), content });
        }
    }
    return { kind, lang, fields, attachments };
}
