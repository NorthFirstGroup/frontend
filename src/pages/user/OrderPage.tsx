import { useCallback, useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Order, getOrderByNumber } from '@api/order';

// TODO:
// 1. add order status
// 2. add ticket status
// 3. generate qrcode image with ticket id
const qrcodeApi = 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=';

const OrderPage = () => {
    const [order, setOrder] = useState<Order>();
    const [dateStr, setDateStr] = useState('');
    const { orderNumber } = useParams<{ orderNumber: string }>();

    const fetchOrder = useCallback(async () => {
        if (!orderNumber) return;
        const result = await getOrderByNumber(orderNumber);
        if (result) {
            setOrder(result);

            const date = new Date(result.eventDate);
            const formatted = date.toLocaleString('zh-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            setDateStr(formatted);
        }
    }, [orderNumber]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    return order ? (
        <div className="my-4">
            <h3>訂單編號: {order.orderNumber}</h3>
            <Card className="p-4 shadow-sm">
                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <div>
                            <strong>活動名稱</strong>：{order.eventName}
                        </div>
                        <div>
                            <strong>活動地點</strong>：{order.location}
                        </div>
                        <div>
                            <strong>實付金額</strong>：
                            <span className="text-danger fw-bold">NT$ {order.totalPrice}</span>
                        </div>
                        <div>
                            <strong>付款狀態</strong>：{order.status}
                        </div>
                    </Col>
                    <Col xs={12} md={6}>
                        <div>
                            <strong>活動日期</strong>：{dateStr}
                        </div>
                        <div>
                            <strong>票卷數量</strong>：{order.ticketCount} 張
                        </div>
                        <div>
                            <strong>主辦單位</strong>：{order.organizer}
                        </div>
                    </Col>
                </Row>

                {order.seats.map((ticket, index) => (
                    <Card className="mb-3 border-2 border-start border-warning" key={index}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <div>
                                    <strong>票卷數量</strong>：{index + 1}/{order.seats.length}
                                </div>
                                <div>
                                    <strong>座位</strong>：{ticket.seatNumber}
                                </div>
                                <div>
                                    <strong>票卷狀態</strong>：{ticket.status}
                                </div>
                            </div>
                            <div className="text-center">
                                {/* TODO: replace ticket.seatNumber with ticket id */}
                                <img src={qrcodeApi + ticket.seatNumber} alt="QRCode" width={100} height={100} />
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </Card>
        </div>
    ) : (
        <h3>找不到訂單或未經授權</h3>
    );
};

export default OrderPage;
