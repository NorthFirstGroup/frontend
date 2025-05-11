import { publicApiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';

// 定義地區選項介面
export interface Area {
    id: number;
    name: string;
}

export interface AreaResponseData {
    results: Area[];
}

export const availAreas = async (): Promise<ApiResponse<AreaResponseData>> => {
    const res = await publicApiClient.get<ApiResponse<AreaResponseData>>('/v1/admin/areas');
    return res.data || {};
};
