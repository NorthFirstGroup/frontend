import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/user/Profile';
import Point from '../pages/user/Point';
import OrganizerApplyForm from '../pages/organizer/Apply';
import ActivityForm from '../pages/organizer/Activity';

export const routeConfigs = [
    { path: '/', element: <Home />, roles: [] },
    { path: '/login', element: <Login />, roles: [] },
    { path: '/register', element: <Register />, roles: [] },
    {
        path: '/user/profile',
        element: <Profile />,
        roles: ['USER', 'ORGANIZER'] // 可以定義允許的角色
    },
    {
        path: '/user/point',
        element: <Point />,
        roles: ['USER', 'ORGANIZER'] // 可以定義允許的角色
    },
    {
        path: '/organizer/apply',
        element: <OrganizerApplyForm />,
        roles: ['USER', 'ORGANIZER'] // 可以定義允許的角色
    },
    {
        path: '/organizer/activity',
        element: <ActivityForm />,
        roles: ['ORGANIZER'] // 可以定義允許的角色
    }
];
