import React from 'react';
// import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // 引入圖標

const ContactUs: React.FC = () => {
    // const [formData, setFormData] = useState({
    //     name: '',
    //     email: '',
    //     subject: '',
    //     message: ''
    // });
    // const [status, setStatus] = useState<'success' | 'error' | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setStatus(null);

    //     try {
    //         // const response = await fetch('/api/contact', {
    //         //     method: 'POST',
    //         //     headers: {
    //         //         'Content-Type': 'application/json',
    //         //     },
    //         //     body: JSON.stringify(formData),
    //         // });

    //         // const data = await response.json();

    //         // 模擬 API 延遲
    //         await new Promise(resolve => setTimeout(resolve, 1500));

    //         // 模擬成功或失敗
    //         const success = Math.random() > 0.3; // 模擬 70% 成功率

    //         if (success) {
    //             // 實際應該檢查 response.ok 或後端返回的狀態
    //             setStatus('success');
    //             setFormData({ name: '', email: '', subject: '', message: '' }); // 清空表單
    //         } else {
    //             setStatus('error');
    //         }
    //     } catch (error) {
    //         console.error('表單提交失敗:', error);
    //         setStatus('error');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={9}>
                    <h2 className="text-primary mb-4 text-center">聯絡我們</h2>
                    <p className="lead text-muted text-center mb-5">
                        無論您是購票者、活動主辦方，或有任何合作提案，都歡迎您隨時與 GoTicket 團隊聯繫。
                    </p>

                    <Row className="mb-5">
                        <Col className="mb-4 mb-md-0">
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-4">
                                    <h4 className="text-primary mb-4">我們的聯絡方式</h4>
                                    <div className="mb-3">
                                        <FaPhone className="text-info me-2" size={24} />
                                        <span className="text-dark">電話：(02) 1234-5678</span>
                                    </div>
                                    <div className="mb-3">
                                        <FaEnvelope className="text-info me-2" size={24} />
                                        <span className="text-dark">Email：support@goticket.com</span>
                                    </div>
                                    <div className="mb-3">
                                        <FaMapMarkerAlt className="text-info me-2" size={24} />
                                        <span className="text-dark">地址：台北市 GoTicket 路 88 號</span>
                                    </div>
                                    <p className="text-muted mt-3">客服服務時間：週一至週五 09:00 - 18:00</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* <Col md={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <h4 className="text-primary mb-4 text-center">發送訊息給我們</h4>
                                    {status === 'success' && (
                                        <Alert variant="success" className="text-center">
                                            訊息已成功送出！我們將盡快回覆您。
                                        </Alert>
                                    )}
                                    {status === 'error' && (
                                        <Alert variant="danger" className="text-center">
                                            訊息送出失敗，請稍後再試或直接透過 Email 聯繫。
                                        </Alert>
                                    )}
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3" controlId="contactFormName">
                                            <Form.Label>您的姓名</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="請輸入您的姓名"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="contactFormEmail">
                                            <Form.Label>您的 Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="請輸入您的 Email 地址"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="contactFormSubject">
                                            <Form.Label>主旨</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="例如：購票問題 / 合作洽詢"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="contactFormMessage">
                                            <Form.Label>您的訊息</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                placeholder="請輸入您想告訴我們的內容"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <div className="d-grid gap-2">
                                            <Button variant="primary" type="submit" disabled={loading}>
                                                {loading ? '送出中...' : '送出訊息'}
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ContactUs;
