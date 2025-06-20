import { apiClient } from './client';
import { ApiResponse } from '@type/ApiResponse';
import { transSnakeToCamel } from '@utils/transSnakeToCamel';

export interface Ticket {
    id: string;
    activityName: string;
    showtimeId: string;
    startTime: Date;
    location: string;
    address: string;
    organizerName: string;
    section: string;
    useState: boolean;
}

export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
    if (!ticketId) return null;
    try {
        const res = await apiClient.get<ApiResponse<Ticket>>(`v1/organizer/ticket/${ticketId}`);
        const ticket = transSnakeToCamel(res.data.data);
        return ticket ? ticket : null;
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return null;
    }
};

// TODO: backend API should also check if the ticket is used or not
export const putTicketById = async (ticketId: string) => {
    if (!ticketId) return false;
    try {
        const res = await apiClient.put<ApiResponse<Ticket>>(`v1/organizer/ticket/${ticketId}`);
        const statusCode = res.data.status_code;
        return statusCode === 2000;
    } catch (error) {
        console.error('Error updating ticket:', error);
        return false;
    }
};
