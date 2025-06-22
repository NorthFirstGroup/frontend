import { ApiResponse } from '@type/ApiResponse';
import { apiClient } from './client';
import { OrganizerApplySchema } from '../schemas/organizer';
import { transSnakeToCamel } from '@utils/transSnakeToCamel';
import { ActivityShowtime } from './activityAPI';
import { transCamelToSnake } from '@utils/transCamelToSnake';

export interface OrganizerApplyData {
    name: string;
    ubn: string;
    president: string;
    phone: string;
    address: string;
}
export type OrganizerActivityResp = ApiResponse<OrganizerActivityDetail>;
export type OrganizerActivityDetail = {
    id: number;
    name: string;
    organizerId: string;
    categoryId: number;
    status: number;
    description: string;
    information: string;
    startTime: string;
    endTime: string;
    salesStartTime: string;
    salesEndTime: string;
    coverImage: string;
    bannerImage: string;
    tags: string[] | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
};

export enum ActivityStatus {
    Draft = 1, // 未上架或草稿
    Published = 2, // 已上架
    OnGoing = 3, // 已開賣
    Cancel = 4, // 已取消
    Finish = 5 // 已結束
}

export interface ActivityCreate {
    name: string;
    categoryId: number;
    description: string;
    status: ActivityStatus;
    coverImage: string;
    bannerImage?: string | null;
    information: string;
    salesStartTime: string;
    salesEndTime: string;
    startTime: string;
    endTime: string;
    tags?: string[];
}

export type OrganizerActivityShowtime = {
    id: string;
    startTime: number;
    location: string;
    address: string;
    seats: {
        id: string;
        section: string;
        price: number;
        capacity: number;
        vacancy: number;
    }[];
};

export type ShowTimeCreate = {
    startAt: string;
    siteId: string;
};

export interface OrganizerActivitySite {
    id: string;
    activityId: number;
    areaId: number;
    name: string;
    address: string;
    seatingMapUrl: string;
    seatCapacity: number;
    prices: {
        price: number;
        section: string;
        capacity: number;
    }[];
    createdAt: string;
    updatedAt: string;
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

const organizerActivityAPI = {
    // activity
    getActivityDetail: async (activityId: number): Promise<OrganizerActivityDetail> => {
        const response = await apiClient.get(`/v1/organizer/activity/${activityId}`);
        return transSnakeToCamel(response.data.data);
    },
    createActivity: async (data: ActivityCreate): Promise<ActivityCreate & { id: number }> => {
        const response = await apiClient.post(`/v1/organizer/activity`, data);
        return transSnakeToCamel(response.data.data);
    },
    updateActivity: async (activityId: number, data: ActivityCreate): Promise<void> => {
        const response = await apiClient.put(`/v1/organizer/activity/${activityId}`, data);
        return transSnakeToCamel(response.data.data);
    },
    deleteActivity: async (activityId: number): Promise<void> => {
        await apiClient.delete(`/v1/organizer/activity/${activityId}`);
    },
    // activity showtime
    getActivityShowtimeList: async (activityId: number): Promise<ActivityShowtime[]> => {
        const response = await apiClient.get(`/v1/organizer/activity/${activityId}/showtime`);
        return transSnakeToCamel(response.data.data);
    },
    createActivityShowtime: async (activityId: number, data: ShowTimeCreate): Promise<OrganizerActivityShowtime> => {
        const payload = transCamelToSnake(data);
        const response = await apiClient.post(`/v1/organizer/activity/${activityId}/showtime`, payload);
        return transSnakeToCamel(response.data.data);
    },
    updateActivityShowtime: async (
        activityId: number,
        showtimeId: string,
        data: ShowTimeCreate
    ): Promise<OrganizerActivityShowtime> => {
        const payload = transCamelToSnake(data);
        const response = await apiClient.put(`/v1/organizer/activity/${activityId}/showtime/${showtimeId}`, payload);
        return transSnakeToCamel(response.data.data);
    },
    deleteActivityShowtime: async (activityId: number, showtimeId: string): Promise<void> => {
        await apiClient.delete(`/v1/organizer/activity/${activityId}/showtime/${showtimeId}`);
    },
    // activity Site
    getOrganizerSiteList: async (activityId: number): Promise<OrganizerActivitySite[]> => {
        const response = await apiClient.get(`/v1/organizer/activity/${activityId}/site`);
        return transSnakeToCamel(response.data.data);
    },
    createOrganizerSite: async (activityId: number, data: any): Promise<OrganizerActivitySite> => {
        const response = await apiClient.post(`/v1/organizer/activity/${activityId}/site`, data);
        return transSnakeToCamel(response.data.data);
    },
    updateOrganizerSite: async (activityId: number, siteId: string, data: any): Promise<OrganizerActivitySite> => {
        const response = await apiClient.put(`/v1/organizer/activity/${activityId}/site${siteId}`, data);
        return transSnakeToCamel(response.data.data);
    },
    deleteOrganizerSite: async (activityId: number, siteId: string): Promise<void> => {
        await apiClient.delete(`/v1/organizer/activity/${activityId}/site/${siteId}`);
    }
};
export default organizerActivityAPI;
