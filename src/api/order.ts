import { apiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';

export interface Seat {
    id: string;
    status: string;
    seatNumber: string;
}

export interface Order {
    orderNumber: string;
    eventName: string;
    eventDate: Date;
    location: string;
    organizer: string;
    status: string;
    ticketType: string;
    ticketCount: number;
    totalPrice: number;
    paymentMethod: string;
    coverImage?: string;
    seats: Seat[];
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
}
export interface OrderListData {
    sort_by: string;
    order: string;
    results: Order[];
    pagination: Pagination;
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

export const getOrderList = async (page = 1, pageSize = 10) => {
    try {
        const res = await apiClient.get<ApiResponse<OrderListData>>(
            `v1/user/orders?page=${page}&page_size=${pageSize}`
        );
        const data = res.data.data;
        return data ? data : null;
    } catch (error) {
        console.error('Error fetching order list:', error);
        return null;
    }
};
