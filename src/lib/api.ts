// Sends the three public forms to the Ezob server (which talks to Resend).
// The browser never sees the Resend API key - it only calls /api/*.

export type FormKind = "apply" | "contact" | "invite";

export type SubmitErrorCode =
  | "network" // server unreachable / no internet
  | "timeout" // took too long
  | "too_large" // files exceed the size limit
  | "invalid_file" // file type not allowed
  | "invalid_input" // required data missing or malformed
  | "rate_limited" // too many submissions from one connection
  | "server"; // anything else

export class SubmitError extends Error {
  code: SubmitErrorCode;
  constructor(code: SubmitErrorCode) {
    super(code);
    this.code = code;
  }
}

const ENDPOINTS: Record<FormKind, string> = {
  apply: "/api/membership",
  contact: "/api/inquiry",
  invite: "/api/invitation",
};

const KNOWN_CODES: SubmitErrorCode[] = [
  "too_large",
  "invalid_file",
  "invalid_input",
  "rate_limited",
  "server",
];

export async function submitForm(
  kind: FormKind,
  data: FormData,
): Promise<{ reference?: string }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(ENDPOINTS[kind], {
      method: "POST",
      body: data, // multipart/form-data, files included
      signal: controller.signal,
    });

    let body: { ok?: boolean; error?: string; reference?: string } = {};
    try {
      body = await res.json();
    } catch {
      /* non-JSON response */
    }

    if (!res.ok || !body.ok) {
      const code = KNOWN_CODES.find((c) => c === body.error) ?? "server";
      throw new SubmitError(res.status === 413 ? "too_large" : code);
    }
    return { reference: body.reference };
  } catch (err) {
    if (err instanceof SubmitError) throw err;
    if (err instanceof DOMException && err.name === "AbortError")
      throw new SubmitError("timeout");
    throw new SubmitError("network");
  } finally {
    window.clearTimeout(timer);
  }
}
