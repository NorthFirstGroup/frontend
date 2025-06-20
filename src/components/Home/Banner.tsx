import React, { useState, useEffect } from 'react';
import { Carousel, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BannerSlide } from '@type/home';
import { getTopBannerActivities } from '@api/frontpage';

import { ApiResponse } from '@type/ApiResponse';

const TopBannerActivities: React.FC = () => {
    const [slides, setSlides] = useState<BannerSlide[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const fetchTopBannerActivities = async () => {
            try {
                const response: ApiResponse<BannerSlide[]> = await getTopBannerActivities();
                if (response.data) {
                    setSlides(response.data.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching hot-topic activities:', err);
                setError('Failed to load hot-topic activities.');
            } finally {
                setLoading(false);
            }
        };
        fetchTopBannerActivities();
    }, []);

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Display error message
    }

    // const handleBannerClick = (activityId: number) => {
    //     const targetPath = `/activity/${activityId}`;
    //     console.log('點擊 Banner，導航至:', targetPath); // 方便調試
    // };

    // You can customize the layout here if "popular" section needs a different one
    // For now, it reuses the generic ActivitySection
    return (
        <section className="banner-section my-4">
            <Container>
                <Carousel>
                    {slides.map(slide => (
                        <Carousel.Item key={slide.id}>
                            <Link
                                to={`/activity/${slide.id}`}
                                // onClick={() => handleBannerClick(slide.id)} // debug:
                            >
                                <img
                                    className="d-block w-100 rounded-5"
                                    src={slide.cover_image}
                                    alt={slide.name}
                                    style={{ maxHeight: '450px', objectFit: 'cover', cursor: 'pointer' }} // 控制圖片高度
                                />
                            </Link>
                            <Carousel.Caption className="text-start">
                                <Link
                                    to={`/activity/${slide.id}`}
                                    // onClick={() => handleBannerClick(slide.id)}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <h3 className="text-white bg-dark bg-opacity-50 p-2 d-inline-block rounded">
                                        {slide.name}
                                    </h3>
                                </Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default TopBannerActivities;
