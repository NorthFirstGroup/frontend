import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ActivityShowtime } from '@api/activityAPI';
import { useSiteContext } from '@contexts/context/SiteContext';
import { useShowtimeContext } from '@contexts/context/ShowtimeContext';

const useManageActivityLogic = () => {
    const { activityId } = useParams<{ activityId: string }>();
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

    useEffect(() => {
        if (activityId) {
            getActivityDetail(activityId);
            getOrganizerShowtimeList(activityId);
            getOrganizerSiteList(activityId);
        }
    }, [activityId, getActivityDetail, getOrganizerShowtimeList, getOrganizerSiteList]);

    useEffect(() => {
        if (organizerSiteList && organizerShowTimeList) {
            let siteMap = new Map<string, ActivityShowtime[]>();
            organizerShowTimeList.forEach(showtime => {
                const siteId = showtime.siteId;
                if (siteMap.has(siteId)) {
                    siteMap.get(siteId)!.push(showtime);
                } else {
                    siteMap.set(siteId, [showtime]);
                }
            });
            setOrganizerSiteMap(siteMap);
        }
    }, [organizerSiteList, organizerShowTimeList, setOrganizerSiteMap]);

    return {
        toggleShowTimeModal,
        toggleSiteModal,
        resetActivityDetail
    };
};

export default useManageActivityLogic;
