import { ActivityShowtime } from '@api/activityAPI';
import organizerActivityAPI, { ShowTimeCreate } from '@api/organizerAPI';
import { ApiError } from '@type/ApiError';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const useOrganizerShowtime = () => {
    const [organizerShowTimeList, setOrganizerShowTimeList] = useState<ActivityShowtime[]>();

    const getOrganizerShowtimeList = useCallback(async (activityId: number | string) => {
        const activityIdNumber = Number(activityId);
        try {
            const response = await organizerActivityAPI.getActivityShowtimeList(activityIdNumber);
            setOrganizerShowTimeList(response);
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message || '取得活動詳情失敗！');
            }
            return (error as ApiError).message || 'Failed to fetch activity showtime';
        }
    }, []);

    const createOrganizerShowtime = useCallback(
        async (activityId: string | number, data: ShowTimeCreate) => {
            const activityIdNumber = Number(activityId);

            try {
                const response = await organizerActivityAPI.createActivityShowtime(activityIdNumber, data);
                toast.success('新增場次成功！');
                getOrganizerShowtimeList(activityIdNumber);
                return response;
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '新增活動失敗！');
                }
            }
        },
        [getOrganizerShowtimeList]
    );

    const updateOrganizerShowtime = useCallback(
        async (activityId: string | number, showtimeId: string, data: ShowTimeCreate) => {
            const activityIdNumber = Number(activityId);
            try {
                const response = await organizerActivityAPI.updateActivityShowtime(activityIdNumber, showtimeId, data);
                toast.success('更新場次成功！');
                getOrganizerShowtimeList(activityIdNumber);
                return response;
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '新增活動失敗！');
                }
            }
        },
        [getOrganizerShowtimeList]
    );

    const deleteOrganizerShowtime = useCallback(
        async (activityId: string | number, showtimeId: string) => {
            const activityIdNumber = Number(activityId);
            try {
                await organizerActivityAPI.deleteActivityShowtime(activityIdNumber, showtimeId);
                toast.success('刪除場次成功！');
                getOrganizerShowtimeList(activityIdNumber);
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '新增活動失敗！');
                }
            }
        },
        [getOrganizerShowtimeList]
    );

    return {
        organizerShowTimeList,
        getOrganizerShowtimeList,
        createOrganizerShowtime,
        updateOrganizerShowtime,
        deleteOrganizerShowtime
    };
};

export default useOrganizerShowtime;
