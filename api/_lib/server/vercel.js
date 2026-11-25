import { createApiMiddleware } from "./api.js";
export default createApiMiddleware({
    resendApiKey: process.env.RESEND_API_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
    fromEmail: process.env.FROM_EMAIL,
    logoUrl: process.env.EMAIL_LOGO_URL || undefined,
    rateLimitMax: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : undefined,
    resendApiUrl: process.env.RESEND_API_URL || undefined, // only set by automated tests
    allowPreview: false, // Vercel's disk is read-only: without a real key, fail loudly instead
    trustProxy: true,
});
