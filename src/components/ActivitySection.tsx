// src/components/ActivitySection.tsx
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useActivityFilterNavigation } from '../utils/navigationUtils'; // Adjust path as needed
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import ActivityCard from './ActivityCard';
import IconWrapper from './IconWrapper';
import { FrontpageActivity } from '../types/home';

import './ActivitySection.scss';

interface ActivitySectionProps {
    title: string;
    subtitle?: string;
    activities: FrontpageActivity[];
    iconSvg?: React.ElementType;
    initialRows?: number;
    cardsPerRow?: number;
    categoryKeyword?: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
    title,
    subtitle,
    activities,
    iconSvg: IconSvgComponent,
    initialRows = 2,
    cardsPerRow = 3,
    categoryKeyword
}) => {
    // const navigate = useNavigate(); // Initialize useNavigate hook
    const navigateToActivityListWithFilters = useActivityFilterNavigation();

    if (activities.length === 0) {
        return null; // 如果沒有活動，則不顯示此區塊
    }

    const initialCardsToShow = initialRows * cardsPerRow;

    // Determine activities to display (always limited initially)
    const displayedActivities = activities.slice(0, initialCardsToShow);

    // Check if there are more activities than initially displayed
    const hasMore = activities.length > initialCardsToShow;

    const handleViewMoreClick = () => {
        // if (categoryKeyword) {
        //     navigate(`/activity?keyword=${encodeURIComponent(categoryKeyword)}`);
        // } else {
        //     // Fallback or a default behavior if no categoryKeyword is provided
        //     // For example, navigate to a general activity listing page
        //     navigate('/activity');
        // }
        navigateToActivityListWithFilters({ keyword: categoryKeyword || '' });
    };

    const renderTitle = () => {
        const titleParts =
            categoryKeyword && title.includes(categoryKeyword)
                ? title.split(new RegExp(`(${categoryKeyword})`, 'gi'))
                : [title]; // Ensure it's always an array for map

        return (
            <h2 className="d-flex text-start mb-0 align-items-center gap-2">
                {titleParts.map((part, index) =>
                    part.toLowerCase() === categoryKeyword?.toLowerCase() ? (
                        <span key={index} className="text-primary">
                            {part}
                        </span>
                    ) : (
                        <span key={index}>{part}</span>
                    )
                )}
                {IconSvgComponent && (
                    <IconWrapper
                        size={40} // Default size (40px width/height)
                        bgColor="#FFEDD3" // Default background color
                    >
                        {' '}
                        {/* Now IconWrapper handles the background and centering */}
                        <IconSvgComponent size={20} color="#E5540B" /> {/* Pass size/color to the icon itself */}
                    </IconWrapper>
                )}
            </h2>
        );
    };

    return (
        <section className="activity-section my-5">
            <Container>
                {renderTitle()}
                {(subtitle || hasMore) && (
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="text-start fs-5 mb-4">{subtitle}</p>
                        {hasMore && (
                            <Button
                                variant="link" // 使用 Bootstrap 的 link 變體來移除預設樣式
                                onClick={handleViewMoreClick}
                                className="button-text-icon-style"
                            >
                                看更多 <FaArrowRight className="icon-arrow" />
                            </Button>
                        )}
                    </div>
                )}
                <Row xs={1} md={2} lg={cardsPerRow} className="g-4 justify-content-center">
                    {displayedActivities.map(activity => (
                        <Col key={activity.id} className="d-flex">
                            <ActivityCard activity={activity} hasBorder={false} hasShadow={false} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default ActivitySection;
