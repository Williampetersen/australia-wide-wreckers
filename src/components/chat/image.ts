export type PreparedImage = { blob: Blob; mime: string; size: number; width?: number; height?: number; ext: string };

const MAX_EDGE = 1600;
const MAX_BYTES = 8 * 1024 * 1024;

function extFor(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/heic") return "heic";
  if (mime === "image/heif") return "heif";
  return "jpg";
}

/**
 * Shrinks a photo in the browser (max 1600px long edge, ~0.8 quality). If the browser cannot
 * decode it (for example HEIC outside Safari) the original is uploaded when it is 8 MB or less.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    if (!blob) throw new Error("encode failed");
    return { blob, mime: "image/jpeg", size: blob.size, width, height, ext: "jpg" };
  } catch {
    if (file.size > MAX_BYTES) throw new Error("That photo is too large (8 MB max).");
    const mime = file.type || "image/jpeg";
    if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(mime)) throw new Error("Please choose a JPG, PNG, WebP or HEIC photo.");
    return { blob: file, mime, size: file.size, ext: extFor(mime) };
  }
}
