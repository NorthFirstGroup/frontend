import { z } from 'zod';

export const UploadSchema = z.object({
    data: z.object({
        url: z.string()
    })
});

export type UploadSchemaType = z.infer<typeof UploadSchema>;
