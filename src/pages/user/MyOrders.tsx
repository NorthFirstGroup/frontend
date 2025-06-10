import { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Order, Pagination, getOrderList } from '@api/order';

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [_pagination, _setPagination] = useState<Pagination>();
    const fetchOrderList = useCallback(async () => {
        const res = await getOrderList();
        // console.log(res);
        if (res) {
            const orders: Order[] = res.results;
            setOrders(orders);
        }
    }, []);

    useEffect(() => {
        fetchOrderList();
    }, [fetchOrderList]);
    return (
        <div>
            <h1 className="mb-4">我的訂單</h1>
            {orders.map((order, index) => (
                <div key={index}>
                    <Row className="mb-3">
                        <Col xs={12} md={6}>
                            <img src={order.coverImage} style={{ height: '200px', objectFit: 'cover' }} />
                        </Col>
                        <Col xs={12} md={6}>
                            <div>
                                訂單編號：
                                <Link to={`/user/orders/${order.orderNumber}`}>{order.orderNumber}</Link>
                            </div>
                            <div>訂單狀態：{order.status}</div>
                            <div>活動名稱：{order.eventName}</div>
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default MyOrders;
