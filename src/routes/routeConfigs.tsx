import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/user/Profile';
import Point from '../pages/user/Point';
import MyOrders from '../pages/user/MyOrders';
import OrganizerApplyForm from '../pages/organizer/Apply';
import ActivityForm from '../pages/organizer/Activity';
import ValidateEntry from '../pages/organizer/ValidateEntry';

export const routeConfigs = [
    { path: '/', element: <Home />, roles: [] },
    { path: '/login', element: <Login />, roles: [] },
    { path: '/register', element: <Register />, roles: [] },
    {
        path: '/user/profile',
        element: <Profile />,
        roles: ['USER', 'ORGANIZER'] //個人資訊
    },
    {
        path: '/user/point',
        element: <Point />,
        roles: ['USER', 'ORGANIZER'] //點數資訊
    },
    {
        path: '/user/orders',
        element: <MyOrders />,
        roles: ['USER', 'ORGANIZER'] //我的訂單
    },
    {
        path: '/organizer/apply',
        element: <OrganizerApplyForm />,
        roles: ['USER', 'ORGANIZER'] // 申請成為廠商，廠商資訊
    },
    {
        path: '/organizer/activity',
        element: <ActivityForm />,
        roles: ['ORGANIZER'] // 活動管理
    },
    {
        path: '/organizer/validate-entry',
        element: <ValidateEntry />,
        roles: ['ORGANIZER'] // 入場資格驗證
    }
];
