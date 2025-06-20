// src/components/ActivityCard.tsx
import React from 'react';
import { Card, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { FrontpageActivity } from '../../types/home';
import './ActivityCard.css';
import { activityStatusMap } from '../../api/organizer';

interface ActivityCardProps {
    activity: FrontpageActivity;
    hasBorder?: boolean;
    borderColor?: string;
    hasShadow?: boolean;
    showRemainingSeats?: boolean;

    isEditable?: boolean;
    onEdit?: (activityId: number) => void;
    onDelete?: (activityId: number, activityName: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
    activity,
    hasBorder = false,
    borderColor = '#E0E0E0',
    hasShadow = true,
    showRemainingSeats = false,
    isEditable = false, // Default to false
    onEdit,
    onDelete
}) => {
    const navigate = useNavigate();

    // 隨機生成剩餘席位數（1 到 30）- test only
    const remainingSeats = showRemainingSeats ? Math.floor(Math.random() * 30) + 1 : 0;

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

    const cardWrapperStyle: React.CSSProperties = {
        border: hasBorder ? `1px solid ${borderColor}` : 'none',
        cursor: 'pointer'
        // 可以選擇性地移除 shadow-sm 或在有邊框時移除它
        // boxShadow: hasBorder ? 'none' : '0 .125rem .25rem rgba(0,0,0,.075)',
    };

    const handleCardClick = () => {
        // 導航到 /Activity/{activity.id} 路徑
        if (!isEditable) {
            // Only navigate if not in editable mode
            console.log('點擊 ActivityCard，導航至:', `/activity/${activity.id}`); // 方便調試
            navigate(`/activity/${activity.id}`);
        }
    };

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the card's onClick from firing
        console.log('編輯活動 ID:', activity.id);
        if (onEdit) {
            onEdit(activity.id);
        } else {
            // Default navigation if no onEdit handler is provided
            navigate(`/organizer/activity-management/${activity.id}`);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the card's onClick from firing
        onDelete && onDelete(activity.id, activity.name); // Call if handler exists
    };

    return (
        <Card
            className={`card-wrapper ${hasShadow ? 'shadow-sm' : ''}`}
            style={cardWrapperStyle}
            onClick={handleCardClick}
        >
            <div className="card-image-container">
                <img className="card-image" src={activity.cover_image} alt={activity.name} />
                {/* Apply overlay badge only when it's coming soon */}
                {showRemainingSeats && remainingSeats > 0 && (
                    <span
                        className="badge bg-danger position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill"
                        style={{
                            fontSize: '0.85em',
                            fontWeight: 'bold',
                            borderRadius: '0.25rem',
                            zIndex: 10
                        }}
                    >
                        剩 {remainingSeats} 席
                    </span>
                )}
            </div>
            <div className="card-info">
                <div className="card-top-row">
                    <div className="card-badge">
                        {/* <span className="card-badge-text">{activity.category}</span> */}
                        <label className="text-sm-start">{activity.category}</label>
                    </div>
                    {isEditable && ( // Conditionally render buttons
                        <div className="card-action-buttons">
                            {activity?.status && (
                                <div className="card-badge">
                                    {/* <span className="card-badge-text">{activity.category}</span> */}
                                    <label
                                        className={`text-sm-start ${
                                            activity.status === activityStatusMap[1]
                                                ? 'status-draft'
                                                : activity.status === activityStatusMap[2]
                                                  ? 'status-published'
                                                  : activity.status === activityStatusMap[3]
                                                    ? 'status-rejected'
                                                    : activity.status === activityStatusMap[4]
                                                      ? 'status-finished'
                                                      : '' // Default or no specific color if status doesn't match
                                        }`}
                                    >
                                        {activity.status}
                                    </label>
                                </div>
                            )}
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                className="action-btn"
                                onClick={handleEditClick}
                            >
                                <FaEdit />
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="action-btn"
                                onClick={handleDeleteClick}
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    )}
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
