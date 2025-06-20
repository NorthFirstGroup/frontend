import React, { useState, useEffect } from 'react';
import { Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FrontpageActivity } from '@type/home';
import './CountdownActivityCard.css';

interface CountdownActivityCardProps {
    activity: FrontpageActivity;
}

const CountdownActivityCard: React.FC<CountdownActivityCardProps> = ({ activity }) => {
    const navigate = useNavigate();

    // 實時倒數計時狀態
    const [countdown, setCountdown] = useState<string>('');

    // 格式化倒數計時的函數
    const getRemainingTime = (saleStartDateString: string | undefined): string => {
        if (!saleStartDateString) return ''; // 如果沒有開賣時間，則不顯示
        const saleStart = new Date(saleStartDateString);

        const now = new Date();
        const diff = saleStart.getTime() - now.getTime(); // 毫秒差

        if (diff <= 0) {
            return '已開賣'; // 如果已經過期
        }

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let countdownString = '';
        if (days > 0) countdownString += `${days}天`;
        countdownString += `${hours.toString().padStart(2, '0')}:`;
        countdownString += `${minutes.toString().padStart(2, '0')}:`;
        countdownString += `${seconds.toString().padStart(2, '0')}`;

        return countdownString;
    };

    useEffect(() => {
        // 每秒更新倒數計時
        const timer = setInterval(() => {
            setCountdown(getRemainingTime(activity.sales_start_time));
        }, 1000);

        // 初始化一次
        setCountdown(getRemainingTime(activity.sales_start_time));

        // 清理定時器
        return () => clearInterval(timer);
    }, [activity.sales_start_time]); // 依賴於開賣時間，當它改變時重設計時器

    const handleCardClick = () => {
        console.log('點擊 CountdownActivityCard，導航至:', `/activity/${activity.id}`);
        navigate(`/activity/${activity.id}`);
    };

    const handleBuyNowClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡到卡片點擊事件
        console.log('點擊馬上搶購按鈕，導航至:', `/activity/${activity.id}/buy`);
        navigate(`/activity/${activity.id}/buy`); //fix later
    };

    const isSoldOut = countdown === '已開賣';

    return (
        <Card
            className="h-100 shadow-sm d-flex flex-row rounded-end-0" // 外側卡片：左邊圓角，右邊直角
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div
                className="card-image-container rounded-start-3 overflow-hidden h-100"
                style={{ flex: '1', position: 'relative' }}
            >
                <img
                    className="card-image"
                    src={activity.cover_image}
                    alt={activity.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} // 確保圖片覆蓋容器
                />
            </div>
            <Card.Body
                className="d-flex flex-column p-3 h-100 rounded-end-3" //Card.Body：右側圓角
                style={{ flex: '1', minHeight: '120px' }}
            >
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="card-badge">
                        <label className="text-sm-start">{activity.category}</label>
                    </div>
                    {activity.sales_start_time && (
                        <div className="d-flex align-items-center text-danger fw-bold small">
                            {isSoldOut ? (
                                <span className="text-success">已開賣</span>
                            ) : (
                                <>
                                    <i className="bi bi-clock-fill me-1"></i>
                                    <span>{countdown}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-${activity.id}`}>{activity.name}</Tooltip>}
                >
                    <h6
                        className="card-title mb-2 countdown-card-title"
                        title={activity.name}
                        style={{
                            overflow: 'hidden',
                            display: '-webkit-box', // 啟用基於 Webkit 的多行文本截斷
                            WebkitLineClamp: 2, // 限制為 2 行
                            WebkitBoxOrient: 'vertical', // 垂直方向排列
                            wordBreak: 'break-word' // 確保長單詞也能換行
                        }}
                    >
                        {activity.name}
                    </h6>
                </OverlayTrigger>
                <div className="mt-auto">
                    <div className="d-grid">
                        <Button
                            variant={isSoldOut ? 'success' : 'danger'} // 已開賣顯示綠色，未開賣顯示紅色
                            size="sm"
                            onClick={handleBuyNowClick}
                            disabled={!isSoldOut} // 如果還沒開賣，禁用按鈕
                        >
                            {isSoldOut ? '立即購買' : '尚未開賣'}
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CountdownActivityCard;
