import { ReactNode, useCallback, useState } from 'react';
import { SiteContext } from './context/SiteContext';
import organizerActivityAPI, { OrganizerActivitySite } from '@api/organizerAPI';
import { ApiError } from '@types/ApiError';
import toast from 'react-hot-toast';

export const SiteProvider = ({ children }: { children: ReactNode }) => {
    const [organizerSiteList, setOrganizerSiteList] = useState<OrganizerActivitySite[]>();

    const getOrganizerSiteList = useCallback(async (activityId: number | string) => {
        const activityIdNumber = Number(activityId);
        try {
            const response = await organizerActivityAPI.getOrganizerSiteList(activityIdNumber);
            setOrganizerSiteList(response);
            return response;
        } catch (error) {
            if (error instanceof ApiError) {
                toast.error(error.message);
            }
        }
    }, []);

    const createOrganizerSite = useCallback(
        async (activityId: string | number, data: any) => {
            const activityIdNumber = Number(activityId);

            try {
                const response = await organizerActivityAPI.createOrganizerSite(activityIdNumber, data);
                toast.success('新增場地成功！');
                getOrganizerSiteList(activityIdNumber);
                return response;
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                }
            }
        },
        [getOrganizerSiteList]
    );

    const updateOrganizerSite = useCallback(
        async (activityId: string | number, siteId: string, data: any) => {
            const activityIdNumber = Number(activityId);
            try {
                const response = await organizerActivityAPI.updateOrganizerSite(activityIdNumber, siteId, data);
                toast.success('更新場地成功！');
                getOrganizerSiteList(activityIdNumber);
                return response;
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                }
            }
        },
        [getOrganizerSiteList]
    );

    const deleteOrganizerSite = useCallback(
        async (activityId: string | number, showtimeId: string) => {
            const activityIdNumber = Number(activityId);
            try {
                await organizerActivityAPI.deleteOrganizerSite(activityIdNumber, showtimeId);
                toast.success('刪除場地成功！');
                getOrganizerSiteList(activityIdNumber);
            } catch (error) {
                if (error instanceof ApiError) {
                    toast.error(error.message);
                }
            }
        },
        [getOrganizerSiteList]
    );

    return (
        <SiteContext.Provider
            value={{
                organizerSiteList,
                setOrganizerSiteList,
                getOrganizerSiteList,
                createOrganizerSite,
                updateOrganizerSite,
                deleteOrganizerSite
            }}
        >
            {children}
        </SiteContext.Provider>
    );
};
