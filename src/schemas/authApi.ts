import { z } from 'zod';

const jwtRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;
export const SignInSchema = z.object({
    token: z.string().regex(jwtRegex),
    user: z.object({
        role: z.string(),
        name: z.string()
    })
});

export type LoginApiType = z.infer<typeof SignInSchema>;
