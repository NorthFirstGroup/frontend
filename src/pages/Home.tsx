import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // 引入 React-Bootstrap 組件
import { Category, getCategories } from '../api/category';
import TopBannerActivities from '../components/Home/Banner';
import HotTopicActivitiesSection from '../components/Home/HotTopicActivitiesSection';
import IconWrapper from '../components/IconWrapper';
import { useActivityFilterNavigation } from '../utils/navigationUtils';

const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        (async () => {
            const results = await getCategories();
            setCategories(results);
        })();
    }, []);

    const navigateToActivityListWithFilters = useActivityFilterNavigation();

    return (
        <div className="home-page">
            <main>
                <TopBannerActivities />
                {/* 活動分類 Icons */}
                <Container className="my-5">
                    <Row className="justify-content-center g-3">
                        {categories.map(category => (
                            <Col key={category.id} xs={6} sm={4} md={2} lg={1} className="text-center">
                                <div
                                    className="category-icon-wrapper p-2 rounded-3 d-flex flex-column align-items-center justify-content-center"
                                    style={{ minHeight: '80px', cursor: 'pointer' }}
                                    onClick={() => navigateToActivityListWithFilters({ category: category.name })}
                                >
                                    <IconWrapper size={72} bgColor="#F6F6F6">
                                        {' '}
                                        {/* Now IconWrapper handles the background and centering */}
                                        <img src={category.media} alt="icon" style={{ width: 48, height: 48 }} />
                                    </IconWrapper>
                                    <small className="mt-1">{category.name}</small>
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
