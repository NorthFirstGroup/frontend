import React from 'react';
import { Carousel, Container } from 'react-bootstrap'; // 引入 Carousel
import { BannerSlide } from '../types/home';

const Banner: React.FC = () => {
    const slides: BannerSlide[] = [
        { id: 1, image: '/banner1.jpg', title: '周杰倫嘉年華世界巡迴演唱會', link: '/activity/jaychou' },
        { id: 2, image: '/banner2.jpg', title: '國立故宮博物院特展', link: '/activity/npm-exhibition' },
        { id: 3, image: '/banner3.jpg', title: '張學友60+巡迴演唱會', link: '/activity/jackycheung' }
    ];

    return (
        <section className="banner-section my-4">
            <Container>
                <Carousel>
                    {slides.map(slide => (
                        <Carousel.Item key={slide.id}>
                            <img
                                className="d-block w-100"
                                src={slide.image}
                                alt={slide.title}
                                style={{ maxHeight: '450px', objectFit: 'cover' }} // 控制圖片高度
                            />
                            <Carousel.Caption className="text-start">
                                <a href={slide.link || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 className="text-white bg-dark bg-opacity-50 p-2 d-inline-block rounded">
                                        {slide.title}
                                    </h3>
                                </a>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </section>
    );
};

export default Banner;
