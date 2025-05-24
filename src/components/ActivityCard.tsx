// src/components/ActivityCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Activity } from '../types/home';

interface ActivityCardProps {
    activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
    const getRemainingTime = (saleStartDate: string) => {
        const now = new Date();
        const saleStart = new Date(saleStartDate);
        const diff = saleStart.getTime() - now.getTime(); // 毫秒差

        if (diff <= 0) return '已開賣';

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let countdownString = '';
        if (days > 0) countdownString += `${days}天`;
        if (hours > 0) countdownString += `${hours}小時`;
        if (minutes > 0) countdownString += `${minutes}分`;
        // 只有在天、小時、分鐘都為0時才顯示秒，避免過於精確
        if (seconds > 0 && days === 0 && hours === 0 && minutes === 0) countdownString += `${seconds}秒`;
        if (!countdownString) return '即將開賣';

        return countdownString;
    };

    return (
        <Card className="h-100 shadow-sm">
            {' '}
            {/* h-100 確保卡片高度一致 */}
            <Card.Img
                variant="top"
                src={activity.poster_url}
                alt={activity.title}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="h5">{activity.title}</Card.Title>
                <Card.Text>
                    <p className="mb-1 text-muted">{activity.location}</p>
                    <p className="mb-1 text-muted">{new Date(activity.start_date).toLocaleDateString()}</p>
                    {activity.price_range && <p className="mb-1 fw-bold text-primary">{activity.price_range}</p>}

                    {/* 即將完售的邏輯 */}
                    {activity.remaining_tickets !== undefined &&
                        activity.total_tickets &&
                        activity.remaining_tickets > 0 &&
                        (activity.remaining_tickets <= activity.total_tickets * 0.2 ||
                            activity.remaining_tickets < 50) && ( // 設為總票數20%以下或少於50張
                            <p className="mb-1 text-danger fw-bold">🔥 剩餘票數：{activity.remaining_tickets}</p>
                        )}

                    {/* 開賣倒數中 */}
                    {activity.sale_start_date && new Date(activity.sale_start_date) > new Date() && (
                        <p className="mb-1 text-info fw-bold">開賣倒數：{getRemainingTime(activity.sale_start_date)}</p>
                    )}
                </Card.Text>
                <Button variant="primary" className="mt-auto">
                    查看詳情
                </Button>{' '}
                {/* mt-auto 將按鈕推到底部 */}
            </Card.Body>
        </Card>
    );
};

export default ActivityCard;
