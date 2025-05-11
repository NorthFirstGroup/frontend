import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
import Profile from '../pages/user/Profile';
import Point from '../pages/user/Point';
import OrganizerApplyForm from '../pages/organizer/Apply';

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Layout>
                        <Home />
                    </Layout>
                }
            />
            <Route
                path="/login"
                element={
                    <Layout>
                        <Login />
                    </Layout>
                }
            />
            <Route
                path="/register"
                element={
                    <Layout>
                        <Register />
                    </Layout>
                }
            />
            <Route
                path="/user/profile"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Profile />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/user/point"
                element={
                    <PrivateRoute>
                        <Layout>
                            <Point />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/organizer/apply"
                element={
                    <PrivateRoute>
                        <Layout>
                            <OrganizerApplyForm />
                        </Layout>
                    </PrivateRoute>
                }
            />
            {/* 通配路由，找不到的路徑會導回首頁 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
