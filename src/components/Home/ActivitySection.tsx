// src/components/ActivitySection.tsx
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useActivityFilterNavigation } from '../../utils/navigationUtils';
import { Container, Row, Col } from 'react-bootstrap';
import ActivitySectionHeader from './ActivitySectionHeader';
import ActivityCard from './ActivityCard';
import { FrontpageActivity } from '../../types/home';

interface ActivitySectionProps {
    title: string;
    subtitle?: string;
    activities: FrontpageActivity[];
    iconSvg?: React.ElementType;
    initialRows?: number;
    cardsPerRow?: number;
    searchKeyword?: string;
    showRemainingSeats: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
    title,
    subtitle,
    activities,
    iconSvg: IconSvgComponent,
    initialRows = 2,
    cardsPerRow = 3,
    searchKeyword,
    showRemainingSeats
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
        navigateToActivityListWithFilters({ keyword: searchKeyword || '' });
    };

    return (
        <section className="activity-section my-5">
            <Container>
                <ActivitySectionHeader
                    title={title}
                    subtitle={subtitle}
                    iconSvg={IconSvgComponent}
                    hasMore={hasMore}
                    searchKeyword={searchKeyword}
                    onViewMoreClick={handleViewMoreClick}
                />
                <Row xs={1} md={2} lg={cardsPerRow} className="g-4 justify-content-center">
                    {displayedActivities.map(activity => (
                        <Col key={activity.id} className="d-flex">
                            <ActivityCard
                                activity={activity}
                                hasBorder={false}
                                hasShadow={false}
                                showRemainingSeats={showRemainingSeats}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default ActivitySection;
