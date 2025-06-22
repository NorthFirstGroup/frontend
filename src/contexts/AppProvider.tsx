import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AppContext } from './context/AppContext';
import * as CategoryAPI from '@api/category';
import { Category } from '@api/category';
import { Toaster } from 'react-hot-toast';

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [categoryList, setCategoryList] = useState<Category[]>([]);

    const contextValue = useMemo(() => ({ categoryList }), [categoryList]);

    const getCategoryList = async () => {
        const categories = await CategoryAPI.getCategories();
        setCategoryList(categories);
    };

    useEffect(() => {
        getCategoryList();
    }, []);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
            <Toaster />
        </AppContext.Provider>
    );
};

export default AppProvider;
