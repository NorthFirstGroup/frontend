import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import companyImage from '@assets/GoTicketAboutUs.png';

const AboutUs: React.FC = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <h2 className="text-primary mb-4 text-center">關於 GoTicket</h2>
                    <p className="lead text-muted text-center mb-5">GoTicket 致力於讓活動體驗更簡單、更精彩！</p>

                    <Row className="align-items-center mb-5">
                        <Col md={6} className="mb-4 mb-md-0">
                            <Image src={companyImage} alt="GoTicket 公司形象" fluid rounded />
                        </Col>
                        <Col md={6}>
                            <h3 className="text-primary mb-3">我們的願景</h3>
                            <p>
                                在
                                GoTicket，我們相信每一次活動都是一次獨特的體驗。我們的願景是成為連結活動主辦單位與熱情參與者的最佳橋樑，讓任何人都能輕鬆發現、參與並享受各種精彩活動，無論是演唱會、藝文表演、講座課程或是戶外體驗。
                            </p>
                            <p>
                                我們致力於打造一個直觀、安全且高效的票務平台，簡化購票流程，同時為活動主辦方提供強大的工具，輕鬆管理和推廣他們的活動。
                            </p>
                        </Col>
                    </Row>

                    <h3 className="text-primary mb-4 text-center">GoTicket 的使命</h3>
                    <Row className="mb-5">
                        <Col md={4} className="text-center mb-4">
                            <i className="bi bi-ticket-fill text-primary display-4 mb-3"></i>{' '}
                            {/* 需要引入 Bootstrap Icons */}
                            <h5 className="text-dark">簡化購票體驗</h5>
                            <p className="text-muted">提供友善的使用者介面，讓購票變得前所未有的簡單、快速且安全。</p>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <i className="bi bi-megaphone-fill text-primary display-4 mb-3"></i>
                            <h5 className="text-dark">賦能活動主辦方</h5>
                            <p className="text-muted">
                                提供完善的活動上架與管理工具，幫助主辦單位高效運營，精準觸及目標受眾。
                            </p>
                        </Col>
                        <Col md={4} className="text-center mb-4">
                            <i className="bi bi-people-fill text-primary display-4 mb-3"></i>
                            <h5 className="text-dark">豐富生活體驗</h5>
                            <p className="text-muted">匯聚多元化的活動選擇，激發人們探索新事物，豐富每一個生活瞬間。</p>
                        </Col>
                    </Row>

                    <h3 className="text-primary mb-4 text-center">我們的團隊</h3>
                    <p className="text-muted text-center mb-5">
                        GoTicket
                        團隊由一群對活動產業充滿熱情、經驗豐富的技術與營運專家組成。我們堅信透過科技的力量，可以為您帶來更優質的活動服務。
                    </p>
                    {/* 您可以在這裡加入團隊成員的簡介或照片區塊 */}
                    {/*
                    <Row className="justify-content-center mb-5">
                        <Col xs={6} md={3} className="text-center mb-4">
                            <Image src="https://via.placeholder.com/150" roundedCircle fluid className="mb-2" />
                            <h6 className="text-dark">創辦人 A</h6>
                            <small className="text-muted">執行長</small>
                        </Col>
                        <Col xs={6} md={3} className="text-center mb-4">
                            <Image src="https://via.placeholder.com/150" roundedCircle fluid className="mb-2" />
                            <h6 className="text-dark">技術長 B</h6>
                            <small className="text-muted">技術長</small>
                        </Col>
                        <Col xs={6} md={3} className="text-center mb-4">
                            <Image src="https://via.placeholder.com/150" roundedCircle fluid className="mb-2" />
                            <h6 className="text-dark">營運經理 C</h6>
                            <small className="text-muted">營運經理</small>
                        </Col>
                    </Row>
                    */}

                    <div className="text-center">
                        <p className="text-dark fs-5">感謝您選擇 GoTicket！我們期待與您一同創造更多難忘的活動回憶。</p>
                        <p>
                            有任何問題或建議，請隨時
                            <a href="/contact-us" className="text-decoration-none text-info">
                                聯絡我們
                            </a>
                            。
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AboutUs;
