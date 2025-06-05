import { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Image } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoPng from '/logo.png';
import goTicketPng from '../../assets/brand.png';
import avatarPng from '../../assets/def-avatar.png';
import memberPng from '../../assets/member.png';
import pointPng from '../../assets/point.png';
import cartPng from '../../assets/cart.png';
import applyPng from '../../assets/apply.png';
import activityMgmtPng from '../../assets/activity-mgmt.png';
import validataEntryPng from '../../assets/validate-ticket.png';
import signoutPng from '../../assets/sign-out.png';
import searchPng from '../../assets/search.png';
import styles from './Header.module.css';
import { StyledNavbar, StyledNavDropdown, StyledNavDropdownItem, StyledAuthButton } from './HeaderStyles'; // 引入您的 Styled-Components

const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showMobileSearchForm, setShowMobileSearchForm] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/'); // 登出後導回首頁
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
            <div
                className="d-flex align-items-center p-3"
                style={{ cursor: 'default', borderBottom: '1px solid #e0e0e0' }}
            >
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
            {/* 已登入的使用者連結 */}
            <StyledNavDropdownItem as={Link} to="/user/profile">
                <img src={memberPng} alt="member-icon" className={styles.dropdownIcon} />
                個人資訊
            </StyledNavDropdownItem>
            <StyledNavDropdownItem as={Link} to="/user/point">
                <img src={pointPng} alt="point-icon" className={styles.dropdownIcon} />
                點數資訊
            </StyledNavDropdownItem>
            <StyledNavDropdownItem as={Link} to="/user/orders">
                <img src={cartPng} alt="my-orders-icon" className={styles.dropdownIcon} />
                我的訂單
            </StyledNavDropdownItem>

            {user?.role === 'ORGANIZER' ? (
                <>
                    <NavDropdown.Divider className={styles.dropdownDivider} />
                    <StyledNavDropdownItem as={Link} to="/organizer/apply">
                        <img src={applyPng} alt="apply-icon" className={styles.dropdownIcon} />
                        廠商資訊
                    </StyledNavDropdownItem>
                    <StyledNavDropdownItem as={Link} to="/organizer/activity">
                        <img src={activityMgmtPng} alt="activity-management-icon" className={styles.dropdownIcon} />
                        活動管理
                    </StyledNavDropdownItem>
                    <StyledNavDropdownItem as={Link} to="/organizer/validate-entry">
                        <img src={validataEntryPng} alt="validate-entry-icon" className={styles.dropdownIcon} />
                        入場資格驗證
                    </StyledNavDropdownItem>
                </>
            ) : (
                <StyledNavDropdownItem as={Link} to="/organizer/apply">
                    <img src={applyPng} alt="apply-icon" className={styles.dropdownIcon} />
                    申請成為廠商
                </StyledNavDropdownItem>
            )}
            <NavDropdown.Divider className={styles.dropdownDivider} />
            <StyledNavDropdownItem onClick={handleLogout}>
                <img src={signoutPng} alt="signout-icon" className={styles.dropdownIcon} />
                登出
            </StyledNavDropdownItem>
        </>
    );

    return (
        <StyledNavbar bg="light" expand="lg" className={styles.navbar}>
            <Container className="d-flex flex-wrap align-items-center">
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    <img src={logoPng} alt="Logo" className={styles.logo} />
                    <img src={goTicketPng} alt="GoTicket" className={styles.logoText} />
                </Navbar.Brand>
                {/* 2. 桌面版搜尋欄 (大螢幕顯示，小螢幕隱藏) */}
                <Form className="d-none d-lg-flex mx-auto flex-grow-1" style={{ maxWidth: '400px' }}>
                    <Form.Control type="search" placeholder="🔍 搜尋活動" className="ms-2 me-2" aria-label="Search" />
                </Form>
                {/* 3. 手機版搜尋圖示按鈕 和 漢堡選單 */}
                <div className="d-flex d-lg-none ms-auto">
                    <button
                        onClick={() => setShowMobileSearchForm(!showMobileSearchForm)}
                        className={styles.searchIconButton}
                    >
                        <img src={searchPng} alt="Search" />
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
                    <Form className="mx-auto" style={{ maxWidth: '400px' }}>
                        <Form.Control type="search" placeholder="🔍 搜尋活動" className="w-100" />
                    </Form>
                </Container>
            )}
        </StyledNavbar>
    );
};

export default Header;
