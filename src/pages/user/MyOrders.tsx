import { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Accordion, Button, Image, Spinner, Alert} from 'react-bootstrap';
import { Order, Pagination, getOrderList } from '@api/order';
import { FaCopy, FaUpRightFromSquare } from 'react-icons/fa6'; // 引入複製和外連圖示

import styles from '@components/Order/MyOrders.module.css'; 
import { Toaster } from 'react-hot-toast';
import { showToast } from '@utils/customToast';

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [_pagination, _setPagination] = useState<Pagination>(); // 使用 pagination 狀態，如果需要分頁功能
    const [loading, setLoading] = useState(true); // 載入狀態
    const [error, setError] = useState<string | null>(null); // 錯誤狀態

    const fetchOrderList = useCallback(async () => {
        setLoading(true); // 開始載入
        setError(null); // 清除之前的錯誤訊息
        try {
            const res = await getOrderList();
            // console.log(res);
            if (res) {
                const orders: Order[] = res.results;
                setOrders(orders);
                _setPagination(res.pagination); // 更新 pagination 狀態
            } else {
                setError('無法載入訂單列表。');
            }
        } catch (err: any) {
            console.error("載入訂單列表失敗:", err);
            setError(err.message || '載入訂單時發生網路錯誤。');
        } finally {
            setLoading(false); // 結束載入
        }

    }, []);

    useEffect(() => {
        fetchOrderList();
    }, [fetchOrderList]);

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
                await navigator.clipboard.writeText(text)
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
            showCustomToast('複製到剪貼簿');
        } catch (err) {
            console.error('Fallback 複製失敗:', err);
            showCustomToast('複製失敗，請手動複製！', 'danger');
        }
        document.body.removeChild(textArea);
    };

    const formatEventDate = (date: Date): string => {
        return date.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // 使用 24 小時制
        });
      };

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
        <div className={`container container-xl my-4 ${styles.myOrdersContainer}`}>
            <h1 className="mb-4 text-center">訂單記錄</h1> {/* 標題改為「訂單記錄」並居中 */}
            {orders.length === 0 ? (
                // 沒有訂單時的提示訊息
                <Alert variant="info" className="text-center">
                    <i className="fa-solid fa-info-circle me-2"></i> 您目前沒有任何訂單。
                    <Link to="/events" className="alert-link ms-2">去逛逛活動吧！</Link>
                </Alert>
            ) : (
                // 遍歷訂單列表，為每個訂單渲染一個卡片區塊
                <Accordion defaultActiveKey={['0']} alwaysOpen> {/* defaultActiveKey 讓第一個預設展開，alwaysOpen 允許多個同時展開 */}
                    {orders.map((order) => {
                        // 格式化活動日期時間
                        const date = new Date(order.eventDate);
                        const formattedEventDate = formatEventDate(date)

                        // 格式化訂單建立時間 (假設 order.orderCreateTime 存在且是 ISO 字符串)
                        // const orderCreateDate = order.orderCreateTime ? new Date(order.orderCreateTime) : null;
                        // const formattedOrderCreateTime = orderCreateDate ? orderCreateDate.toLocaleString('zh-TW', {
                        //     year: 'numeric',
                        //     month: '2-digit',
                        //     day: '2-digit',
                        //     hour: '2-digit',
                        //     minute: '2-digit',
                        //     hour12: false
                        // }) : 'N/A';

                        // 格式化付款時間 (假設 order.paymentTime 存在且是 ISO 字符串)
                        // const paymentDate = order.paymentTime ? new Date(order.paymentTime) : null;
                        // const formattedPaymentTime = paymentDate ? paymentDate.toLocaleString('zh-TW', {
                        //     year: 'numeric',
                        //     month: '2-digit',
                        //     day: '2-digit',
                        //     hour: '2-digit',
                        //     minute: '2-digit',
                        //     hour12: false
                        // }) : 'N/A';

                        // 每個訂單卡片的唯一 eventKey
                        const eventKey = order.orderNumber; // 使用訂單編號作為唯一的 eventKey

                        return (
                            <Accordion.Item eventKey={eventKey} key={order.orderNumber} className={styles.orderCard}>
                                <div className={styles.orderCardHeader}> {/* 非 Accordion.Header 的部分，用於包裝卡片上半部 */}
                                    <Row className="w-100 align-items-center mb-3">
                                        {/* 左側：活動圖片 + 查看憑證按鈕 */}
                                        <Col xs={12} md={3} className={`d-flex flex-column align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0 ${styles.imageCol}`}>
                                            <Image
                                                src={order.coverImage}
                                                alt={order.eventName}
                                                className={styles.coverImage}
                                                fluid
                                                rounded
                                            />
                                            <div className="mt-2">
                                                <Link to={`/user/orders/${order.orderNumber}`} className={styles.viewVoucherLink}>
                                                    <Button variant="outline-primary" size="sm" className={styles.viewVoucherBtn}>
                                                        <FaUpRightFromSquare className="me-1" /> 查看憑證
                                                    </Button>
                                                </Link>
                                            </div>
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
                                                    <Link to={`http://maps.google.com/?q=${encodeURIComponent(order.location)}`}
                                                          target="_blank" rel="noopener noreferrer" className="ms-2 text-primary">
                                                        <FaUpRightFromSquare />
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
                                        <Col xs={12} md={6}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>訂單編號</span>
                                                <span className={styles.detailValue}>{order.orderNumber}</span>
                                                <FaCopy
                                                    className={`${styles.copyIcon}`}
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(order.orderNumber); }}
                                                    title="複製訂單編號"
                                                />
                                            </div>
                                        </Col>
                                        {/* <Col xs={12} md={6}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>訂單建立</span>
                                                <span className={styles.detailValue}>{formattedOrderCreateTime}</span>
                                            </div>
                                        </Col> */}
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>付款方式</span>
                                                <span className={styles.detailValue}>{order.paymentMethod || 'N/A'}</span>
                                            </div>
                                        </Col>
                                            {/* <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>付款時間</span>
                                                <span className={styles.detailValue}>{formattedPaymentTime}</span>
                                            </div> */}
                                        <Col xs={12} md={4}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>訂單狀態</span>
                                                <span className={styles.detailValue}>{order.status}</span>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <div className={styles.detailRow}>
                                                <span className={styles.detailLabel}>付款狀態</span>
                                                <span className={styles.detailValue}>{order.status || 'N/A'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>
            )}
            <Toaster
                position="bottom-center"
            />
            </div>
    );
};

export default MyOrders;
