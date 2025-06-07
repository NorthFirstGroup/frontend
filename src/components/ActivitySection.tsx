// src/components/ActivitySection.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ActivityCard from './ActivityCard';
import { FrontpageActivity } from '../types/home';

interface ActivitySectionProps {
    title: string;
    activities: FrontpageActivity[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ title, activities }) => {
    if (activities.length === 0) {
        return null; // 如果沒有活動，則不顯示此區塊
    }

    return (
        <section className="activity-section my-5">
            <Container>
                <h2 className="text-center mb-4">{title}</h2>
                <Row xs={1} md={2} lg={4} className="g-4">
                    {' '}
                    {/* g-4 控制間距 */}
                    {activities.map(activity => (
                        <Col key={activity.id}>
                            <ActivityCard activity={activity} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default ActivitySection;
