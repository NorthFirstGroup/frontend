import React from 'react';
import { CgProfile } from 'react-icons/cg';
// import { BsLightningChargeFill } from 'react-icons/bs';
import { IoCartOutline } from 'react-icons/io5';
import { PiIdentificationBadge } from 'react-icons/pi';
import { FaRegCalendarDays } from 'react-icons/fa6';
import { FaTicketAlt } from 'react-icons/fa';

export interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement> | React.HTMLAttributes<HTMLElement>>;
    role?: 'ORGANIZER' | 'USER';
}

export const USER_MENU_ITEMS: MenuItem[] = [
    { name: '個人資訊', path: '/user/profile', icon: <CgProfile /> },
    //{ name: '點數資訊', path: '/user/point', icon: <BsLightningChargeFill /> }
    { name: '我的訂單', path: '/user/orders', icon: <IoCartOutline /> }
];

export const ORGANIZER_MENU_ITEMS: MenuItem[] = [
    { name: '廠商資訊', path: '/organizer/apply', icon: <PiIdentificationBadge />, role: 'ORGANIZER' },
    { name: '活動管理', path: '/organizer/activity', icon: <FaRegCalendarDays />, role: 'ORGANIZER' },
    { name: '入場資格驗證', path: '/organizer/validate-entry', icon: <FaTicketAlt />, role: 'ORGANIZER' }
];

export const getFullUserMenuItems = (userRole?: 'ORGANIZER' | 'USER' | null): MenuItem[] => {
    let items = [...USER_MENU_ITEMS];
    if (userRole === 'ORGANIZER') {
        items.push(...ORGANIZER_MENU_ITEMS);
    } else {
        items.push({ name: '申請成為廠商', path: '/organizer/apply', icon: <PiIdentificationBadge /> });
    }
    return items;
};

export const SECONDARY_NAVBAR_PATHS = [
    '/user/profile',
    '/user/orders',
    '/organizer/apply',
    '/organizer/activity',
    '/organizer/validate-entry'
];
