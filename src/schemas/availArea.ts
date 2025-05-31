import { z } from 'zod';

export const GetAvailAreas = z.object({
    results: z.array(
        z.object({
            id: z.number(),
            name: z.string()
        })
    )
});

export type GetAvailAreasType = z.infer<typeof GetAvailAreas>;
