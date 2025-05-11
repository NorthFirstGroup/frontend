import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import goTicketLogo from '/Subtract.png';
import goTicketVector from '../assets/Vector.png';
const Header = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/'); // 登出後導回首頁
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src={goTicketLogo} alt="Logo" />
                    <img src={goTicketVector} alt="GoTicket" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="goticket-navbar" />
                <Navbar.Collapse id="goticket-navbar">
                    <Nav className="ms-auto">
                        {/* <Nav.Link as={Link} to="/">
                            首頁
                        </Nav.Link> */}
                        {isLoggedIn ? (
                            <>
                                <NavDropdown title={user?.nickname || '會員'} id="user-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/user/profile">
                                        會員中心
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/user/point">
                                        點數資訊
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/organizer/apply">
                                        申請成為廠商
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>登出</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link onClick={() => navigate('/login', { state: { from: location.pathname } })}>
                                    登入
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
