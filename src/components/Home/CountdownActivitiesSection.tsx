import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ActivitySectionHeader from './ActivitySectionHeader';
import CountdownActivityCard from './CountdownActivityCard';
import { ApiResponse } from '@type/ApiResponse';
import { FrontpageActivity } from '@type/home';
import { getCountdownActivities } from '@api/frontpage';
import { FaClock } from 'react-icons/fa6';

const CountdownActivitiesSection: React.FC = () => {
    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    //const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCountdownActivities = async () => {
            try {
                const response: ApiResponse<FrontpageActivity[]> = await getCountdownActivities();
                if (!response.message) {
                    // 只篩選有 sales_start_time 且尚未開賣的活動
                    const comingSoon = (response.data || []).filter(
                        activity => activity.sales_start_time && new Date(activity.sales_start_time) > new Date()
                    );
                    setActivities(comingSoon);
                }
            } catch (err) {
                console.error('Error fetching countdown activities:', err);
                //setError('Failed to load countdown activities.');
            } finally {
                setLoading(false);
            }
        };
        fetchCountdownActivities();
    }, []);

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    // if (error) {
    //     return <div className="text-danger">Error: {error}</div>;
    // }

    return (
        <section className="activity-section my-5">
            <Container>
                <ActivitySectionHeader
                    title="開賣倒數中"
                    subtitle="搶先一步卡位！這些活動馬上開賣！"
                    iconSvg={FaClock}
                    hasMore={false}
                    searchKeyword="開賣"
                />

                {activities.length !== 0 ? (
                    <Row xs={1} md={2} lg={2} className="g-4">
                        {' '}
                        {/* xs=1, md=2, lg=2 確保每排兩張卡片 */}
                        {activities.map(activity => (
                            <Col key={activity.id}>
                                <CountdownActivityCard activity={activity} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>查無此類活動</p>
                )}
            </Container>
        </section>
    );
};

export default CountdownActivitiesSection;
