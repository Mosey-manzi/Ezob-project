export const FILE_LIMITS = {
  maxFileMB: 4, 
  maxTotalMB: 4, 
  maxDocuments: 5, 
};

// extension -> MIME types browsers may report for it
export const ALLOWED_FILES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  webp: ["image/webp"],
};

export const ACCEPT_ATTR = Object.keys(ALLOWED_FILES)
  .map((ext) => `.${ext}`)
  .join(",");

export const MB = 1024 * 1024;

export type FileProblemCode = "type" | "size" | "empty" | "duplicate" | "count" | "total";
export type FileProblem = { code: FileProblemCode; name: string };
export type FileLike = { name: string; size: number; type: string; lastModified?: number };

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot < 0 ? "" : name.slice(dot + 1).toLowerCase();
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}

// Decides which of the newly picked files can be added. Every rejected file is
// reported in `problems` - nothing is ever dropped silently.
export function validateFiles<T extends FileLike>(
  existing: T[],
  incoming: T[],
  opts: { maxFiles: number },
): { accepted: T[]; problems: FileProblem[] } {
  const maxFile = FILE_LIMITS.maxFileMB * MB;
  const maxTotal = FILE_LIMITS.maxTotalMB * MB;
  const running = [...existing];
  const accepted: T[] = [];
  const problems: FileProblem[] = [];
  let total = running.reduce((sum, f) => sum + f.size, 0);

  for (const file of incoming) {
    const reject = (code: FileProblemCode) => problems.push({ code, name: file.name });
    const mimes = ALLOWED_FILES[extensionOf(file.name)];
    const typeOk =
      !!mimes && (file.type === "" || file.type === "application/octet-stream" || mimes.includes(file.type));

    if (!typeOk) reject("type");
    else if (file.size === 0) reject("empty");
    else if (file.size > maxFile) reject("size");
    else if (
      running.some(
        (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified,
      )
    )
      reject("duplicate");
    else if (running.length >= opts.maxFiles) reject("count");
    else if (total + file.size > maxTotal) reject("total");
    else {
      running.push(file);
      accepted.push(file);
      total += file.size;
    }
  }
  return { accepted, problems };
}
