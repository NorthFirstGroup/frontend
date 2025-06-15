import { FrontpageActivity } from '@/types/home';
import { getHotTopicActivities, getRecommendActivities } from '@api/frontpage';
import { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';

const SearchPage = () => {
    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [recommends, setRecommends] = useState<FrontpageActivity[]>([]);

    // 若有 API 請改用 API
    const fetchActivities = useCallback(async () => {
        const response = await getHotTopicActivities();
        if (response.data) {
            setActivities(response.data); // 正確做法
        }
    }, []);

    const fetchRecommends = useCallback(async () => {
        const response = await getRecommendActivities();
        if (response.data) {
            setRecommends(response.data);
        }
    }, []);

    useEffect(() => {
        fetchActivities();
        fetchRecommends();
    }, [fetchActivities, fetchRecommends]);

    return (
        <div className="container py-4">
            <div
                className="mb-3 px-4 py-3"
                style={{
                    background: '#f8f8f8',
                    borderRadius: '20px 20px 0 0',
                    fontSize: '1rem'
                }}
            >
                <div>搜尋關鍵字：音樂活動</div>
                <div>篩選日期：2025/05/20 - 2026/05/20</div>
            </div>
            {/* 搜尋條與篩選 */}
            <div className="mb-3">
                <Row className="g-2 align-items-center">
                    <Col md={4}>
                        <input className="form-control" placeholder="地區搜尋" />
                    </Col>
                    <Col md={4}>
                        <input className="form-control" placeholder="分類搜尋" />
                    </Col>
                    <Col md={4}>
                        <input className="form-control" placeholder="日期搜尋" type="date" />
                    </Col>
                </Row>
            </div>

            <Row>
                {/* 左側活動列表 */}
                <Col lg={9}>
                    <div className="mb-3" style={{ fontSize: '20px' }}>
                        <div className="fw-bold ms-3" style={{ marginBottom: 24 }}>
                            找到 <span style={{ color: 'var(--gt-primary-600)' }}>{activities.length}</span> 個項目：
                        </div>
                        <div className="btn-group ms-3">
                            <button className="btn btn-outline-danger active">熱門</button>
                            <button className="btn btn-outline-secondary">最新</button>
                            <button className="btn btn-outline-secondary">近期演出</button>
                        </div>
                    </div>
                    <div className="list-group">
                        {activities.map(item => (
                            <div key={item.id} className="list-group-item mb-3 rounded shadow-sm">
                                <Row className="g-0 align-items-center">
                                    <Col md={4} style={{ paddingRight: 8 }}>
                                        <img src={item.cover_image} alt={item.name} className="img-fluid rounded" />
                                    </Col>
                                    <Col md={7} style={{ paddingLeft: 8 }}>
                                        <span
                                            className="badge mt-2"
                                            style={{
                                                backgroundColor: 'var(--gt-gray-50)',
                                                color: '#000',
                                                fontWeight: 500,
                                                marginBottom: 12
                                            }}
                                        >
                                            {item.category}
                                        </span>
                                        <div className="fw-bold" style={{ marginBottom: 85 }}>
                                            {item.name}
                                        </div>
                                        <div
                                            className="text-muted small"
                                            style={{
                                                marginBottom: 8
                                            }}
                                        >
                                            {item.start_time}
                                        </div>
                                        <div className="text-muted small">{item.vacancy}</div>
                                    </Col>
                                    <Col md={1} className="text-end">
                                        <button
                                            className="btn gradient-default-end rounded-circle"
                                            style={{
                                                border: '1px solid var(--gt-gradient-default-end)',
                                                color: 'var(--gt-gradient-default-end)'
                                            }}
                                        >
                                            <span className="fs-4">&rarr;</span>
                                        </button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </div>
                    {/* <div className="text-center mt-3">
                        <button className="btn btn-outline-primary">看更多</button>
                    </div> */}
                </Col>
                {/* 右側推薦與歷史 */}
                <Col lg={3}>
                    <div className="mb-4">
                        <div className="fw-bold mb-2">為你推薦</div>
                        {recommends.map(item => (
                            <div key={item.id} className="card mb-2">
                                <Row className="g-0 align-items-center">
                                    <Col xs={4} md={12}>
                                        <img
                                            src={item.cover_image}
                                            alt={item.category}
                                            className="img-fluid rounded-start"
                                        />
                                    </Col>
                                    <Col xs={8} md={12}>
                                        <div className="card-body py-2">
                                            <div className="small text-muted">{item.category}</div>
                                            <div className="fw-bold">{item.name}</div>
                                            <div className="text-muted small">{item.start_time}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                        <div className="text-end">
                            <a href="#" className="small">
                                看更多 &gt;
                            </a>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <div className="fw-bold mb-2">歷史紀錄</div>
                            <ul className="list-unstyled mb-0">
                                <li>
                                    <a href="#" className="text-decoration-none small">
                                        狀喔！狀狀x歐耶 雙人即興漫才{' '}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-decoration-none small">
                                        未來奇境：AI 藝術大展{' '}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-decoration-none small">
                                        時代重現！1990年代 經典金曲夜{' '}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-decoration-none small">
                                        綻FUN古典一錠聲銅管五重奏{' '}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SearchPage;
