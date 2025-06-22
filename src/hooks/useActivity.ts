import { useCallback, useState } from 'react';
import activityAPI, { ActivityDetail, ActivityShowtimeResp } from '@api/activityAPI';
import toast from 'react-hot-toast';
import { ApiError } from '@type/ApiError';

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
                if (error instanceof ApiError) {
                    toast.error(error.message || '取得活動場次失敗！');
                }
            } finally {
                if (loading) setIsLoading(false);
            }
        },
        [activityId]
    );
    const getActivityShowtimeList = useCallback(
        async (id?: string, loading: boolean = false) => {
            const activityIdNumber = Number(activityId || id);
            try {
                if (loading) setIsLoading(true);
                const response = await activityAPI.getActivityShowtime(activityIdNumber);
                setShowTimeResult(response);
                return response;
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '取得活動場次失敗！');
                }
            } finally {
                if (loading) setIsLoading(false);
            }
            return null;
        },
        [activityId]
    );

    return {
        getActivityDetail,
        getActivityShowtimeList,
        showTimeResult,
        isLoading,
        activityDetail
    };
};

export default useActivity;
