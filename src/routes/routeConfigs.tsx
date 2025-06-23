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
import VenueForm from '@pages/organizer/VenueForm';
import ResetPassword from '@pages/ResetPassword';
import UploadGuidelines from '@pages/footer/UploadGuidelines';
import FAQ from '@pages/footer/Faq';
import AboutUs from '@pages/footer/AboutUs';
import ContactUs from '@pages/footer/ContactUs';
import PrivacyPolicy from '@pages/footer/PrivacyPolicy';
import TermsOfService from '@pages/footer/TermsOfService';

export const routeConfigs = [
    { path: '/', element: <Home />, roles: [] },
    { path: '/login', element: <Login />, roles: [] },
    { path: '/register', element: <Register />, roles: [] },
    {
        path: '/user/profile',
        element: <Profile />,
        roles: ['USER', 'ORGANIZER'] //會員資訊
    },
    { path: '/user/reset-password', element: <ResetPassword />, roles: [] },
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
        path: '/organizer/activity/manage/create',
        element: <ManageActivityPage />,
        roles: ['ORGANIZER'] // 新增活動管理
    },
    {
        path: '/organizer/activity/manage/:activityId',
        element: <ManageActivityPage />,
        roles: ['ORGANIZER'] // 編輯活動管理
    },
    {
        path: '/organizer/activity/site/:activityId',
        element: <VenueForm />,
        roles: ['ORGANIZER'] // 活動場地管理
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
    },
    {
        path: '/upload-guidelines',
        element: <UploadGuidelines />,
        roles: [] // 活動上架規範
    },
    {
        path: '/faq',
        element: <FAQ />,
        roles: [] // 常見問題
    },
    {
        path: '/about-us',
        element: <AboutUs />,
        roles: [] // 關於我們
    },
    {
        path: '/contact-us',
        element: <ContactUs />,
        roles: [] // 聯絡我們
    },
    {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        roles: [] // 隱私權政策
    },
    {
        path: '/terms-of-service',
        element: <TermsOfService />,
        roles: [] // 使用者條款
    }
];
