import { createContext, useContext } from 'react';
import { ActivityShowtime } from '@api/activityAPI';
import { ShowTimeCreate } from '@api/organizerAPI';

export interface ShowtimeContextType {
    organizerShowTimeList?: ActivityShowtime[];
    setOrganizerShowTimeList: (list: ActivityShowtime[]) => void;
    getOrganizerShowtimeList: (activityId: number | string) => Promise<ActivityShowtime[] | string>;
    createOrganizerShowtime: (activityId: string | number, data: ShowTimeCreate) => Promise<any>;
    updateOrganizerShowtime: (activityId: string | number, showtimeId: string, data: ShowTimeCreate) => Promise<any>;
    deleteOrganizerShowtime: (activityId: string | number, showtimeId: string) => Promise<void>;
}

export const ShowtimeContext = createContext<ShowtimeContextType | undefined>(undefined);

export const useShowtimeContext = () => {
    const context = useContext(ShowtimeContext);
    if (!context) throw new Error('useShowtimeContext 必須在 ShowtimeProvider 內使用');
    return context;
};
