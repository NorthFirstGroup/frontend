import { FrontpageActivity } from '@/types/home';
import { getRecommendActivities } from '@api/frontpage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { DateRange } from 'react-date-range';
import activityAPI from '@api/activityAPI';
import { format } from 'date-fns';
import { Area, getAvailAreas } from '@api/availArea';
import { Category, getCategories } from '@api/category';
import SearchFilter from '@components/searchFilter';
import CategoryFilter from '@components/categoryFilter';

import calendarIcon from '../../assets/searchPageMock/calendar.svg';
import locationIcon from '../../assets/searchPageMock/location.svg';

const SearchPage = () => {
    const [activities, setActivities] = useState<any[]>([]);
    const [recommends, setRecommends] = useState<FrontpageActivity[]>([]);
    const [location, setLocation] = useState<number[]>([]); // 輸入地區搜尋
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // 輸入分類搜尋
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // 控制日期選擇器顯示
    const [availAreas, setAvailAreas] = useState<Area[]>([]); // 可用地區清單
    const [categories, setCategories] = useState<Category[]>([]); // 可用分類清單
    const [showLocationFilter, setLocationShowFilter] = useState(false); // 地區搜尋控制顯示
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);

    // 取得單一參數
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    // Get categoryId from URL
    const categoryIdFromUrl = searchParams.get('categoryId');

    //首頁會傳入 categoryId, 不使用 useCallback
    const fetchSearchALL = useCallback(async () => {
        console.log('執行 fetchSearchALL，當前 selectedCategories:', selectedCategories);
        let searchCondition = {
            keyword: keyword || '', // 關鍵字搜尋
            category: selectedCategories.join(','), // 多選分類
            location: location.join(','), // 轉成字串
            startDate: dateRange[0].startDate.toISOString(),
            endDate: dateRange[0].endDate.toISOString()
        };
        const response = await activityAPI.getActivitySearch(searchCondition);
        if (response.results) {
            setActivities(response.results);
        }
    }, [keyword, selectedCategories, location, dateRange]);

    // 分類清單
    const fetchGetCategories = useCallback(async () => {
        const response = await getCategories();
        if (response) {
            setCategories(response);
            if (categoryIdFromUrl) {
                const preSelectedCategory = response.find(cat => cat.id === parseInt(categoryIdFromUrl));
                if (preSelectedCategory && !selectedCategories.includes(preSelectedCategory.id)) {
                    // Only update if it's not already selected to prevent infinite loop on re-renders
                    setSelectedCategories([preSelectedCategory.id]);
                }
            }
        }
    }, [categoryIdFromUrl, selectedCategories]);

    // 地區清單
    const fetchGetAvailAreas = useCallback(async () => {
        const response = await getAvailAreas();
        if (response.data?.results) {
            setAvailAreas(response.data.results);
        }
    }, []);

    // 推薦
    const fetchRecommends = useCallback(async () => {
        const response = await getRecommendActivities();
        if (response.data) {
            setRecommends(response.data);
        }
    }, []);

    // 用於處理點擊外部的函式
    const datePickerRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
        const listener = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    };

    const navigate = useNavigate();
    const handleCardClick = (activity_id: string) => {
        navigate(`/activity/${activity_id}`);
    };

    // First useEffect for fetching static data and initial URL parameter handling
    useEffect(() => {
        fetchRecommends();
        fetchGetAvailAreas();
        fetchGetCategories();
        const cleanup = handleClickOutside(datePickerRef, () => {
            setIsDatePickerOpen(false);
        });
        // 清理事件監聽器
        return cleanup;
    }, [fetchRecommends, fetchGetAvailAreas, fetchGetCategories]);

    // Second useEffect to trigger search when keyword or filter states change
    useEffect(() => {
        // This useEffect will run when `keyword`, `selectedCategories`, `location`, or `dateRange` change.
        // It ensures fetchSearchALL uses the most up-to-date filter states.
        if (categories.length > 0) {
            // Ensure categories are loaded before attempting to search with category filter
            fetchSearchALL();
        }
    }, [keyword, selectedCategories, location, dateRange, categories, fetchSearchALL, categoryIdFromUrl]); // Added categories to dependency

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
                <div>搜尋關鍵字：{keyword}</div>
                <div>
                    篩選日期：{format(dateRange[0].startDate, 'yyyy/MM/dd')} -{' '}
                    {format(dateRange[0].endDate, 'yyyy/MM/dd')}{' '}
                </div>
            </div>
            {/* 搜尋條與篩選 */}
            <div className="mb-3">
                <Row className="g-2 align-items-center">
                    <Col md={4}>
                        <input
                            className="form-control"
                            placeholder="請選擇地區"
                            value={
                                location.length === 0
                                    ? ''
                                    : availAreas
                                          .filter(a => location.includes(a.id))
                                          .map(a => a.name)
                                          .join('、')
                            }
                            readOnly
                            onClick={() => setLocationShowFilter(true)}
                            style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                            disabled={showCategoryFilter}
                        />
                        {showLocationFilter && (
                            <SearchFilter
                                availAreas={availAreas}
                                onChange={setLocation}
                                onConfirm={() => setLocationShowFilter(false)}
                            />
                        )}{' '}
                    </Col>
                    <Col md={4}>
                        <input
                            className="form-control"
                            placeholder="請選擇分類搜尋"
                            value={
                                selectedCategories.length === 0
                                    ? ''
                                    : categories
                                          .filter(c => selectedCategories.includes(c.id))
                                          .map(c => c.name)
                                          .join('、')
                            }
                            readOnly
                            onClick={() => setShowCategoryFilter(true)}
                            style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                            disabled={showLocationFilter}
                        />
                        {showCategoryFilter && (
                            <CategoryFilter
                                categories={categories}
                                selected={selectedCategories}
                                onChange={setSelectedCategories}
                                onConfirm={() => setShowCategoryFilter(false)}
                            />
                        )}
                    </Col>
                    <Col md={4}>
                        <input
                            className="form-control"
                            placeholder="選擇日期範圍"
                            value={`${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`}
                            readOnly
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        />
                        {isDatePickerOpen && (
                            <div ref={datePickerRef} style={{ position: 'absolute', zIndex: 1000 }}>
                                <DateRange
                                    onChange={(ranges: any) => setDateRange([ranges.selection])}
                                    ranges={dateRange}
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                />
                            </div>
                        )}
                    </Col>
                </Row>
                <div className="text-end mt-3">
                    <button className="btn btn-primary" onClick={() => fetchSearchALL()}>
                        搜尋
                    </button>
                </div>
            </div>

            <Row>
                {/* 左側活動列表 */}
                <Col lg={9}>
                    <div className="mb-3" style={{ fontSize: '20px' }}>
                        <div className="fw-bold ms-3" style={{ marginBottom: 24 }}>
                            找到 <span style={{ color: 'var(--gt-primary-600)' }}>{activities.length}</span> 個項目：
                        </div>
                        {/* <div className="btn-group ms-3">
                            <button className="btn btn-outline-danger" onClick={() => fetchSearchALL()}>
                                熱門
                            </button>
                            <button className="btn btn-outline-secondary active" onClick={() => fetchSearchALL()}>
                                最新
                            </button>
                            <button className="btn btn-outline-secondary" onClick={() => fetchSearchALL()}>
                                近期演出
                            </button>
                        </div> */}
                    </div>
                    <div className="list-group">
                        {activities.map(item => (
                            <div key={item.id} className="list-group-item mb-3 rounded shadow-sm">
                                <Row className="g-0 align-items-center">
                                    <Col md={4} style={{ paddingRight: 8 }}>
                                        <img src={item.coverImage} alt={item.name} className="img-fluid rounded" />
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
                                            {item.category.name}
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
                                            <img src={calendarIcon} style={{ verticalAlign: 'sub' }} alt="" />
                                            {format(new Date(item.startTime), 'yyyy/MM/dd')}
                                        </div>
                                        {item.sites.map((site: any, index: number) => (
                                            <span key={index}>
                                                <img src={locationIcon} style={{ verticalAlign: 'sub' }} alt="" />
                                                {site.name}
                                            </span>
                                        ))}
                                    </Col>
                                    <Col md={1} className="text-end">
                                        <button
                                            className="btn gradient-default-end rounded-circle"
                                            style={{
                                                border: '1px solid var(--gt-gradient-default-end)',
                                                color: 'var(--gt-gradient-default-end)'
                                            }}
                                        >
                                            <span className="fs-4" onClick={() => handleCardClick(item.id)}>
                                                &rarr;
                                            </span>
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
                                            <div className="text-muted small">
                                                {format(new Date(item.start_time || ''), 'yyyy/MM/dd') +
                                                    '- ' +
                                                    format(new Date(item.end_time || ''), 'yyyy/MM/dd')}
                                            </div>
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
