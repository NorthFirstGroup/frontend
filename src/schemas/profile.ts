import { z } from 'zod';

export const GetProfileSchema = z.object({
    name: z.string(),
    phone_num: z.string(),
    birth_date: z.string().refine(date => date === '' || !isNaN(Date.parse(date))),
    location_ids: z.array(z.number().int()),
    profile_url: z.string().url().or(z.literal(''))
});

export const UpdateProfileSchema = z.object({
    status_code: z.number(),
    message: z.string()
});

export type GetProfileSchemaType = z.infer<typeof GetProfileSchema>;
export type UpdateProfileSchemaType = z.infer<typeof UpdateProfileSchema>;
