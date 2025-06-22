import { createContext, useContext } from 'react';

export type AppContextType = {
    categoryList: any[];
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext 必須在 AppProvider 裡使用');
    }
    return context;
};
