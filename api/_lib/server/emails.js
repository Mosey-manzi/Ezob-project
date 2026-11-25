// Admin-facing emails for the three forms. Always written in English so the
// administration team reads them consistently; the applicant's language is
// shown in the footer.
import { formatSize } from "../src/lib/fileRules.js";
// Ezob palette (taken from the website)
const C = {
    forest: "#183229",
    deep: "#20332c",
    gold: "#dcae67",
    goldLight: "#e4bd76",
    brown: "#96734a",
    cream: "#f1ede2",
    paper: "#faf9f5",
    line: "#e5e1d7",
    muted: "#6c7972",
};
const COMMITMENTS = "Christian discipline, Sunday rehearsal at 5:00 PM, prayer gatherings, care for fellow members, " +
    "monthly giving of 1,500 RWF, local church fellowship, and respect for ministry leadership.";
export function esc(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
// eslint-disable-next-line no-control-regex -- intentionally strips hidden control characters
const oneLine = (v) => v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
const cut = (v, n) => (v.length > n ? `${v.slice(0, n - 1)}…` : v);
function prettyDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}
function attachmentLines(sub) {
    return sub.attachments.map((a) => `${a.filename} (${formatSize(a.content.length)})`);
}
function buildDoc(sub) {
    const f = sub.fields;
    if (sub.kind === "inquiry") {
        return {
            badge: "New general inquiry",
            title: f.subject,
            subtitle: `From ${f.name}`,
            sections: [
                {
                    heading: "Sender",
                    rows: [
                        { label: "Name", value: f.name },
                        { label: "Email", value: f.email },
                    ],
                },
                { heading: "Message", rows: [{ label: "Subject", value: f.subject }, { label: "Message", value: f.message }] },
            ],
            attachmentsHeading: "",
            attachments: [],
            emptyAttachments: "",
        };
    }
    if (sub.kind === "invitation") {
        return {
            badge: "New official invitation",
            title: f.eventName,
            subtitle: `From ${f.organization}`,
            sections: [
                {
                    heading: "Church or organization",
                    rows: [
                        { label: "Church or organization", value: f.organization },
                        { label: "Contact person", value: f.contactName },
                        { label: "Email", value: f.email },
                        { label: "Phone", value: f.phone },
                    ],
                },
                {
                    heading: "The event",
                    rows: [
                        { label: "Event name", value: f.eventName },
                        { label: "Proposed date", value: prettyDate(f.proposedDate) },
                        { label: "Location", value: f.eventLocation },
                        { label: "Description", value: f.eventDescription },
                    ],
                },
            ],
            attachmentsHeading: "Invitation letter",
            attachments: attachmentLines(sub),
            emptyAttachments: "No invitation letter was attached.",
        };
    }
    return {
        badge: "New membership application",
        title: f.fullName,
        subtitle: `Applying to: ${f.ministry}`,
        sections: [
            {
                heading: "01 · Personal information",
                rows: [
                    { label: "Full names", value: f.fullName },
                    { label: "Age", value: f.age },
                    { label: "Gender", value: f.gender },
                    { label: "Marital status", value: f.maritalStatus },
                    { label: "Residence", value: f.residence },
                    { label: "Church currently attending", value: f.church },
                    { label: "Email", value: f.email },
                    { label: "Ministry of interest", value: f.ministry },
                ],
            },
            {
                heading: "02 · Journey and gifts",
                rows: [
                    { label: "Spiritual journey", value: f.journey },
                    { label: "Abilities, talents or interests to develop", value: f.abilities },
                    ...(f.clarity ? [{ label: "Clarity about where to serve", value: f.clarity }] : []),
                ],
            },
            {
                heading: "03 · Membership commitments",
                rows: [
                    {
                        label: "Commitments",
                        value: `ACCEPTED. The applicant confirmed they have read and accept the membership commitments (${COMMITMENTS}) and understands this does not automatically mean acceptance into the ministry.`,
                    },
                ],
            },
        ],
        attachmentsHeading: "Supporting documents",
        attachments: attachmentLines(sub),
        emptyAttachments: "No supporting documents were attached.",
    };
}
export function emailSubject(sub) {
    const f = sub.fields;
    const raw = sub.kind === "membership"
        ? `[Membership Application] ${f.fullName} · ${f.ministry}`
        : sub.kind === "invitation"
            ? `[Official Invitation] ${f.eventName} — ${f.organization}`
            : `[General Inquiry] ${f.subject} — ${f.name}`;
    return cut(oneLine(raw), 170);
}
function footerLines(sub, meta) {
    const when = meta.receivedAt.toLocaleString("en-GB", {
        timeZone: "Africa/Kigali",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    return [
        `Reference: ${meta.reference}`,
        `Received: ${when} (Kigali time)`,
        `Website language used: ${sub.lang === "rw" ? "Kinyarwanda" : "English"}`,
    ];
}
const multiline = (v) => esc(v).replace(/\n/g, "<br>");
export function renderHtml(sub, meta) {
    const doc = buildDoc(sub);
    const email = sub.fields.email;
    const sectionsHtml = doc.sections
        .map((s) => `
      <tr><td style="padding:26px 32px 4px;">
        <div style="font:700 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${C.brown};padding-bottom:8px;border-bottom:2px solid ${C.gold};">${esc(s.heading)}</div>
      </td></tr>
      <tr><td style="padding:0 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${s.rows
        .map((r) => `
          <tr><td style="padding:12px 0;border-bottom:1px solid ${C.line};">
            <div style="font:700 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${C.muted};">${esc(r.label)}</div>
            <div style="font:400 15px/1.65 Arial,Helvetica,sans-serif;color:${C.deep};padding-top:3px;">${r.label === "Email"
        ? `<a href="mailto:${esc(r.value)}" style="color:${C.deep};">${esc(r.value)}</a>`
        : multiline(r.value)}</div>
          </td></tr>`)
        .join("")}
        </table>
      </td></tr>`)
        .join("");
    const attachmentsHtml = doc.attachmentsHeading
        ? `
      <tr><td style="padding:26px 32px 4px;">
        <div style="font:700 12px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${C.brown};padding-bottom:8px;border-bottom:2px solid ${C.gold};">${esc(doc.attachmentsHeading)}${doc.attachments.length ? ` (${doc.attachments.length})` : ""}</div>
      </td></tr>
      <tr><td style="padding:12px 32px 0;font:400 15px/1.8 Arial,Helvetica,sans-serif;color:${C.deep};">
        ${doc.attachments.length
            ? doc.attachments.map((a) => `📎&nbsp;${esc(a)}`).join("<br>") +
                `<div style="font:400 12px/1.5 Arial,Helvetica,sans-serif;color:${C.muted};padding-top:6px;">The file${doc.attachments.length > 1 ? "s are" : " is"} attached to this email.</div>`
            : `<span style="color:${C.muted};">${esc(doc.emptyAttachments)}</span>`}
      </td></tr>`
        : "";
    const logo = meta.logoUrl
        ? `<img src="${esc(meta.logoUrl)}" alt="" height="44" style="display:block;height:44px;width:auto;border:0;margin:0 0 12px;">`
        : "";
    return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(emailSubject(sub))}</title></head>
<body style="margin:0;padding:0;background:${C.cream};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(doc.badge)}: ${esc(doc.title)} — ${esc(doc.subtitle)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.cream};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:${C.paper};border:1px solid ${C.line};border-radius:16px;overflow:hidden;">
    <tr><td style="background:${C.forest};padding:28px 32px;">
      ${logo}
      <div style="font:600 22px/1.2 Georgia,'Times New Roman',serif;color:#ffffff;">Ezob Worship Ministry</div>
      <div style="font:700 10px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.25em;text-transform:uppercase;color:${C.goldLight};padding-top:6px;">Love · Serve · Worship</div>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <span style="display:inline-block;background:${C.gold};color:${C.deep};font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border-radius:999px;">${esc(doc.badge)}</span>
      <div style="font:500 28px/1.2 Georgia,'Times New Roman',serif;color:${C.deep};padding-top:16px;">${esc(doc.title)}</div>
      <div style="font:400 15px/1.5 Arial,Helvetica,sans-serif;color:${C.muted};padding-top:6px;">${esc(doc.subtitle)}</div>
    </td></tr>
    ${sectionsHtml}
    ${attachmentsHtml}
    <tr><td style="padding:30px 32px 32px;">
      <div style="background:#f0ece1;border-radius:12px;padding:16px 18px;font:400 12px/1.7 Arial,Helvetica,sans-serif;color:#65736c;">
        ${footerLines(sub, meta).map(esc).join("<br>")}<br>
        <strong>Reply to this email to answer ${esc(sub.kind === "membership" ? sub.fields.fullName : sub.kind === "invitation" ? sub.fields.contactName : sub.fields.name)} directly</strong> (${esc(email)}).
      </div>
      <div style="font:400 11px/1.6 Arial,Helvetica,sans-serif;color:#87918c;padding-top:14px;text-align:center;">Sent automatically from the Ezob website · The Worship Family · Kigali, Rwanda</div>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
export function renderText(sub, meta) {
    const doc = buildDoc(sub);
    const lines = [doc.badge.toUpperCase(), doc.title, doc.subtitle, ""];
    for (const s of doc.sections) {
        lines.push(`== ${s.heading} ==`);
        for (const r of s.rows)
            lines.push(`${r.label}: ${r.value}`);
        lines.push("");
    }
    if (doc.attachmentsHeading) {
        lines.push(`== ${doc.attachmentsHeading} ==`);
        lines.push(...(doc.attachments.length ? doc.attachments.map((a) => `- ${a}`) : [doc.emptyAttachments]));
        lines.push("");
    }
    lines.push(...footerLines(sub, meta), "Reply to this email to respond directly to the sender.");
    return lines.join("\n");
}
export function buildEmail(sub, meta) {
    return { subject: emailSubject(sub), html: renderHtml(sub, meta), text: renderText(sub, meta) };
}
