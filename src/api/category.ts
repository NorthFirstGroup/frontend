import { publicApiClient } from './client';
import { ApiResponse } from '../types/ApiResponse';

// 定義地區選項介面
export interface Category {
    id: number;
    name: string;
    media: string;
}

export interface CategoryResponseData {
    total_count: number;
    results: Category[];
}

// default value
export const Categories = [
    {
        id: 1,
        name: '熱門',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/0f001215-e086-41a3-b8b2-d07f45461162.png'
    },
    {
        id: 2,
        name: '音樂',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/735e085a-d926-4ceb-a463-d582fa8897a6.png'
    },
    {
        id: 3,
        name: '戲劇',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/9f88a0a7-4899-47aa-b272-0e6c249d5705.png'
    },
    {
        id: 4,
        name: '展覽',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/6f85fc18-d7b1-4bd3-bc52-291ff6e348c5.png'
    },
    {
        id: 5,
        name: '電影',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/e15c214f-2d34-4e2a-8e5a-3cea2497c7c8.png'
    },
    {
        id: 6,
        name: '運動',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/e84728d2-521a-4f2d-b189-4435fb0d9fca.png'
    },
    {
        id: 7,
        name: '親子',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/9fedbc7d-e693-42af-9d61-1ac560174bf5.png'
    },
    {
        id: 8,
        name: '舞蹈',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/807680a7-1f90-4fe5-9d6e-c4c80c7cc521.png'
    },
    {
        id: 9,
        name: '演唱會',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/0c470566-b54a-4e35-b551-9ca242973bc0.png'
    },
    {
        id: 10,
        name: '戶外',
        media: 'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/1ddcb1e5-9227-44e8-9428-ee2cf75503cb.png'
    }
];

export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await publicApiClient.get<ApiResponse<CategoryResponseData>>('/v1/activity/category');
        const results = res.data.data?.results;
        if (results && results.length > 0) {
            return results;
        } else {
            return Categories;
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return Categories;
    }
};
