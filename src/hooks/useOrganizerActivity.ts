import organizerActivityAPI, { ActivityCreate, OrganizerActivityDetail } from '@api/organizerAPI';
import { ApiError } from '@type/ApiError';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const useOrganizerActivity = () => {
    // 使用 useState 來管理活動詳情的狀態
    const [activityDetail, setActivityDetail] = useState<OrganizerActivityDetail>();

    const getActivityDetail = useCallback(async (activityId: number | string) => {
        const activityIdNumber = Number(activityId);
        try {
            const response = await organizerActivityAPI.getActivityDetail(activityIdNumber);
            setActivityDetail(response);
            return response;
        } catch (error) {
            return (error as ApiError).message || 'Failed to fetch activity detail';
        }
    }, []);

    const createActivity = useCallback(async (data: ActivityCreate): Promise<ActivityCreate | ApiError> => {
        try {
            const response = await organizerActivityAPI.createActivity(data);
            toast.success('Successfully created activity!');
            return response;
        } catch (error) {
            const apiError = error as ApiError;
            toast.error(apiError.message || 'Failed to create activity');
            return apiError;
        }
    }, []);

    const updateActivity = useCallback(async (activityId: number, data: ActivityCreate) => {
        try {
            const response = await organizerActivityAPI.updateActivity(activityId, data);
            return response;
        } catch (error) {
            return (error as ApiError).message || 'Failed to update activity';
        }
    }, []);

    const deleteActivity = useCallback(async (activityId: number) => {
        try {
            await organizerActivityAPI.deleteActivity(activityId);
            return 'success';
        } catch (error) {
            return (error as ApiError).message || 'Failed to delete activity';
        }
    }, []);

    return {
        activityDetail,
        getActivityDetail,
        createActivity,
        updateActivity,
        deleteActivity
    };
};

export default useOrganizerActivity;
