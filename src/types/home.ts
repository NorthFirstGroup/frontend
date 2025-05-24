/** 活動類別 */
export type ActivityCategory = '熱門' | '音樂' | '戲劇' | '展覽' | '電影' | '運動' | '親子' | '舞蹈' | '戶外';

/** 活動物件的介面 */
export interface Activity {
    id: string;
    title: string;
    poster_url: string;
    location: string;
    start_date: string; // ISO 格式的日期字串，例如 '2025-12-31T19:00:00Z'
    end_date?: string; // 可選
    price_range?: string; // 例如 'NT$ 800 - NT$ 3,500'
    remaining_tickets?: number; // 即將完售時顯示
    total_tickets?: number; // 總票數
    sold_tickets_count?: number; // 已售票數
    sale_start_date?: string; // 開賣倒數時顯示
    status?: 'active' | 'upcoming' | 'ended' | 'cancelled'; // 活動狀態
    tags?: string[]; // 例如 ['發燒主題', '親子活動']
}

/** 輪播圖物件的介面 */
export interface BannerSlide {
    id: number;
    image: string;
    title: string;
    link?: string; // 點擊圖片可導向的連結
}
