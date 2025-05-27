import { publicApiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';
import { GetAvailAreas } from '../schemas/availArea';

// 定義地區選項介面
export interface Area {
    id: number;
    name: string;
}

export interface AreaResponseData {
    results: Area[];
}

export const getAvailAreas = async (): Promise<ApiResponse<AreaResponseData>> => {
    const res = await publicApiClient.get<ApiResponse<AreaResponseData>>('/v1/admin/areas');
    const parsed = GetAvailAreas.safeParse(res.data.data);
    if (!parsed.success) console.error('GET - /v1/admin/areas 驗證錯誤', parsed.error.format());

    return {
        ...res.data,
        data: parsed.data
    };
};
