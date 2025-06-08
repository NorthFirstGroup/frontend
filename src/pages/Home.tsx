import React, { Suspense, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // 引入 React-Bootstrap 組件
import { Category, getCategories } from '../api/category';
const TopBannerActivities = React.lazy(() => import('../components/Home/Banner'));
const HotTopicActivitiesSection = React.lazy(() => import('../components/Home/HotTopicActivitiesSection'));
const SellingOutActivitiesSection = React.lazy(() => import('../components/Home/SellingOutActivitySection'));
const CountdownActivitiesSection = React.lazy(() => import('../components/Home/CountdownActivitiesSection'));
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
                <Suspense fallback={<div>載入 TopBannerActivities 中...</div>}>
                    <TopBannerActivities />
                </Suspense>

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

                <Suspense fallback={<div>載入 HotTopicActivitiesSection 中...</div>}>
                    <HotTopicActivitiesSection />
                </Suspense>

                <Suspense fallback={<div>載入 SellingOutActivitiesSection 中...</div>}>
                    <SellingOutActivitiesSection />
                </Suspense>

                <Suspense fallback={<div>載入 CountdownActivitiesSection 中...</div>}>
                    <CountdownActivitiesSection />
                </Suspense>
                {/*
                <ActivitySection title="發燒主題" activities={trendingActivities} />
                */}
            </main>
        </div>
    );
};

export default Home;
