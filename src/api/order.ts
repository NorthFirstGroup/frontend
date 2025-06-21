import { apiClient } from './client';
import { ApiResponse } from '@type/ApiResponse';

export interface Seat {
    id: string;
    status: string;
    seatNumber: string;
}

export interface OrderPayload {
    activity_id: number;
    showtime_id: string;
    tickets: {
        zone: string;
        price: number;
        quantity: number;
    }[];
}

export interface OrderResponse {
    order_number: number;
}

export interface Order {
    orderNumber: string;
    eventName: string;
    eventDate: string;
    location: string;
    organizer: string;
    status: string;
    ticketType: string;
    ticketCount: number;
    totalPrice: number;
    paymentMethod: string;
    paymentStatus: string;
    coverImage?: string;
    seats: Seat[];
    paymentFormUrl: string;
}

export interface OrderRecords {
    orderNumber: string;
    createdAt: string;
    eventName: string;
    eventDate: string;
    location: string;
    organizer: string;
    status: string;
    ticketType: string;
    ticketCount: number;
    totalPrice: number;
    coverImage?: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate?: string;
    seats: Seat[];
    paymentFormUrl: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
}
export interface OrderListData {
    sort_by: string;
    order: string;
    results: OrderRecords[];
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

export const postOrder = async (order: OrderPayload) => {
    try {
        const res = await apiClient.post<ApiResponse<OrderResponse>>(`v1/user/order`, order);
        const data = res.data;
        if (data.status_code !== 2000) {
            console.error('POST - /v1/user/order 錯誤:', data.message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.error('postOrder Error:', error);
        return null;
    }
};
