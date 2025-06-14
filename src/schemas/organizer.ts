import { z } from 'zod';

export const OrganizerApplySchema = z.object({
    name: z.string(),
    ubn: z.string(),
    president: z.string(),
    phone: z.string(),
    address: z.string()
});
