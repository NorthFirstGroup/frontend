import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Profile from '@pages/user/Profile';
// import Point from '@pages/user/Point';
import MyOrders from '@pages/user/MyOrders';
import OrderPage from '@pages/user/OrderPage';
import OrganizerApplyForm from '@pages/organizer/Apply';
import ValidateEntry from '@pages/organizer/ValidateEntry';
import SearchPage from '@pages/searchEngine/SearchPage';
import ActivityDetailPage from '@pages/activity/ActivityDetailPage';
import SeatMap from '@pages/activity/SeatMap';
import OrderPayment from '@pages/activity/OrderPayment';
import ManageActivityPage from '@pages/organizer/manageActivity/ManageActivityPage';
import ActivityList from '@pages/organizer/Activity';

export const routeConfigs = [
    { path: '/', element: <Home />, roles: [] },
    { path: '/login', element: <Login />, roles: [] },
    { path: '/register', element: <Register />, roles: [] },
    {
        path: '/user/profile',
        element: <Profile />,
        roles: ['USER', 'ORGANIZER'] //個人資訊
    },
    // {
    //     path: '/user/point',
    //     element: <Point />,
    //     roles: ['USER', 'ORGANIZER'] //點數資訊
    // },
    {
        path: '/user/orders',
        element: <MyOrders />,
        roles: ['USER', 'ORGANIZER'] //我的訂單
    },
    {
        path: '/seatmap/activity/:activityId/:showtimeId',
        element: <SeatMap />,
        roles: ['USER', 'ORGANIZER'] //購票
    },
    {
        path: '/order/payment/:order_number',
        element: <OrderPayment />,
        roles: ['USER', 'ORGANIZER'] //購票支付
    },
    {
        path: '/user/orders/:orderNumber',
        element: <OrderPage />,
        roles: ['USER', 'ORGANIZER'] //單一訂單
    },
    {
        path: '/organizer/apply',
        element: <OrganizerApplyForm />,
        roles: ['USER', 'ORGANIZER'] // 申請成為廠商，廠商資訊
    },
    {
        path: '/organizer/activity',
        element: <ActivityList />,
        roles: ['ORGANIZER'] // 活動管理
    },
    {
        path: '/organizer/activity/manage',
        element: <ManageActivityPage />,
        roles: ['ORGANIZER'] // 活動管理
    },
    {
        path: '/organizer/activity/manage/:activityId',
        element: <ManageActivityPage />,
        roles: ['ORGANIZER'] // 活動管理
    },
    {
        path: '/organizer/validate-entry',
        element: <ValidateEntry />,
        roles: ['ORGANIZER'] // 入場資格驗證
    },
    {
        path: '/search',
        element: <SearchPage />,
        roles: []
    },
    {
        path: '/activity/:activityId',
        element: <ActivityDetailPage />,
        roles: [] // 單一活動詳情
    }
];
