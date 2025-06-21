import { ActivityShowtime } from '@api/activityAPI';
import { ActivityCreate, OrganizerActivityDetail } from '@api/organizerAPI';
import { createContext, useContext } from 'react';

export type ManageActivityContextType = {
    activityDetail?: OrganizerActivityDetail;
    setActivityDetail: (detail: OrganizerActivityDetail | undefined) => void;
    createActivity: (payload: ActivityCreate) => Promise<void>;
    getActivityDetail: (activityId: number | string) => Promise<void>;
    updateActivity: (activityId: number, data: ActivityCreate) => Promise<void>;
    showTimeModal: string | boolean;
    setShowTimeModal: (showTimeId: string | boolean) => void;
    showSiteModal: string | boolean;
    setShowSiteModal: (siteId: string | boolean) => void;
    organizerSiteMap: Map<string, ActivityShowtime[]>;
    setOrganizerSiteMap: (map: Map<string, ActivityShowtime[]>) => void;
};

export const ManageActivityContext = createContext<ManageActivityContextType | undefined>(undefined);

export const useManageActivityContext = () => {
    const context = useContext(ManageActivityContext);
    if (!context) {
        throw new Error('useManageActivityContext 必須在 ManageActivityProvider 裡使用');
    }
    return context;
};
