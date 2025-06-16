import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByNumber, Order } from '@api/order';
import Button from 'react-bootstrap/esm/Button';

const OrderPayment = () => {
    const { order_number } = useParams();
    const [orderData, setOrderData] = useState<Order | null>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await getOrderByNumber(order_number);
                setOrderData(result);
            } catch (err) {
                console.error('載入訂單失敗', err);
            }
        };

        if (order_number)
            fetchOrder();
    }, [order_number]);

    const handlePaymentSubmit = () => {
        if (orderData?.paymentFormUrl && formContainerRef.current) {
            // 插入 form HTML
            formContainerRef.current.innerHTML = orderData.paymentFormUrl;

            // 找出表單並送出
            const form = formContainerRef.current.querySelector('form') as HTMLFormElement;
            if (form)
                form.submit();
        }
    };

    if (!orderData)
        return <div>載入中...</div>;

    return (
        <div className="container mt-4" style={{ maxWidth: '720px' }}>
            <h4 className="fw-bold mb-3">{orderData.eventName}</h4>
            <p><strong>開始時間</strong> {orderData.eventDate}</p>
            <p><strong>活動地點</strong> {orderData.location}</p>
            <p><strong>主辦單位</strong> {orderData.organizer}</p>
            <p><strong>訂單編號</strong> #{orderData.orderNumber}</p>
            <p><strong>票券類型</strong> {orderData.ticketType}</p>
            <p><strong>票券數量</strong> {orderData.ticketCount}</p>

            {orderData.seats.map((seat, idx) => (
                <p key={idx}><strong>座位</strong> {seat.seatNumber}</p>
            ))}

            <p><strong>總價</strong> {orderData.totalPrice.toLocaleString()}</p>

            {/* 支付區塊 */}
            { ((orderData.paymentStatus) === 'PAID') ?
                <div />
            :
                <div className="text-center mt-5">
                    <Button variant="primary" onClick={handlePaymentSubmit}>
                        綠界付款
                    </Button>
                </div>
            }

            {/* 表單容器（隱藏） */}
            <div ref={formContainerRef} style={{ display: 'none' }} />
        </div>
    );
};

export default OrderPayment;