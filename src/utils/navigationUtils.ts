// src/utils/navigationUtils.ts (or wherever you prefer to put utilities)
import { useNavigate } from 'react-router-dom';

// 定義所有可能的篩選參數
interface ActivityFilterParams {
    keyword?: string; // 搜尋關鍵字
    category?: string; // 活動類別
    categoryId?: number;
    // locationId?: number; // 地點
    // 未來如果需要，可以添加更多參數，例如：
    // date?: string;     // 日期
    // minPrice?: number; // 最小價格
}

/**
 * Custom hook to provide a reusable function for navigating to activity search results.
 * @returns {function(string): void} A function that takes a keyword and navigates.
 */
export const useActivityFilterNavigation = (_category: string = 'activity') => {
    const navigate = useNavigate();

    const navigateToActivityListWithFilters = (params: ActivityFilterParams) => {
        const queryParams = new URLSearchParams(); // 使用 URLSearchParams 構建查詢字串
        console.log(queryParams);
        // 檢查並添加 keyword 參數
        if (params.keyword) {
            queryParams.append('keyword', params.keyword);
        }
        // 檢查並添加 category 參數
        if (params.categoryId) {
            // Add categoryId to search params
            queryParams.append('categoryId', params.categoryId.toString());
        }
        // 未來可以在這裡添加更多參數的處理邏輯
        // if (params.locationId) {
        //     queryParams.append('locationId', params.locationId.toString());
        // }

        const queryString = queryParams.toString();
        // 如果有查詢字串，則添加 '?'
        const targetPath = `/search${queryString ? `?${queryString}` : ''}`;

        let decodedPathForLog = targetPath;
        try {
            // Attempt to decode the path for logging
            decodedPathForLog = decodeURIComponent(targetPath);
        } catch (e) {
            // In case of any decoding errors (unlikely with just keyword/category)
            console.error('Error decoding path for log:', e);
        }
        console.log('嘗試導航至:', decodedPathForLog);

        navigate(targetPath);
    };

    return navigateToActivityListWithFilters;
};
