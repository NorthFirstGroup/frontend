import { publicApiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';
import { GetFrontpageResponseData, GetTopBannerResponseData } from '../schemas/frontpage';
import { BannerSlide, FrontpageActivity } from '../types/home';

export const getTopBannerActivities = async (): Promise<ApiResponse<BannerSlide[]>> => {
    const res = await publicApiClient.get<ApiResponse<BannerSlide[]>>('/v1/frontpage/top');
    const parsed = GetTopBannerResponseData.safeParse(res.data.data);
    if (!parsed.success) {
        console.error('GET - /v1/frontpage/top 驗證錯誤', parsed.error.format());
        return {
            ...res.data, // Keep original status/message
            data: []
        };
    }

    return {
        ...res.data,
        data: parsed.data.results
    };
};

export const getHotTopicActivities = async (): Promise<ApiResponse<FrontpageActivity[]>> => {
    const res = await publicApiClient.get<ApiResponse<FrontpageActivity[]>>('/v1/frontpage/hot-topics');
    const parsed = GetFrontpageResponseData.safeParse(res.data.data);
    if (!parsed.success) {
        console.error('GET - /v1/frontpage/hot-topics 驗證錯誤', parsed.error.format());
        return {
            ...res.data, // Keep original status/message
            data: []
        };
    }

    return {
        ...res.data,
        data: parsed.data.results
    };
};

export const getLowStockActivities = async (): Promise<ApiResponse<FrontpageActivity[]>> => {
    const res = await publicApiClient.get<ApiResponse<FrontpageActivity[]>>('/v1/frontpage/low-stock');
    const parsed = GetFrontpageResponseData.safeParse(res.data.data);
    if (!parsed.success) {
        console.error('GET - /v1/frontpage/low-stock 驗證錯誤', parsed.error.format());
        return {
            ...res.data, // Keep original status/message
            data: []
        };
    }

    return {
        ...res.data,
        data: parsed.data.results
    };
};

export const getCountdownActivities = async (): Promise<ApiResponse<FrontpageActivity[]>> => {
    const res = await publicApiClient.get<ApiResponse<FrontpageActivity[]>>('/v1/frontpage/coming-soon');
    const parsed = GetFrontpageResponseData.safeParse(res.data.data);
    if (!parsed.success) {
        console.error('GET - /v1/frontpage/coming-soon 驗證錯誤', parsed.error.format());
        return {
            ...res.data, // Keep original status/message
            data: []
        };
    }

    return {
        ...res.data,
        data: parsed.data.results
    };
};
