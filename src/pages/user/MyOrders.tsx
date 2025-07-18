import { useCallback, useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // *** 新增 useSearchParams ***
import { Row, Col, Accordion, Button, Image, Spinner, Alert, Pagination as BTPagination } from 'react-bootstrap';
import { OrderRecords, OrderListData, getOrderList } from '@api/order';
import { FaCopy, FaUpRightFromSquare, FaLocationDot  } from 'react-icons/fa6'; // 引入複製和外連圖示

import styles from '@components/Order/MyOrders.module.css';
import { Toaster } from 'react-hot-toast';
import { showToast } from '@utils/customToast';
// import MemberPanelNav from '@components/MemberPanelNav'; // 引入新的組件名和路徑

const formatDateTime = (dateInput: Date | string | null | undefined): string => {
    if (!dateInput) {
        return '';
    }

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.error('Invalid Date object provided to formatDateTime:', dateInput);
        return 'N/A';
    }

    const formattedDate = date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const formattedTime = date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${formattedDate} ${formattedTime}`;
};

const MyOrders = () => {
    const [orders, setOrders] = useState<OrderRecords[]>([]);
    // const [_pagination, _setPagination] = useState<Pagination>(); // 使用 pagination 狀態，如果需要分頁功能
    const [loading, setLoading] = useState(true); // 載入狀態
    const [error, setError] = useState<string | null>(null); // 錯誤狀態

    const [searchParams, setSearchParams] = useSearchParams(); //獲取 searchParams 和 setSearchParams

    // 從 URL 讀取 currentPage，如果 URL 沒有則預設為 1
    const currentPage = useMemo(() => {
        const page = parseInt(searchParams.get('page') || '1', 10);
        return isNaN(page) || page < 1 ? 1 : page;
    }, [searchParams]); // 依賴 searchParams，當 URL 變化時重新計算


    // 從 URL 讀取 pageSize，如果 URL 沒有則預設為 10
    const pageSize = useMemo(() => {
        const size = parseInt(searchParams.get('page_size') || '10', 10);
        return isNaN(size) || size < 1 ? 10 : size;
    }, [searchParams]); // 依賴 searchParams，當 URL 變化時重新計算

    const [totalOrders, setTotalOrders] = useState<number>(0); // 總訂單數量，從後端 API 取得
    // --- 改為使用 useSearchParams 管理分頁狀態 ---

    // 計算總頁數
    const totalPages = useMemo(() => {
        // 避免除以零的情況
        if (pageSize === 0) return 1;
        return Math.ceil(totalOrders / pageSize);
    }, [totalOrders, pageSize]); // 依賴 totalOrders 和 pageSize

    // 獲取訂單列表的函數
    const fetchOrderList = useCallback(async () => {
        setLoading(true); // 開始載入
        setError(null); // 清除之前的錯誤訊息
        try {
            const res: OrderListData | null = await getOrderList(currentPage, pageSize);
            // console.log(res);
            if (res) {
                setOrders(res.results);
                // 正確使用 res.pagination.total 來設定總訂單數量
                setTotalOrders(res.pagination?.total || 0);
            } else {
                setError('無法載入訂單列表。');
                setOrders([]);
                setTotalOrders(0);
            }
        } catch (err: any) {
            console.error('載入訂單列表失敗:', err);
            setError(err.message || '載入訂單時發生網路錯誤。');
        } finally {
            setLoading(false); // 結束載入
        }

    }, [currentPage, pageSize]); // currentPage 和 pageSize (現在從 URL 獲取)

    useEffect(() => {
        console.log(`useEffect 觸發：當前頁碼為 ${currentPage}, 每頁數量為 ${pageSize}`); // 添加log
        fetchOrderList();
    }, [currentPage, pageSize, fetchOrderList]); // 確保這裡取得 currentPage 和 pageSize

    // 顯示 Toast 訊息的函數
    const showCustomToast = (message: string, variant: 'success' | 'danger' = 'success') => {
        if (variant === 'success') {
            showToast(message, 'success');
        } else {
            showToast(message, 'error');
        }
    };

    // 複製到剪貼簿的函數
    const copyToClipboard = async (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                showCustomToast('複製到剪貼簿');
            } catch (err) {
                console.error('複製失敗:', err);
                fallbackCopyToClipboard(text);
            }
        } else {
            // 對於不支持 navigator.clipboard 的舊瀏覽器或非安全上下文
            console.warn('navigator.clipboard 不可用或非安全上下文，嘗試回退方案。');
            fallbackCopyToClipboard(text);
        }
    };

    const fallbackCopyToClipboard = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCustomToast('已複製到剪貼簿');
        } catch (err) {
            console.error('Fallback 複製失敗:', err);
            showCustomToast('複製失敗，請手動複製！', 'danger');
        }
        document.body.removeChild(textArea);
    };

    // 分頁處理, 使用 setSearchParams 更新 URL
    const handlePageChange = useCallback((pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('page', pageNumber.toString());
                // 如果希望 pageSize 始終在 URL 中，可以在這裡設置：
                // newParams.set('page_size', pageSize.toString());                 
                return newParams;
            }, {replace: false});
            // 頁碼改變後 useEffect 會觸發 fetchOrderList
        }
    }, [totalPages, setSearchParams]);    

    // 渲染分頁按鈕的函數
    const renderPaginationItems = useCallback(() => {
        let items = [];

        // 添加「上一頁」按鈕
        items.push(
            <BTPagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            />
        );

        // 添加頁碼數字
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <BTPagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </BTPagination.Item>
            );
        }

        // 添加「下一頁」按鈕
        items.push(
            <BTPagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            />
        );
        return items;
    }, [currentPage, totalPages, handlePageChange]); // 依賴 currentPage 和 totalPages

    // 載入狀態顯示
    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" role="status" className="me-2">
                    <span className="visually-hidden">載入中...</span>
                </Spinner>
                <span>載入訂單列表中...</span>
            </div>
        );
    }

    // 錯誤狀態顯示
    if (error) {
        return (
            <Alert variant="danger" className="my-5 text-center">
                <i className="fa-solid fa-circle-exclamation me-2"></i> {error}
            </Alert>
        );
    }    

    return (
        <div className={`container container-xl ${styles.myOrdersContainer}`}>

            <h1 className="mb-4 text-center">訂單記錄</h1> {/* 標題改為「訂單記錄」並居中 */} 
                  
            {orders.length === 0 && !loading ? ( // 增加 !loading 條件，確保載入完畢後才顯示無訂單訊息
                // 沒有訂單時的提示訊息
                <Alert variant="light" className={`text-center ${styles.noOrdersAlert}`}>
                    <i className="fa-solid fa-info-circle me-2"></i> 您目前沒有任何訂單。
                    <Link to="/" className="alert-link ms-2">
                        去逛逛活動吧！
                    </Link>
                </Alert>
            ) : (
                <>
                    {/* 遍歷訂單列表，為每個訂單渲染一個卡片區塊 */}
                    <Accordion defaultActiveKey={['0']} alwaysOpen> {/* defaultActiveKey 讓第一個預設展開，alwaysOpen 允許多個同時展開 */}
                        {' '}
                        {orders.map((order) => {
                            // 格式化活動日期時間
                            const formattedEventDate = formatDateTime(order.eventDate)
                            // 每個訂單卡片的唯一 eventKey
                            const eventKey = order.orderNumber; // 使用訂單編號作為唯一的 eventKey

                            return (
                                <Accordion.Item eventKey={eventKey} key={order.orderNumber} className={styles.orderCard}>
                                    <div className={styles.orderCardHeader}> {/* 非 Accordion.Header 的部分，用於包裝卡片上半部 */}
                                        {' '}
                                        <Row className="w-100 align-items-start mb-3">
                                            {/* 左側：活動圖片 + 查看憑證按鈕 */}
                                            <Col xs={12} md={3} className={`d-flex flex-column align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0 ${styles.imageCol}`}>
                                                <Image
                                                    src={order.coverImage}
                                                    alt={order.eventName}
                                                    className={styles.coverImage}
                                                    fluid
                                                    rounded
                                                />
                                                {/* 調整為只有已完成付款的訂單才顯示憑證 */}
                                                {order.paymentStatus === '已付款' && (
                                                    <div className="mt-2" style={{ width: '100%', maxWidth: 'var(--cover-element-fixed-width)' }}>
                                                        <Link to={`/user/orders/${order.orderNumber}`} className={styles.viewVoucherLink}>
                                                            <Button variant="outline-primary" size="sm" className={styles.viewVoucherBtn}>
                                                                <FaUpRightFromSquare className="me-1" /> 查看憑證
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </Col>

                                            {/* 中間：活動資訊 */}
                                            <Col xs={12} md={9} className="mb-3 mb-md-0">
                                                <div className={styles.eventInfoGrid}>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>活動名稱</span>
                                                        <span className={styles.value}>{order.eventName}</span>
                                                    </div>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>票券數量</span>
                                                        <span className={styles.value}>{order.ticketCount} 張</span>
                                                    </div>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>實付金額</span>
                                                        <span className={`${styles.value} text-danger fw-bold`}>NT$ {order.totalPrice.toLocaleString()}</span>
                                                    </div>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>活動日期</span>
                                                        <span className={styles.value}>{formattedEventDate}</span>
                                                    </div>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>活動地點</span>
                                                        <span className={styles.value}>{order.location}</span>
                                                        <Link to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.location)}`}
                                                            target="_blank" rel="noopener noreferrer" className="ms-2 text-primary">
                                                            <FaLocationDot size={18} />
                                                        </Link>
                                                    </div>
                                                    <div className={styles.infoItem}>
                                                        <span className={styles.label}>主辦單位</span>
                                                        <span className={styles.value}>{order.organizer}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr className={styles.divider} />
                                            {/* 右側：訂單明細摺疊按鈕 */}
                                        <div className={styles.accordionBlock}>
                                            <Accordion.Header className={styles.customAccordionHeader}>
                                                <span className={styles.headerText}>訂單明細</span>
                                                {/* 箭頭的 class 簡化，讓 CSS 負責旋轉 */}
                                                <i className={`fa-solid fa-chevron-down ${styles.arrowIcon}`}></i>
                                            </Accordion.Header>
                                        </div>
                                    </div> {/* End of orderCardHeader */}

                                    {/* 訂單明細摺疊內容 */}
                                    <Accordion.Body className={styles.accordionBody}>
                                        <Row className="mb-2">
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>訂單編號</span>
                                                    <div className={styles.orderNumberAndCopy}>
                                                        <span className={styles.detailValue}>{order.orderNumber}</span>
                                                        <FaCopy
                                                            className={`${styles.copyIcon}`}
                                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(order.orderNumber); }}
                                                            title="複製訂單編號"
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>訂單建立</span>
                                                    <span className={styles.detailValue}>{formatDateTime(order.createdAt)}</span>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>訂單狀態</span>
                                                    <span className={styles.detailValue}>{order.status}</span>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>付款方式</span>
                                                    <span className={styles.detailValue}>{order.paymentMethod || ''}</span>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>付款狀態</span>
                                                    <span className={styles.detailValue}>{order.paymentStatus}</span>
                                                </div>
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className={styles.detailRow}>
                                                    <span className={styles.detailLabel}>付款時間</span>
                                                    <span className={styles.detailValue}>{formatDateTime(order.paymentDate) || ''}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            );
                        })}
                    </Accordion>

                    {/* 分頁組件 */}
                    {totalOrders > pageSize && ( // 只有當總訂單數超過每頁顯示數量時才顯示分頁
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-center">
                                <BTPagination> {/* 使用重新命名的 BTPagination */}
                                    {renderPaginationItems()} {/* 渲染分頁項目 */}
                                </BTPagination>
                            </Col>
                        </Row>
                    )}
                </>
            )}
            <Toaster
                position="bottom-center"
            />
        </div>
    );
};

export default MyOrders;
