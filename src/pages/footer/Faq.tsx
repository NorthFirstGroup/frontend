import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';

const FAQ: React.FC = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <h2 className="text-primary mb-4 text-center">常見問題 (FAQ)</h2>
                    <p className="lead text-muted text-center mb-5">
                        在這裡，您可以找到關於 GoTicket 平台使用、活動購票與上架的常見問題解答。
                    </p>

                    <Accordion defaultActiveKey="0" alwaysOpen>
                        {/* 購票相關問題 */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Q1: 如何在 GoTicket 購買票券？</Accordion.Header>
                            <Accordion.Body>
                                您可以在 GoTicket
                                網站上瀏覽各類活動。找到您感興趣的活動後，點擊進入活動頁面，選擇您想購買的票種和數量，然後依照指示完成結帳流程。我們支援多種付款方式，包括信用卡、行動支付等。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Q2: 購買成功後，我會在哪裡收到票券？</Accordion.Header>
                            <Accordion.Body>
                                購買成功後，您的電子票券會立即發送到您註冊 GoTicket
                                帳號時綁定的電子郵箱中。同時，您也可以登入 GoTicket
                                帳號，在「我的訂單」或「我的票券」頁面查看並下載您的票券。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Q3: 如果我無法出席活動，可以退票或轉讓嗎？</Accordion.Header>
                            <Accordion.Body>
                                退票政策會因各活動主辦單位設定而有所不同，請您務必在購票前詳細閱讀活動頁面中的
                                <a href="/upload-guidelines" className="text-decoration-none text-info">
                                    退票規範
                                </a>
                                。一般情況下，活動開始前一定期限內可申請退票，逾期或活動開始後恕不退費。票券轉讓請參考各活動的特殊規定。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Q4: 收到票券後，入場時需要準備什麼？</Accordion.Header>
                            <Accordion.Body>
                                通常您只需出示電子票券上的 QR Code
                                或條碼供現場人員掃描即可入場。建議您提前將電子票券下載至手機，或列印出來以備不時之需。請注意攜帶身份證件以備核對。
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 廠商上架相關問題 */}
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Q5: 我是主辦單位，如何在 GoTicket 上架活動？</Accordion.Header>
                            <Accordion.Body>
                                歡迎您在 GoTicket 上架活動！請先前往「舉辦活動」頁面，詳細閱讀
                                <a href="/upload-guidelines" className="text-decoration-none text-info">
                                    活動上架規範
                                </a>
                                。完成帳號註冊與廠商認證後，您即可進入後台填寫活動資訊、設定票種與價格，並提交審核。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="5">
                            <Accordion.Header>Q6: 活動上架需要支付費用嗎？</Accordion.Header>
                            <Accordion.Body>
                                GoTicket
                                平台對於付費活動會收取一定比例的服務費或金流處理費，詳細費用結構會在您申請廠商帳號時提供或在後台顯示。免費活動的上架通常不收取費用。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="6">
                            <Accordion.Header>Q7: 活動上架後還可以修改內容嗎？</Accordion.Header>
                            <Accordion.Body>
                                部分活動資訊在活動發布並有票券售出後將無法修改（例如：票種名稱、退票規則）。但活動圖片、說明、時間、票券庫存等可以在後台進行調整。詳情請參考
                                <a href="/upload-guidelines" className="text-decoration-none text-info">
                                    活動上架規範
                                </a>
                                。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="7">
                            <Accordion.Header>Q8: 如何查詢活動銷售狀況？</Accordion.Header>
                            <Accordion.Body>
                                成為 GoTicket
                                的合作廠商後，您可以登入您的廠商後台，即時查看活動的銷售數據、訂單詳情、營收報表等資訊，幫助您掌握活動的銷售進度。
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* 一般問題 */}
                        <Accordion.Item eventKey="8">
                            <Accordion.Header>Q9: 如何聯絡 GoTicket 客服？</Accordion.Header>
                            <Accordion.Body>
                                您可以透過網站底部的「
                                <a href="/contact-us" className="text-decoration-none text-info">
                                    聯絡我們
                                </a>
                                」頁面填寫表單與我們聯繫，或查看客服信箱/電話資訊。我們的客服團隊將會盡快為您提供協助。
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="9">
                            <Accordion.Header>Q10: 我對 GoTicket 有其他建議，如何回饋？</Accordion.Header>
                            <Accordion.Body>
                                我們非常樂意聽取您的寶貴建議！您可以透過「
                                <a href="/contact-us" className="text-decoration-none text-info">
                                    聯絡我們
                                </a>
                                」頁面留下您的意見，或透過我們的社群媒體管道 (Facebook, Instagram, LINE) 與我們互動。
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};

export default FAQ;
