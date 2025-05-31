import { z } from 'zod';

export const GetProfileSchema = z.object({
    name: z.string(),
    phone_num: z.string(),
    birth_date: z.string().refine(date => date === '' || !isNaN(Date.parse(date))),
    location_ids: z.array(z.number().int()),
    profile_url: z.string().url().nullable() // 允許 null，但若非 null 要是 URL 格式
});

export const UpdateProfileSchema = z.object({
    status_code: z.number(),
    message: z.string()
});

export type GetProfileSchemaType = z.infer<typeof GetProfileSchema>;
export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;
