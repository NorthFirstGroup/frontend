// src/components/ActivityCard.tsx
import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // <<< 導入 useNavigate
import { FrontpageActivity } from '../types/home';
import './ActivityCard.css';

interface ActivityCardProps {
    activity: FrontpageActivity;
    hasBorder?: boolean;
    borderColor?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, hasBorder = false, borderColor = '#E0E0E0' }) => {
    const navigate = useNavigate(); // <<< 初始化 useNavigate hook

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

    const formatActivityDate = (startDate: string | undefined, endDate: string | undefined): string => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false // 24-hour format
        };

        const startDateString = start.toLocaleString('zh-TW', options); // Or 'en-US' depending on your locale preference

        if (end && start.toDateString() !== end.toDateString()) {
            // If the event spans multiple days
            const endDateString = end.toLocaleString('zh-TW', options);
            return `${startDateString} - ${endDateString}`;
        }
        return startDateString;
    };

    const isComingSoon = activity.sales_start_time && new Date(activity.sales_start_time) > new Date();

    const cardWrapperStyle: React.CSSProperties = {
        border: hasBorder ? `1px solid ${borderColor}` : 'none',
        cursor: 'pointer'
        // 可以選擇性地移除 shadow-sm 或在有邊框時移除它
        // boxShadow: hasBorder ? 'none' : '0 .125rem .25rem rgba(0,0,0,.075)',
    };

    const handleCardClick = () => {
        // 導航到 /Activity/{activity.id} 路徑
        console.log('點擊 ActivityCard，導航至:', `/activity/${activity.id}`); // 方便調試
        navigate(`/activity/${activity.id}`);
    };

    return (
        <Card className="card-wrapper shadow-sm" style={cardWrapperStyle} onClick={handleCardClick}>
            <div className="card-image-container">
                <img className="card-image" src={activity.cover_image} alt={activity.name} />
                {/* Apply overlay badge only when it's coming soon */}
                {isComingSoon && (
                    <div className="card-overlay-badge" style={{ display: 'flex' }}>
                        開賣倒數：{getRemainingTime(activity.sales_start_time!.toString())}
                    </div>
                )}
            </div>
            <div className="card-info">
                <div className="card-badge">
                    {/* <span className="card-badge-text">{activity.category}</span> */}
                    <label className="text-sm-start">{activity.category}</label>
                </div>
                {/* 使用 OverlayTrigger 包裹 h3，並在 Tooltip 中顯示完整的活動名稱 */}
                <OverlayTrigger
                    placement="top" // Tooltip 顯示位置 (可選: 'bottom', 'left', 'right')
                    overlay={<Tooltip id={`tooltip-${activity.id}`}>{activity.name}</Tooltip>}
                >
                    <h6 className="card-title">{activity.name}</h6>
                </OverlayTrigger>
                <p className="card-date">{formatActivityDate(activity.start_time, activity.end_time)}</p>

                {/* You can add logic for '即將完售' here if needed */}
                {/*
                {activity.remaining_tickets !== undefined &&
                    activity.total_tickets &&
                    activity.remaining_tickets > 0 &&
                    (activity.remaining_tickets <= activity.total_tickets * 0.2 ||
                        activity.remaining_tickets < 50) && (
                        <p className="mb-1 text-danger fw-bold">🔥 剩餘票數：{activity.remaining_tickets}</p>
                    )}
                */}
            </div>
        </Card>
    );
};

export default ActivityCard;
