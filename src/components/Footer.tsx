import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import styles from './Header/Header.module.css';
import logoPng from '/logo.png';
import goTicketPng from '../assets/brand.png';
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';
import linePng from '../assets/line.png';

const Footer: React.FC = () => {
    const iconStyle = {
        width: '28px',
        height: '28px',
        color: '#000000' // Or your desired dark color, e.g., '#333333'
    };
    return (
        <footer className="bg-light text-white py-5 mt-5">
            <Container>
                <Row>
                    <Col md={6} className="mb-3">
                        <Nav.Link href="/" className={styles.brand}>
                            <img src={logoPng} alt="Logo" className={styles.logo} />
                            <img src={goTicketPng} alt="GoTicket" className={styles.logoText} />
                        </Nav.Link>
                        {/* <p className="text-muted">在這裡可以放置一些關於網站的簡短介紹。</p> */}
                        <div className="d-flex mt-4">
                            <Nav.Link
                                href="https://www.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="me-3"
                            >
                                <FaFacebook style={iconStyle} />
                            </Nav.Link>
                            <Nav.Link
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="me-3"
                            >
                                <FaInstagramSquare style={iconStyle} />
                            </Nav.Link>
                            <Nav.Link href="https://line.me" target="_blank" rel="noopener noreferrer">
                                <img src={linePng} alt="LINE" style={iconStyle} />
                            </Nav.Link>
                        </div>
                    </Col>
                    <Col md={2} className="mb-3 text-center ms-md-auto">
                        {' '}
                        {/* ms-md-auto 將此欄位及其後的欄位推到最右側 */}
                        <h5 className="text-primary">舉辦活動</h5> {/* h5 預設是左對齊的 block 元素 */}
                        <Nav className="flex-column justify-content-center">
                            {' '}
                            {/* 移除 justify-content-md-end */}
                            <Nav.Link href="/upload-guidelines" className="text-gray-950">
                                活動上架規範
                            </Nav.Link>
                            <Nav.Link href="/faq" className="text-gray-950">
                                常見問題
                            </Nav.Link>
                        </Nav>
                    </Col>
                    {/* 網站資訊 - 保持 text-center，移除 text-md-end */}
                    {/* <Col md={2} className="mb-3 text-center">
                        <h5 className="text-primary">網站資訊</h5>
                        <Nav className="flex-column justify-content-center">
                            {' '}
                            <Nav.Link href="/event-list" className="text-gray-950">
                                節目列表
                            </Nav.Link>
                            <Nav.Link href="/activity-info" className="text-gray-950">
                                活動資訊
                            </Nav.Link>
                        </Nav>
                    </Col> */}
                    {/* 客服中心 - 保持 text-center，移除 text-md-end */}
                    <Col md={2} className="mb-3 text-center">
                        <h5 className="text-primary">客服中心</h5>
                        <Nav className="flex-column justify-content-center">
                            {' '}
                            {/* 移除 justify-content-md-end */}
                            <Nav.Link href="/about-us" className="text-gray-950">
                                關於我們
                            </Nav.Link>
                            <Nav.Link href="/contact-us" className="text-gray-950">
                                聯絡我們
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col md={2} className="mb-3 text-center">
                        <h5 className="text-primary">法律與政策</h5>
                        <Nav className="flex-column justify-content-center">
                            {' '}
                            {/* 移除 justify-content-md-end */}
                            <Nav.Link href="/privacy-policy" className="text-gray-950">
                                隱私權政策
                            </Nav.Link>
                            <Nav.Link href="/terms-of-service" className="text-gray-950">
                                使用者條款
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
                <hr className="bg-secondary" />
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start text-muted mb-2 mb-md-0">
                        &copy; {new Date().getFullYear()} GoTicket Inc. All rights reserved.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
