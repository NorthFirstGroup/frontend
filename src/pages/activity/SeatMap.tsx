import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import activityAPI from '@api/activityAPI';
import Button from 'react-bootstrap/esm/Button';
import { postOrder } from '@api/order';

interface Seat {
    id: string;
    section: string;
    price: number;
    capacity: number;
    vacancy: number;
}

const SeatMap = () => {
    const navigate = useNavigate();
    const { activityId, showtimeId } = useParams(); // 讀取 URL 參數
    const [activityName, setActivityName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [seatImage, setSeatImage] = useState('');
    const [seats, setSeats] = useState<Seat[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]);

    // 模擬 API 請求
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await activityAPI.getActivityShowtimeSeatMap(activityId as string, showtimeId as string);

                const startTime = dayjs.unix(response.showtime.startTime);
                const weekday = startTime.get('day');
                const weekdayMap = ['日', '一', '二', '三', '四', '五', '六'];
                const startTimeStr = startTime.format(`YYYY-MM-DD(${weekdayMap[weekday]}) HH:mm`);
                setActivityName(response.activity.name);
                setStartTime(startTimeStr);
                setLocation(response.showtime.location);
                setAddress(response.showtime.address);
                setSeatImage(response.showtime.seat_image);
                setSeats(response.showtime.seats);
                setQuantities(response.showtime.seats.map(() => 0));
            } catch (error) {
                console.error('載入資料失敗:', error);
            }
        };

        fetchData();
    }, [activityId, showtimeId]);

    const handleQuantityChange = (index: number, delta: number) => {
        setQuantities(prev =>
            prev.map((q, i) => (i === index ? Math.min(4, Math.max(0, q + delta)) : q))
        );
    };

    const handleReset = () => {
        navigate(`/activity/${activityId}`);
    };

    const handleSubmit = async () => {
        const tickets = seats
            .map((seat, index) => ({
                zone: seat.section,
                price: seat.price,
                quantity: quantities[index]
            }))
            .filter(ticket => ticket.quantity > 0); // 只保留有選票的區域

        const payload = {
            activity_id: Number(activityId),
            showtime_id: showtimeId as string,
            tickets
        };

        try {
            const res = await postOrder(payload);
            
            if (res?.order_number)
                navigate(`/order/payment/${res.order_number}`);
        } catch (error) {
            console.error('送出失敗:', error);
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '600px' }}>
            <h4 className="fw-bold text-center mb-3">{activityName}</h4>
            <div className="text-center mb-2">時間：{startTime}</div>
            <div className="text-center mb-2">地點：{location}</div>
            <div className="text-center mb-4">場館地址：{address}</div>

            <div className="row fw-bold text-center border-bottom pb-2 mb-2">
                <div className="col">分區</div>
                <div className="col">金額</div>
                <div className="col">購買數量</div>
                <div className="col">剩餘座位</div>
            </div>

            {seats.map((seat, index) => (
                <div className="row text-center align-items-center py-2" key={seat.id}>
                    <div className="col">{seat.section}</div>
                    <div className="col">${seat.price}</div>
                    <div className="col">
                        <div className="d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleQuantityChange(index, -1)}
                            >-</button>
                            <span className="mx-2">{quantities[index]}</span>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleQuantityChange(index, 1)}
                                disabled={quantities[index] >= seat.vacancy}
                            >+</button>
                        </div>
                    </div>
                    <div className="col">{seat.vacancy}</div>
                </div>
            ))}

            <div className="d-flex justify-content-center gap-3 mt-4">
                <Button variant="primary" onClick={handleReset}>
                    重選場次
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    確認購買
                </Button>
            </div>

            {seatImage && (
                <div className="text-center mt-5">
                    <h5 className="mb-3">座位區域示意圖</h5>
                    <img src={seatImage} alt="座位圖" className="img-fluid" style={{ maxWidth: '600px' }} />
                </div>
            )}
        </div>
    );
};

export default SeatMap;