// SecondaryNavbar.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { Nav, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth'; // You'll need useAuth here too
import styles from './Header.module.css'; // Reuse existing styles
import { StyledSecondaryNavbar } from '@components/Header/HeaderStyles'; // 導入新的 Styled-Component

import { getFullUserMenuItems, SECONDARY_NAVBAR_PATHS } from '@components/Header/NavbarItems';

interface SecondaryNavbarProps {
    mainHeaderHeight: number;
    onSecondaryNavbarHeightChange: (height: number) => void;
}

const SecondaryNavbar = ({ mainHeaderHeight, onSecondaryNavbarHeightChange }: SecondaryNavbarProps) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const secondaryNavbarRef = useRef<HTMLElement>(null);

    const allUserMenuItems = getFullUserMenuItems(user?.role);
    const secondaryNavItems = allUserMenuItems.filter(
        item =>
            SECONDARY_NAVBAR_PATHS.includes(item.path) && !(item.name === '申請成為廠商' && user?.role === 'ORGANIZER') // 如果用戶是廠商，不顯示“申請成為廠商”
    );

    const shouldShowSecondaryNavbar = isLoggedIn && SECONDARY_NAVBAR_PATHS.includes(location.pathname);

    // Measure secondary navbar height and report to App.tsx
    const calculateAndReportSecondaryHeight = useCallback(() => {
        if (secondaryNavbarRef.current && shouldShowSecondaryNavbar) {
            onSecondaryNavbarHeightChange(secondaryNavbarRef.current.offsetHeight);
        } else if (!shouldShowSecondaryNavbar) {
            onSecondaryNavbarHeightChange(0); // Report 0 if not visible
        }
    }, [onSecondaryNavbarHeightChange, shouldShowSecondaryNavbar]);

    useEffect(() => {
        calculateAndReportSecondaryHeight();
        window.addEventListener('resize', calculateAndReportSecondaryHeight);

        return () => {
            window.removeEventListener('resize', calculateAndReportSecondaryHeight);
        };
    }, [calculateAndReportSecondaryHeight]);

    // Only render if needed
    if (!shouldShowSecondaryNavbar) {
        return null;
    }

    return (
        <StyledSecondaryNavbar
            bg="light"
            className={`${styles.secondaryNavbar} w-100 d-none d-lg-block`}
            ref={secondaryNavbarRef}
            style={{ top: `${mainHeaderHeight}px` }}
        >
            {' '}
            {/* Dynamically set top based on main header height */}
            <Container>
                <Nav className="me-auto">
                    {secondaryNavItems.map((item, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link
                                onClick={() => navigate(item.path)}
                                className={location.pathname === item.path ? styles.activeNavLink : ''}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }} // 添加 flex 布局來排版 icon 和文本
                            >
                                {item.icon && React.cloneElement(item.icon, { className: styles.dropdownIcon })}{' '}
                                {/* 渲染 icon，並添加 class */}
                                {item.name}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Container>
        </StyledSecondaryNavbar>
    );
};

export default SecondaryNavbar;
