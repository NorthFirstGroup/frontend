import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // 引入 React-Bootstrap 組件
import Banner from '../components/Banner';
import ActivitySection from '../components/ActivitySection';
import { Activity } from '../types/home';
import { ApiResponse } from '../types/ApiResponse';
import { Category, getCategories } from '../api/category';

const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [popularActivities, setPopularActivities] = useState<Activity[]>([]);
    const [trendingActivities, setTrendingActivities] = useState<Activity[]>([]);
    const [sellingOutActivities, setSellingOutActivities] = useState<Activity[]>([]);
    const [countdownActivities, setCountdownActivities] = useState<Activity[]>([]);

    useEffect(() => {
        (async () => {
            const results = await getCategories();
            setCategories(results);
        })();
    }, []);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const [popularRes, trendingRes, sellingOutRes, countdownRes] = await Promise.all([
                    fetch('/api/activities/popular'),
                    fetch('/api/activities/trending'),
                    fetch('/api/activities/selling-out'),
                    fetch('/api/activities/countdown')
                ]);
                const popularData: ApiResponse<Activity> = await popularRes.json();
                const trendingData: ApiResponse<Activity> = await trendingRes.json();
                const sellingOutData: ApiResponse<Activity> = await sellingOutRes.json();
                const countdownData: ApiResponse<Activity> = await countdownRes.json();
                setPopularActivities(popularData.data || []);
                setTrendingActivities(trendingData.data || []);
                setSellingOutActivities(sellingOutData.data || []);
                setCountdownActivities(countdownData.data || []);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };
        fetchActivities();
    }, []);

    return (
        <div className="home-page">
            <main>
                <Banner />
                {/* 活動分類 Icons */}
                <Container className="my-5">
                    <Row className="justify-content-center g-3">
                        {categories.map(category => (
                            <Col key={category.id} xs={6} sm={4} md={2} lg={1} className="text-center">
                                <div
                                    className="category-icon-wrapper p-2 border rounded-3 d-flex flex-column align-items-center justify-content-center"
                                    style={{ minHeight: '80px', cursor: 'pointer' }}
                                >
                                    <img src={category.media} alt="icon" style={{ width: 48, height: 48 }} />
                                    {/* 這裡可以放置 Icon component */}
                                    {/*<i className="bi bi-star-fill fs-4 text-warning"></i>{' '} */}
                                    {/* 範例：使用 Bootstrap Icons */}
                                    <small className="mt-1">{category.name}</small>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>

                <ActivitySection title="熱門推薦" activities={popularActivities} />
                <ActivitySection title="發燒主題" activities={trendingActivities} />
                <ActivitySection title="即將完售" activities={sellingOutActivities} />
                <ActivitySection title="開賣倒數中" activities={countdownActivities} />
            </main>
        </div>
    );
};

export default Home;
