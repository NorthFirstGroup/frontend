import React, { useState, useEffect, useRef } from 'react';
import { Container, Col, Spinner } from 'react-bootstrap';
import ActivitySectionHeader from './ActivitySectionHeader';
import ActivityCard from './ActivityCard';
import { ApiResponse } from '@type/ApiResponse';
import { FrontpageActivity } from '@type/home';
import { getNewArrivalActivities } from '@api/frontpage';
import { FaFireAlt } from 'react-icons/fa';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { useActivityFilterNavigation } from '@utils/navigationUtils';
import './NewArrivalSection.scss';

const NewActivitiesSection: React.FC = () => {
    const navigateToActivityListWithFilters = useActivityFilterNavigation();

    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const fetchNewArrivalActivities = async () => {
            try {
                const response: ApiResponse<FrontpageActivity[]> = await getNewArrivalActivities();
                if (response.data) {
                    setActivities(response.data.slice(0, 10)); //只取十筆
                }
            } catch (err) {
                console.error('Error fetching new-arrival activities:', err);
                setError('Failed to load new-arrival activities.');
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivalActivities();
    }, []);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Calculate scroll amount based on the width of a single card + its margin
            const cardElement = scrollContainerRef.current.querySelector('.activity-carousel-item');
            const cardWidth = cardElement ? cardElement.clientWidth : scrollContainerRef.current.clientWidth / 2; //g-4

            if (direction === 'left') {
                scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            } else {
                scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }
    };

    // 監聽滾動和視窗大小變化
    useEffect(() => {
        const currentRef = scrollContainerRef.current;
        let timeoutId: any;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
            // 初始檢查
            timeoutId = setTimeout(() => {
                checkScrollButtons();
            }, 100);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
                clearTimeout(timeoutId);
            }
        };
    }, [activities]); // 當活動數據變化時也重新檢查

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Display error message
    }

    if (activities.length === 0) {
        return null;
    }

    const handleViewMoreClick = () => {
        navigateToActivityListWithFilters({
            tag: 'NewArrivals',
            level: '9999'
        });
    };

    return (
        <section className="activity-section my-5">
            <Container>
                {/* 套用 ActivitySectionHeader */}
                <ActivitySectionHeader
                    title="全新登場"
                    subtitle="獨家登場！各類活動新品上架，走在潮流最前端。"
                    iconSvg={FaFireAlt}
                    hasMore={true}
                    searchKeyword="全新"
                    onViewMoreClick={handleViewMoreClick}
                />

                <div className="position-relative">
                    <button
                        className="carousel-nav-button left"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                    >
                        <GoChevronLeft style={{ color: '#ffffff' }} />
                    </button>
                    <div ref={scrollContainerRef} className="activity-carousel-container">
                        {activities.map(activity => (
                            <Col key={activity.id} xs={10} sm={6} md={4} lg={3} className="me-4">
                                <ActivityCard activity={activity} />
                            </Col>
                        ))}
                    </div>
                    <button
                        className="carousel-nav-button right"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                    >
                        <GoChevronRight style={{ color: '#ffffff' }} />
                    </button>
                </div>
            </Container>
        </section>
    );
};

export default NewActivitiesSection;
