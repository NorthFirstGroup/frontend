import React, { useState, useEffect } from 'react';
import { Carousel, Container } from 'react-bootstrap'; // 引入 Carousel
import { BannerSlide } from '../../types/home';
import { getTopBannerActivities } from '../../api/frontpage';

import { ApiResponse } from '../../types/ApiResponse';

const TopBannerActivities: React.FC = () => {
    const [slides, setSlides] = useState<BannerSlide[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const fetchTopBannerActivities = async () => {
            try {
                const response: ApiResponse<BannerSlide[]> = await getTopBannerActivities();
                if (response.data) {
                    setSlides(response.data);
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
        return <div>Loading banner activities...</div>; // Or a more sophisticated spinner
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Display error message
    }

    // You can customize the layout here if "popular" section needs a different one
    // For now, it reuses the generic ActivitySection
    return (
        <section className="banner-section my-4">
            <Container>
                <Carousel>
                    {slides.map(slide => (
                        <Carousel.Item key={slide.id}>
                            <img
                                className="d-block w-100"
                                src={slide.cover_image}
                                alt={slide.name}
                                style={{ maxHeight: '450px', objectFit: 'cover' }} // 控制圖片高度
                            />
                            <Carousel.Caption className="text-start">
                                {/* <a href={slide.link || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 className="text-white bg-dark bg-opacity-50 p-2 d-inline-block rounded">
                                        {slide.name}
                                    </h3>
                                </a> */}
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default TopBannerActivities;
