import { z } from "zod";

const httpUrl = z.string().url().refine(
  (value) => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  },
  { message: "URL must use HTTP or HTTPS" },
);

/** Cover: empty | http(s) URL | compressed data:image (client upload). */
const optionalNewsImage = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "")
  .refine(
    (value) => {
      if (!value) return true;
      if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value)) {
        return value.length <= 2_000_000;
      }
      try {
        const protocol = new URL(value).protocol;
        return protocol === "https:" || protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: "Gambar harus URL HTTP(S) atau unggahan gambar (max ~1.5MB terkompres)" },
  );

const optionalHttpUrl = z.union([httpUrl, z.literal("")]).optional();
const requiredText = z.string().trim().min(1, "Required");

/** Quill often submits <p><br></p> for empty — treat as empty string. */
const newsContent = z
  .string()
  .transform((value) => {
    const plain = value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    return plain ? value.trim() : "";
  })
  .pipe(requiredText);

export const newsSchema = z.object({
  title: requiredText,
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  excerpt: requiredText,
  content: newsContent,
  image_url: optionalNewsImage,
  template: z.enum(["standard", "hero-overlay", "minimalist"]),
}).strict();

export const serviceSchema = z.object({
  nama_poli: requiredText,
  deskripsi: requiredText,
  icon: z.string().trim().max(100).optional(),
}).strict();

export const scheduleSchema = z.object({
  nama_dokter: requiredText,
  poli: requiredText,
  hari: z.array(requiredText).min(1),
  jam_mulai: requiredText,
  jam_selesai: requiredText,
}).strict();

export const settingsSchema = z.object({
  site_name: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  address: z.string().trim().min(1).optional(),
  instagram: optionalHttpUrl,
  facebook: optionalHttpUrl,
  hero_title: z.string().trim().min(1).optional(),
  hero_subtitle: z.string().trim().min(1).optional(),
}).strict();

const userIdSchema = z.string().trim().uuid();
const userDetailsSchema = z.object({
  name: requiredText,
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  role: z.enum(["admin", "superadmin"]),
}).strict();

export const userSchema = userDetailsSchema.extend({
  password: z.string().min(8),
}).strict();

export const userUpdateSchema = userDetailsSchema;
export const userIdParamSchema = z.object({ id: userIdSchema }).strict();

export const passwordResetSchema = z.object({
  id: userIdSchema,
  password: z.string().min(8),
}).strict();

export function formatFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    fieldErrors[field] ??= issue.message;
  }

  return fieldErrors;
}
