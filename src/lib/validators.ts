import { z } from "zod";

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_]{3,30}$/,
    "Handle must be 3–30 characters using lowercase letters, numbers, and underscores only.",
  );

export const createProfileSchema = z.object({
  handle: handleSchema,
  display_name: z
    .string()
    .trim()
    .max(100, "Display name must be 100 characters or less.")
    .optional(),
});

export const createBookmarkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or less."),
  url: z
    .string()
    .trim()
    .min(1, "URL is required.")
    .url("Enter a valid URL (e.g. https://example.com).")
    .regex(/^https?:\/\//, "URL must start with http:// or https://."),
  is_public: z.boolean().default(false),
});

export const updateBookmarkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or less.")
    .optional(),
  url: z
    .string()
    .trim()
    .min(1, "URL is required.")
    .url("Enter a valid URL (e.g. https://example.com).")
    .regex(/^https?:\/\//, "URL must start with http:// or https://.")
    .optional(),
  is_public: z.boolean().optional(),
});

export const formatZodError = (error: z.ZodError): string =>
  error.issues[0]?.message ?? "Please check your input and try again.";
