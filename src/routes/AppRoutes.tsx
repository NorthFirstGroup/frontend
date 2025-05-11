import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PrivateRoute from '../components/PrivateRoute';
import { routeConfigs } from './routeConfigs';

const AppRoutes = () => {
    return (
        <Routes>
            {routeConfigs.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={
                        route?.roles.length ? (
                            <PrivateRoute allowedRoles={route.roles || []}>
                                <Layout>{route.element}</Layout>
                            </PrivateRoute>
                        ) : (
                            <Layout>{route.element}</Layout>
                        )
                    }
                />
            ))}
            {/* 通配路由，找不到的路徑會導回首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
