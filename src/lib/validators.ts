import { z } from "zod";

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9_]{3,30}$/,
    "Handle must be 3–30 characters: lowercase letters, numbers, underscores only",
  );

export const createProfileSchema = z.object({
  handle: handleSchema,
  display_name: z.string().trim().max(100).optional(),
});

export const createBookmarkSchema = z.object({
  title: z.string().trim().min(1).max(200),
  url: z.string().trim().url().regex(/^https?:\/\//),
  is_public: z.boolean().default(false),
});

export const updateBookmarkSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  url: z.string().trim().url().regex(/^https?:\/\//).optional(),
  is_public: z.boolean().optional(),
});
