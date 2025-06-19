import { ApiResponse } from '../types/ApiResponse';
import { apiClient } from './client';
import { OrganizerApplySchema } from '../schemas/organizer';
import { ActivityCategory } from '../types/home';

export interface OrganizerData {
    name: string;
    ubn: string;
    president: string;
    phone: string;
    address: string;
}

export const activityStatusMap = ['', '未上架或草稿', '已上架', '取消', '結束'];

export interface organizerSearchParams {
    name?: string;
    status?: number;
    category?: number;
    limit?: number;
    offset?: number;
}

export interface OrganizerActivitieCategory {
    id: number;
    name: ActivityCategory;
    media: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
}

export interface OrganizerOneActivityData {
    id: number;
    name: string;
    organizer_id: number;
    category_id: number;
    status: number;
    description: string;
    information: string;
    start_time: string;
    end_time: string;
    sales_start_time: string;
    sales_end_time: string;
    cover_image: string;
    banner_image: string;
    tags: number[];
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    category: OrganizerActivitieCategory;
}

export interface OrganizerActivities {
    total_count: number;
    results: OrganizerOneActivityData[];
}
/**
 * 取得會員資料
 */
export const getOrganizerData = async (): Promise<ApiResponse<OrganizerData>> => {
    const res = await apiClient.get<ApiResponse<OrganizerData>>('/v1/organizer/profile');
    console.log('GET - /v1/organizer/profile', res.data);
    const parsed = OrganizerApplySchema.safeParse(res.data.data);
    if (!parsed.success) console.error('GET - /v1/organizer/profile 驗證錯誤', parsed.error.format());
    return {
        ...res.data,
        data: parsed.data
    };
};

export const applyAsOrganizer = async (updatedData: OrganizerData): Promise<ApiResponse<null>> => {
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
        console.error('Error applyAsOrganizer:', error);
        throw new Error('Failed to apply as organizer');
    }
};

export const putOrganizerData = async (updatedData: OrganizerData): Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.put<ApiResponse<null>>('/v1/organizer/profile', {
            ...updatedData
        });

        if (response.data) {
            return {
                status_code: response.data.status_code,
                message: response.data.message,
                data: null
            };
        } else {
            console.error('PUT - /v1/organizer/profile 錯誤');
            return {
                status_code: 500,
                message: 'Internal client error: Empty response data from server.',
                data: null
            };
        }
    } catch (error) {
        console.error('Error update organizer data:', error);
        throw new Error('Failed to update organizer data');
    }
};

//取得該廠商活動清單(含搜尋)
export const getOrganizerActivities = async (
    get_params: organizerSearchParams
): Promise<ApiResponse<OrganizerActivities>> => {
    try {
        const response = await apiClient.get<ApiResponse<OrganizerActivities>>('/v1/organizer/activity', {
            params: get_params
        });

        if (response.data) {
            return {
                status_code: response.data.status_code,
                message: response.data.message,
                data: response.data?.data
            };
        } else {
            console.error('POST - /v1/organizer/activity 錯誤');
            return {
                status_code: 500,
                message: 'Internal client error: Empty response data from server.',
                data: {
                    total_count: 0,
                    results: []
                }
            };
        }
    } catch (error) {
        console.error('Error getOrganizerActivities:', error);
        throw new Error('Failed to get organizer activities');
    }
};

//該廠商刪除活動
export const deleteOrganizerActivities = async (activityId: number): Promise<ApiResponse<null>> => {
    try {
        const response = await apiClient.delete<ApiResponse<null>>(`/v1/organizer/activity/${activityId}`);

        if (response.data) {
            return {
                status_code: response.data.status_code,
                message: response.data.message
            };
        } else {
            console.error(`DELETE - /v1/organizer/activity/${activityId} 錯誤`);
            return {
                status_code: 500,
                message: 'Internal client error: Empty response data from server.'
            };
        }
    } catch (error) {
        console.error('Error getOrganizerActivities:', error);
        throw new Error('Failed to get organizer activities');
    }
};
