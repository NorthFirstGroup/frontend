import { transSnakeToCamel } from '@utils/transSnakeToCamel';
import { apiClient } from './client';

export type ActivityDetail = {
    id: number;
    name: string;
    category: string;
    coverImage: string;
    description: string;
    information: string;
};

export interface ActivityResp {
    totalCount: number;
    results: ActivityDetail[];
}

export interface ActivityShowtimeResp {
    totalCount: number;
    results: ActivityShowtime[];
}
export interface ActivityShowtime {
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
}

const activityAPI = {
    getActivityDetail: async (activityId: number): Promise<ActivityDetail> => {
        const response = await apiClient.get(`/v1/activity/${activityId}`);
        return transSnakeToCamel(response.data.data);
    },
    getActivityShowtime: async (activityId: number): Promise<ActivityShowtimeResp> => {
        const response = await apiClient.get(`/v1/activity/${activityId}/showtime`);
        return transSnakeToCamel(response.data.data);
    },
    getActivityShowtimeSeatMap: async (activityId: string, showtimeId: string) => {
        const response = await apiClient.get(`/v1/activity/${activityId}/showtime/${showtimeId}`);
        return transSnakeToCamel(response.data.data);
    }
};

export const getOrgActivityList = async (): Promise<ActivityDetail[]> => {
    try {
        const status = 2;
        const limit = 9999;
        const response = await apiClient.get(`/v1/organizer/activity?status=${status}&limit=${limit}`);
        const activityResp = response.data.data as ActivityResp;
        return transSnakeToCamel(activityResp.results);
    } catch (error) {
        console.error('Error fetching organizer activity list:', error);
        return [];
    }
};

export const getOrgShowtimeList = async (activityId: number): Promise<ActivityShowtime[]> => {
    try {
        const response = await apiClient.get(`/v1/organizer/activity/${activityId}/showtime`);
        return transSnakeToCamel(response.data.data);
    } catch (error) {
        console.error('Error fetching organizer showtime list:', error);
        return [];
    }
};

export default activityAPI;
