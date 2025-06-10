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
    }
};

export default activityAPI;
