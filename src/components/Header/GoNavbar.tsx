import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Image } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoPng from '/logo.png';
import goTicketPng from '@assets/brand.png';
import avatarPng from '@assets/def-avatar.png';
import searchPng from '@assets/search.png';
import { CgProfile } from 'react-icons/cg';
// import { BsLightningChargeFill } from 'react-icons/bs';
import { IoCartOutline } from 'react-icons/io5';
import { PiIdentificationBadge } from 'react-icons/pi';
import { FaRegCalendarDays } from 'react-icons/fa6';
import { FaTicketAlt } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import styles from './Header.module.css';
import { StyledNavbar, StyledNavDropdown, StyledNavDropdownItem, StyledAuthButton } from './HeaderStyles'; // 引入您的 Styled-Components
import { useActivityFilterNavigation } from '@utils/navigationUtils';

interface MenuItem {
    name: string;
    path: string;
    icon: React.ReactElement; // Or a specific type for your icon component
    role?: 'ORGANIZER' | 'USER'; // Optional: if some items are role-specific
}
const secondaryNavbarPaths = [
    '/user/profile',
    '/user/orders',
    '/organizer/apply',
    '/organizer/activity',
    '/organizer/validate-entry'
];

const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showMobileSearchForm, setShowMobileSearchForm] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [showSecondaryNavbar, setShowSecondaryNavbar] = useState(false);

    const navigateToActivityListWithFilters = useActivityFilterNavigation();

    const commonMenuItems: MenuItem[] = [
        { name: '個人資訊', path: '/user/profile', icon: <CgProfile className={styles.dropdownIcon} /> },
        //{ name: '點數資訊', path: '/user/point', icon: <BsLightningChargeFill className={styles.dropdownIcon} /> }
        { name: '我的訂單', path: '/user/orders', icon: <IoCartOutline className={styles.dropdownIcon} /> }
    ];

    // Add role-specific items dynamically
    if (user?.role === 'ORGANIZER') {
        commonMenuItems.push(
            {
                name: '廠商資訊',
                path: '/organizer/apply',
                icon: <PiIdentificationBadge className={styles.dropdownIcon} />,
                role: 'ORGANIZER'
            },
            {
                name: '活動管理',
                path: '/organizer/activity',
                icon: <FaRegCalendarDays className={styles.dropdownIcon} />,
                role: 'ORGANIZER'
            },
            {
                name: '入場資格驗證',
                path: '/organizer/validate-entry',
                icon: <FaTicketAlt className={styles.dropdownIcon} />,
                role: 'ORGANIZER'
            }
        );
    } else {
        commonMenuItems.push({
            name: '申請成為廠商',
            path: '/organizer/apply',
            icon: <PiIdentificationBadge className={styles.dropdownIcon} />
        });
    }

    useEffect(() => {
        if (secondaryNavbarPaths.includes(location.pathname)) {
            setShowSecondaryNavbar(true);
        } else {
            setShowSecondaryNavbar(false);
        }
    }, [location.pathname, user?.role]);

    const handleLogout = () => {
        logout();
        navigate('/'); // 登出後導回首頁
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission (page reload)
        if (searchTerm.trim()) {
            // Only navigate if there's actual input
            navigateToActivityListWithFilters({ keyword: searchTerm.trim() });
        }
        // Optionally, clear the search term after submission
        setSearchTerm('');
    };

    const handleDropdownItemClick = (path: string) => {
        navigate(path);
        setShowSecondaryNavbar(true);
    };

    const renderDropdownTitle = (
        <div className="d-flex align-items-center justify-content-center" style={{ padding: '0 0.5rem' }}>
            <Image
                src={user?.profile_url || avatarPng}
                alt="User Avatar"
                roundedCircle
                width="28" // 稍微調整大小以符合 Navbar
                height="28"
                className="ms-2"
            />
        </div>
    );

    const renderUserMenuItems = () => (
        <>
            <div className="d-flex align-items-center p-3" style={{ cursor: 'default' }}>
                <Image
                    src={user?.profile_url || avatarPng}
                    alt="User Avatar"
                    roundedCircle
                    width="40"
                    height="40"
                    className="me-3"
                />
                <div>
                    <div className="fw-bold">{user?.nickname || '會員'}</div>
                    <small className="text-muted">{user?.email}</small>
                </div>
            </div>

            <NavDropdown.Divider className={styles.dropdownDivider} />
            {commonMenuItems.map((item, index) => (
                <React.Fragment key={index}>
                    {item.path === '/organizer/apply' && user?.role === 'ORGANIZER' && (
                        <NavDropdown.Divider className={styles.dropdownDivider} />
                    )}
                    <StyledNavDropdownItem onClick={() => handleDropdownItemClick(item.path)}>
                        {item.icon}
                        {item.name}
                    </StyledNavDropdownItem>
                </React.Fragment>
            ))}
            <NavDropdown.Divider className={styles.dropdownDivider} />
            <StyledNavDropdownItem onClick={handleLogout}>
                <RxExit className={styles.dropdownIcon} />
                登出
            </StyledNavDropdownItem>
        </>
    );

    const renderSecondaryNavbar = () => (
        <Navbar bg="light" className={`${styles.secondaryNavbar} w-100 d-none d-lg-block`}>
            <Container>
                <Nav className="me-auto">
                    {commonMenuItems.map((item, index) => {
                        const isOrganizerApplyPath = item.path === '/organizer/apply';
                        const shouldHighlight = isOrganizerApplyPath && user?.role === 'ORGANIZER';
                        return (
                            <Nav.Item key={index} className={`${shouldHighlight ? styles.highlightedNavLink : ''}`}>
                                <Nav.Link
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className={location.pathname === item.path ? styles.activeNavLink : ''}
                                >
                                    {item.name}
                                </Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>
            </Container>
        </Navbar>
    );

    const iconStyle = {
        width: '28px',
        height: '28px',
        color: '#000000' // Or your desired dark color, e.g., '#333333'
    };

    return (
        <>
            <StyledNavbar bg="light" expand="lg" className={styles.navbar}>
                <Container className="d-flex flex-wrap align-items-center">
                    <Navbar.Brand as={Link} to="/" className={styles.brand}>
                        <img src={logoPng} alt="Logo" className={styles.logo} />
                        <img src={goTicketPng} alt="GoTicket" className={styles.logoText} />
                    </Navbar.Brand>
                    {/* 2. 桌面版搜尋欄 (大螢幕顯示，小螢幕隱藏) */}
                    <Form
                        className="d-none d-lg-flex mx-auto flex-grow-1"
                        style={{ maxWidth: '400px' }}
                        onSubmit={handleSearchSubmit}
                    >
                        <Form.Control
                            type="search"
                            placeholder="🔍 搜尋活動"
                            className="ms-2 me-2"
                            aria-label="Search"
                            value={searchTerm} // Bind input value to state
                            onChange={e => setSearchTerm(e.target.value)} // Update state on change
                        />
                    </Form>
                    {/* 3. 手機版搜尋圖示按鈕 和 漢堡選單 */}
                    <div className="d-flex d-lg-none ms-auto">
                        <button
                            onClick={() => setShowMobileSearchForm(!showMobileSearchForm)}
                            className={styles.searchIconButton}
                        >
                            <Image src={searchPng} style={iconStyle} />
                        </button>
                        {isLoggedIn ? (
                            // 已登入：顯示漢堡選單
                            <Navbar.Toggle aria-controls="goticket-navbar" className="ms-2" />
                        ) : (
                            // 未登入：顯示「登入」按鈕，取代漢堡選單位置
                            <Nav.Link
                                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                                className={styles.navLink} // 使用 navLink 的基本樣式
                            >
                                <StyledAuthButton>登入</StyledAuthButton>
                            </Nav.Link>
                        )}
                    </div>
                    <Navbar.Collapse id="goticket-navbar">
                        <Nav className="ms-auto">
                            {
                                <>
                                    <Nav.Link as={Link} to="/activity" className="d-none d-lg-block">
                                        活動資訊
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/faq" className="d-none d-lg-block">
                                        常見問題
                                    </Nav.Link>
                                </>
                            }
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link as={Link} to="/user/orders" className="d-none d-lg-block">
                                        我的訂單
                                    </Nav.Link>

                                    {/* 桌面版使用者下拉選單 (小螢幕隱藏，大螢幕顯示) */}
                                    <StyledNavDropdown
                                        title={renderDropdownTitle} // 將觸發器渲染內容傳給 title
                                        id="user-nav-dropdown"
                                        align="end" // 確保下拉選單在右側打開
                                        className="d-none d-lg-block"
                                    >
                                        {renderUserMenuItems()}
                                    </StyledNavDropdown>
                                    {/* 手機版使用者選單項目 (小螢幕顯示，大螢幕隱藏) */}
                                    <div className="d-lg-none w-100">{renderUserMenuItems()}</div>
                                </>
                            ) : (
                                <>
                                    {/* 桌面版 */}
                                    <Nav.Link
                                        onClick={() => navigate('/login', { state: { from: location.pathname } })}
                                        className="d-none d-lg-block"
                                    >
                                        <StyledAuthButton>登入</StyledAuthButton>
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                {/* 手機版搜尋表單 (根據 showMobileSearchForm 狀態顯示，只在小螢幕顯示) */}
                {showMobileSearchForm && (
                    <Container fluid className="d-lg-none py-2">
                        <Form className="mx-auto" style={{ maxWidth: '400px' }} onSubmit={handleSearchSubmit}>
                            <Form.Control
                                type="search"
                                placeholder="🔍 搜尋活動"
                                className="w-100"
                                aria-label="Search"
                                value={searchTerm} // Bind input value to state
                                onChange={e => {
                                    setSearchTerm(e.target.value);
                                    console.log('Input onChange, new value:', e.target.value);
                                }} // Update state on change
                            />
                        </Form>
                    </Container>
                )}
            </StyledNavbar>
            {isLoggedIn && showSecondaryNavbar && renderSecondaryNavbar()}
        </>
    );
};

export default Header;
