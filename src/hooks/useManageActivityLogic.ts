import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { useCallback, useEffect } from 'react';
import { ActivityShowtime } from '@api/activityAPI';
import { useSiteContext } from '@contexts/context/SiteContext';
import { useShowtimeContext } from '@contexts/context/ShowtimeContext';

const useManageActivityLogic = () => {
    const { getActivityDetail, setOrganizerSiteMap, setActivityDetail, setShowTimeModal, setShowSiteModal } =
        useManageActivityContext();
    const { organizerShowTimeList, getOrganizerShowtimeList } = useShowtimeContext();
    const { organizerSiteList, getOrganizerSiteList } = useSiteContext();

    const toggleShowTimeModal = (showTimeId: string | boolean) => {
        setShowTimeModal(showTimeId);
    };
    const toggleSiteModal = (siteId: string | boolean) => {
        setShowSiteModal(siteId);
    };
    const resetActivityDetail = useCallback(() => {
        setActivityDetail(undefined);
    }, [setActivityDetail]);

    const manageActivityInit = useCallback(
        (activityId: number | string) => {
            if (!activityId) return;
            getActivityDetail(activityId);
            getOrganizerShowtimeList(activityId);
            getOrganizerSiteList(activityId);
        },
        [getActivityDetail, getOrganizerShowtimeList, getOrganizerSiteList]
    );
    useEffect(() => {}, [organizerSiteList]);

    useEffect(() => {
        if (organizerSiteList) {
            let siteMap = new Map<string, ActivityShowtime[]>();
            if (!!organizerShowTimeList?.length) {
                for (const s of organizerShowTimeList ?? []) {
                    siteMap.set(s.siteId, [...(siteMap.get(s.siteId) || []), s]);
                }
            } else {
                organizerSiteList.forEach(site => {
                    if (site?.id) siteMap.set(site?.id, []);
                });
            }
            setOrganizerSiteMap(siteMap);
        }
    }, [organizerSiteList, organizerShowTimeList, setOrganizerSiteMap]);

    return {
        manageActivityInit,
        toggleShowTimeModal,
        toggleSiteModal,
        resetActivityDetail
    };
};

export default useManageActivityLogic;
