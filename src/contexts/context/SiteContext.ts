import { OrganizerActivitySite } from '@api/organizerAPI';
import { createContext, useContext } from 'react';

export interface SiteContextType {
    organizerSiteList?: OrganizerActivitySite[];
    setOrganizerSiteList: (list: OrganizerActivitySite[]) => void;
    getOrganizerSiteList: (activityId: number | string) => Promise<any>;
    createOrganizerSite: (activityId: string | number, data: any) => Promise<any>;
    updateOrganizerSite: (activityId: string | number, siteId: string, data: any) => Promise<any>;
    deleteOrganizerSite: (activityId: string | number, siteId: string) => Promise<void>;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (!context) throw new Error('useSiteContext 必須在 SiteProvider 內使用');
    return context;
};
