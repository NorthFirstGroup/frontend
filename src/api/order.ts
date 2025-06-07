import { apiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';

export interface Seat {
    status: string;
    seatNumber: string;
}

export interface Order {
    orderNumber: string;
    eventName: string;
    eventDate: Date;
    location: string;
    organizer: string;
    ticketType: string;
    ticketCount: number;
    totalPrice: number;
    paymentMethod: string;
    seats: Seat[];
}

export const getOrderByNumber = async (orderNumber: string | undefined): Promise<Order | null> => {
    if (!orderNumber) return null;
    try {
        const res = await apiClient.get<ApiResponse<Order>>(`v1/user/order/${orderNumber}`);
        const order = res.data.data;
        return order ? order : null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};
