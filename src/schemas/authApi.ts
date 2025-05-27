import { z } from 'zod';

// jwtRegex 正規表達式
const jwtRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;
export const SignInSchema = z.object({
    token: z.string().regex(jwtRegex),
    user: z.object({
        role: z.string(),
        name: z.string()
    })
});

export const SignUpSchema = z.object({
    token: z.string().regex(jwtRegex),
    user: z.object({
        role: z.string(),
        name: z.string()
    })
});

export type LoginApiType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
