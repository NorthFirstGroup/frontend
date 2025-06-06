import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // 引入 React-Bootstrap 組件
import { ActivityCategory } from '../types/home';
import TopBannerActivities from '../components/Home/Banner';
import HotTopicActivitiesSection from '../components/Home/HotTopicActivitiesSection';

const Home: React.FC = () => {
    const activityCategories: ActivityCategory[] = [
        '熱門',
        '音樂',
        '戲劇',
        '展覽',
        '電影',
        '運動',
        '親子',
        '舞蹈',
        '演唱會',
        '戶外'
    ];

    return (
        <div className="home-page">
            <main>
                <TopBannerActivities />
                {/* 活動分類 Icons */}
                <Container className="my-5">
                    <Row className="justify-content-center g-3">
                        {activityCategories.map(category => (
                            <Col key={category} xs={6} sm={4} md={2} lg={1} className="text-center">
                                <div
                                    className="category-icon-wrapper p-2 border rounded-3 d-flex flex-column align-items-center justify-content-center"
                                    style={{ minHeight: '80px', cursor: 'pointer' }}
                                >
                                    {/* 這裡可以放置 Icon component */}
                                    <i className="bi bi-star-fill fs-4 text-warning"></i>{' '}
                                    {/* 範例：使用 Bootstrap Icons */}
                                    <small className="mt-1">{category}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>

                <HotTopicActivitiesSection />
                {/*
                <ActivitySection title="發燒主題" activities={trendingActivities} />
                <ActivitySection title="即將完售" activities={sellingOutActivities} />
                <ActivitySection title="開賣倒數中" activities={countdownActivities} />
                */}
            </main>
        </div>
    );
};

export default Home;
