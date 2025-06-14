import { ApiResponse } from '../types/ApiResponse';
import { apiClient } from './client';
import { OrganizerApplySchema } from '../schemas/organizer';

export interface OrganizerApplyData {
    name: string;
    ubn: string;
    president: string;
    phone: string;
    address: string;
}

/**
 * 取得會員資料
 */
export const getOrganizerData = async (): Promise<ApiResponse<OrganizerApplyData>> => {
    const res = await apiClient.get<ApiResponse<OrganizerApplyData>>('/v1/user/apply-as-organizer');
    const parsed = OrganizerApplySchema.safeParse(res.data.data);
    if (!parsed.success) console.error('GET - /v1/user/apply-as-organizer 驗證錯誤', parsed.error.format());
    return {
        ...res.data,
        data: parsed.data
    };
};

export const setOrganizerData = async (updatedData: OrganizerApplyData): Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.post<ApiResponse<null>>('/v1/user/apply-as-organizer', {
            ...updatedData
        });

        if (response.data) {
            return {
                status_code: response.data.status_code,
                message: response.data.message,
                data: null
            };
        } else {
            console.error('POST - /v1/user/apply-as-organizer 錯誤');
            return {
                status_code: 500,
                message: 'Internal client error: Empty response data from server.',
                data: null
            };
        }
    } catch (error) {
        console.error('Error setOrganizerData:', error);
        throw new Error('Failed to set organizer data');
    }
};
