import { useCallback, useState } from 'react';
import activityAPI, { ActivityDetail, ActivityShowtimeResp } from '@api/activityAPI';

const getTimeRange = (startTimes: number[]) => {
    // 檢查輸入是否為有效陣列
    if (!Array.isArray(startTimes) || startTimes.length === 0) {
        return [];
    }
    // 找出最早和最晚的時間戳
    const earliestTimestamp = Math.min(...startTimes);
    const latestTimestamp = Math.max(...startTimes);
    return [earliestTimestamp, latestTimestamp];
};

const useActivity = (activityId?: number | string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activityDetail, setActivityDetail] = useState<ActivityDetail | null>(null);
    const [showTimeResult, setShowTimeResult] = useState<ActivityShowtimeResp | null>(null);

    const getActivityDetail = useCallback(
        async (id?: string, loading: boolean = false) => {
            const activityIdNumber = Number(activityId || id);
            try {
                if (loading) setIsLoading(true);
                const response = await activityAPI.getActivityDetail(activityIdNumber);
                setActivityDetail(response);
                return response;
            } catch (error) {
                console.log('Error fetching activity detail:', error);
            } finally {
                if (loading) setIsLoading(false);
            }
        },
        [activityId]
    );
    const getActivityShowtime = useCallback(
        async (id?: string, loading: boolean = false) => {
            const activityIdNumber = Number(activityId || id);
            try {
                if (loading) setIsLoading(true);
                const response = await activityAPI.getActivityShowtime(activityIdNumber);
                setShowTimeResult(response);

                return response;
            } catch (error) {
                console.log('Error fetching activity showtime:', error);
            } finally {
                if (loading) setIsLoading(false);
            }
            return null;
        },
        [activityId]
    );

    return {
        getActivityDetail,
        getActivityShowtime,
        getTimeRange,
        showTimeResult,
        isLoading,
        activityDetail
    };
};

export default useActivity;
