import { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';

type Activity = {
    id: number;
    title: string;
    date: string;
    location: string;
    img: string;
    tag: string;
};

type Recommend = {
    id: number;
    title: string;
    date: string;
    img: string;
    tag: string;
};

// 假設你有 API 可以取得活動與推薦資料
// import { getActivityList, getRecommendList } from '@api/activity';

const mockData: Activity[] = [
    {
        id: 1,
        title: '星空音樂會',
        date: '2025/07/12',
        location: '大安森林公園',
        img: '../../../src/assets/searchPageMock/search01.svg',
        tag: '音樂'
    }
    // ... 其他活動資料
];

const recommendData: Recommend[] = [
    {
        id: 1,
        title: '表演 | 脫口秀',
        date: '2025/03/22 - 2025/03/23',
        img: '../../../src/assets/searchPageMock/search_side01.svg',
        tag: '推薦'
    }
    // ... 其他推薦資料
];

const SearchPage = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [recommends, setRecommends] = useState<Recommend[]>([]);

    // 若有 API 請改用 API
    const fetchActivities = useCallback(async () => {
        // const res = await getActivityList();
        // setActivities(res.results);
        setActivities(mockData);
    }, []);

    const fetchRecommends = useCallback(async () => {
        // const res = await getRecommendList();
        // setRecommends(res.results);
        setRecommends(recommendData);
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
                                        <img src={item.img} alt={item.title} className="img-fluid rounded" />
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
                                            {item.tag}
                                        </span>
                                        <div className="fw-bold" style={{ marginBottom: 85 }}>
                                            {item.title}
                                        </div>
                                        <div
                                            className="text-muted small"
                                            style={{
                                                marginBottom: 8
                                            }}
                                        >
                                            {item.date}
                                        </div>
                                        <div className="text-muted small">{item.location}</div>
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
                    <div className="text-center mt-3">
                        <button className="btn btn-outline-primary">看更多</button>
                    </div>
                </Col>
                {/* 右側推薦與歷史 */}
                <Col lg={3}>
                    <div className="mb-4">
                        <div className="fw-bold mb-2">為你推薦</div>
                        {recommends.map(item => (
                            <div key={item.id} className="card mb-2">
                                <Row className="g-0 align-items-center">
                                    <Col xs={4} md={12}>
                                        <img src={item.img} alt={item.title} className="img-fluid rounded-start" />
                                    </Col>
                                    <Col xs={8} md={12}>
                                        <div className="card-body py-2">
                                            <div className="small text-muted">{item.tag}</div>
                                            <div className="fw-bold">{item.title}</div>
                                            <div className="text-muted small">{item.date}</div>
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
