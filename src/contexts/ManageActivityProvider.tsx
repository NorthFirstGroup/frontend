import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ManageActivityContext } from './context/ManageActivityContext';
import { useNavigate } from 'react-router-dom';
import organizerActivityAPI, { ActivityCreate, OrganizerActivityDetail } from '@api/organizerAPI';
import toast from 'react-hot-toast';
import { ApiError } from '@type/ApiError';
import { ActivityShowtime } from '@api/activityAPI';

export const ManageActivityProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [activityDetail, setActivityDetail] = useState<OrganizerActivityDetail>();
    const [showTimeModal, setShowTimeModal] = useState<string | boolean>(false);
    const [showSiteModal, setShowSiteModal] = useState<string | boolean>(false);
    const [organizerSiteMap, setOrganizerSiteMap] = useState<Map<string, ActivityShowtime[]>>(new Map());

    // 活動
    const getActivityDetail = useCallback(async (activityId: number | string) => {
        const activityIdNumber = Number(activityId);
        try {
            const response = await organizerActivityAPI.getActivityDetail(activityIdNumber);
            setActivityDetail(response);
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message);
            }
            toast.error('取得活動詳情失敗！');
        }
    }, []);

    const createActivity = useCallback(
        async (payload: ActivityCreate) => {
            try {
                const response = await organizerActivityAPI.createActivity(payload);
                toast.success('新增活動成功！');
                navigate(`/organizer/activity/manage/${response.id}`); // 成功後導向活動列表頁面
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '新增活動失敗！');
                }
            }
        },
        [navigate]
    );

    const updateActivity = useCallback(
        async (activityId: number, data: ActivityCreate) => {
            try {
                await organizerActivityAPI.updateActivity(activityId, data);
                getActivityDetail(activityId);
                toast.success('更新活動成功！');
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message || '更新活動失敗！');
                }
            }
        },
        [getActivityDetail]
    );

    const contextValue = useMemo(
        () => ({
            activityDetail,
            setActivityDetail,
            getActivityDetail,
            createActivity,
            updateActivity,
            showTimeModal,
            setShowTimeModal,
            showSiteModal,
            setShowSiteModal,
            organizerSiteMap,
            setOrganizerSiteMap
        }),
        [
            activityDetail,
            setActivityDetail,
            getActivityDetail,
            createActivity,
            updateActivity,
            showTimeModal,
            setShowTimeModal,
            showSiteModal,
            setShowSiteModal,
            organizerSiteMap,
            setOrganizerSiteMap
        ]
    );

    return <ManageActivityContext.Provider value={contextValue}>{children}</ManageActivityContext.Provider>;
};
