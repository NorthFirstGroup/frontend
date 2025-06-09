/** 活動類別 */
export type ActivityCategory =
    | '熱門'
    | '音樂'
    | '戲劇'
    | '展覽'
    | '電影'
    | '運動'
    | '親子'
    | '舞蹈'
    | '演唱會'
    | '戶外';

export interface FrontpageActivity {
    id: number;
    name: string;
    cover_image: string;
    category: ActivityCategory;
    start_time?: string; // Optional, as 'coming-soon' might not have it
    end_time?: string; // Optional
    sales_start_time?: string; // Specific to 'coming-soon'
    capacity?: number;
}

/** 輪播圖物件的介面 */
export interface BannerSlide {
    id: number;
    name: string;
    cover_image: string;
}
