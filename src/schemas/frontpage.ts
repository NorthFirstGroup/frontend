import { z } from 'zod';

export const GetActivityCategorySchema = z.enum([
    '熱門',
    '音樂',
    '戲劇',
    '展覽',
    '電影',
    '運動',
    '親子',
    '舞蹈',
    '演唱會',
    '戶外'
]);

// (Optional) You can also infer the TypeScript type from the Zod schema
export type GetActivityCategory = z.infer<typeof GetActivityCategorySchema>;

export const GetFrontpageActivity = z.object({
    id: z.number(),
    name: z.string(),
    cover_image: z.string(),
    category: GetActivityCategorySchema,
    start_time: z.string().datetime().optional(),
    end_time: z.string().datetime().optional(),
    sales_start_time: z.string().datetime().optional(),
    vacancy: z.number().nullable().optional()
});

export const GetFrontpageResponseData = z.object({
    results: z.array(GetFrontpageActivity)
});

export type FrontpageActivityType = z.infer<typeof GetFrontpageActivity>;
export type GetFrontpageResponseDataType = z.infer<typeof GetFrontpageResponseData>;

export const GetTopBannerActivity = z.object({
    id: z.number(),
    name: z.string(),
    cover_image: z.string()
});

// This schema represents the 'data' field inside your ApiResponse
export const GetTopBannerResponseData = z.object({
    results: z.array(GetTopBannerActivity)
});

export type GetTopBannerActivityType = z.infer<typeof GetTopBannerActivity>;
export type GetTopBannerResponseDataType = z.infer<typeof GetTopBannerResponseData>;
