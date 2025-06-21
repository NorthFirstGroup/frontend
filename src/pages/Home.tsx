import React, { Suspense, useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap'; // 引入 React-Bootstrap 組件
import { Category, getCategories } from '../api/category';
const TopBannerActivities = React.lazy(() => import('../components/Home/Banner'));
const HotTopicActivitiesSection = React.lazy(() => import('../components/Home/HotTopicActivitiesSection'));
const SellingOutActivitiesSection = React.lazy(() => import('../components/Home/SellingOutActivitySection'));
const CountdownActivitiesSection = React.lazy(() => import('../components/Home/CountdownActivitiesSection'));
const NewActivitiesSection = React.lazy(() => import('../components/Home/NewActivitiesSection'));
import IconWrapper from '../components/IconWrapper';
import { useActivityFilterNavigation } from '../utils/navigationUtils';

// Function to debounce resize events
const debounce = (func: Function, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

    useEffect(() => {
        (async () => {
            const results = await getCategories();
            setCategories(results);
        })();

        const handleResize = debounce(() => {
            setIsMobile(window.innerWidth < 576);
        }, 150); // Debounce by 150ms

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigateToActivityListWithFilters = useActivityFilterNavigation();
    const iconWrapperSize = isMobile ? 48 : 72;

    return (
        <div className="home-page">
            <main>
                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                    <TopBannerActivities />
                </Suspense>

                {/* 活動分類 Icons */}
                <Container className="my-5">
                    <Row className="justify-content-center g-3">
                        {categories.map(category => (
                            <Col key={category.id} xs={3} md={2} lg={1} className="text-center">
                                <div
                                    className="category-icon-wrapper p-2 rounded-3 d-flex flex-column align-items-center justify-content-center"
                                    style={{ minHeight: '80px', cursor: 'pointer' }}
                                    onClick={() =>
                                        navigateToActivityListWithFilters({ categoryId: category.id.toString() })
                                    }
                                >
                                    <IconWrapper size={iconWrapperSize} bgColor="#F6F6F6">
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

                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                    <HotTopicActivitiesSection />
                </Suspense>

                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                    <NewActivitiesSection />
                </Suspense>

                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                    <SellingOutActivitiesSection />
                </Suspense>

                <Suspense fallback={<Spinner animation="border" variant="primary" />}>
                    <CountdownActivitiesSection />
                </Suspense>
            </main>
        </div>
    );
};

export default Home;
