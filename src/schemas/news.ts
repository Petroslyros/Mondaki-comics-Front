import { z } from "zod";

export const newsPostSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    content: z.string(),
    imageUrl: z.string().nullable().optional(),
    isPublished: z.boolean(),
    sortOrder: z.number().int(),
    insertedAt: z.string(),
});

export const newsInsertSchema = z.object({
    title: z.string().min(1, { message: "Ο τίτλος είναι υποχρεωτικός" }),
    content: z.string().min(1, { message: "Το περιεχόμενο είναι υποχρεωτικό" }),
    isPublished: z.boolean(),
    sortOrder: z.number().int(),
});

export const newsUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    isPublished: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
});

export type NewsPost = z.infer<typeof newsPostSchema>;
export type NewsInsert = z.infer<typeof newsInsertSchema>;
export type NewsUpdate = z.infer<typeof newsUpdateSchema>;