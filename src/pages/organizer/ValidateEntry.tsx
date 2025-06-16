import { Suspense, useCallback, useState, useEffect, ChangeEvent } from 'react';
import { Alert, Button, Container, Fade, Form } from 'react-bootstrap';
import { useZxing } from 'react-zxing';
import { ActivityDetail, getOrgActivityList, ActivityShowtime, getOrgShowtimeList } from '@api/activityAPI';
import { Ticket, getTicketById, putTicketById } from '@api/ticket';

export default function ValidateEntry() {
    const [activities, setActivities] = useState<ActivityDetail[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);
    const [showtimes, setShowtimes] = useState<ActivityShowtime[]>([]);
    const [selectedShowtime, setSelectedShowtime] = useState<ActivityShowtime | null>(null);
    const [scannerActive, setScannerActive] = useState(false); // default: off
    const [scannedQR, setScannedQR] = useState('');
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const { ref: scannerRef } = useZxing({
        onDecodeResult(result) {
            setScannedQR(result.getText());
        },
        paused: !scannerActive
    });

    const toggleScanner = () => {
        const willBeActive = !scannerActive;
        setScannerActive(willBeActive);
        if (!willBeActive) {
            setScannedQR(''); // Clear scanned QR when restarting
            setTicket(null); // Clear ticket data
            setErrMsg(null); // Clear error message
        }
    };

    const fetchActivityList = useCallback(async () => {
        const result = await getOrgActivityList();
        setActivities(result);
        setSelectedActivity(result.length > 0 ? result[0] : null);
    }, []);

    const fetchShowtimeList = useCallback(async (activityId: number) => {
        const result: ActivityShowtime[] = await getOrgShowtimeList(activityId);
        setShowtimes(result);
        setSelectedShowtime(result.length > 0 ? result[0] : null);
    }, []);

    useEffect(() => {
        fetchActivityList();
    }, [fetchActivityList]);

    useEffect(() => {
        if (selectedActivity) {
            fetchShowtimeList(selectedActivity.id);
        }
    }, [selectedActivity, fetchShowtimeList]);

    useEffect(() => {
        if (scannedQR) {
            const fetchTicket = async () => {
                const ticketData = await getTicketById(scannedQR);
                console.log('Fetched ticket:', ticketData);
                if (ticketData && ticketData.showtimeId === selectedShowtime?.id) {
                    setTicket(ticketData);
                    setErrMsg(null);
                } else {
                    setTicket(null);
                    setErrMsg('票卷不符合選擇的場次，請確認後再試。');
                }
            };
            fetchTicket();
        }
    }, [scannedQR, selectedShowtime?.id]);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => setSuccessMsg(null), 3000); // hide after 3s
            return () => clearTimeout(timer);
        }
    }, [successMsg]);

    const onActivityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedActivity(activities.find(activity => activity.id.toString() === e.target.value) || null);
    };

    const setTicketUsed = async () => {
        if (ticket) {
            const success = await putTicketById(ticket.id);
            if (success) {
                setTicket(prev => (prev ? { ...prev, useState: true } : null));
                setSuccessMsg('驗票成功 ✅');
                setErrMsg(null);
            } else {
                setSuccessMsg(null);
                setErrMsg('更新票卷狀態失敗，請稍後再試。');
            }
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Container className="mt-5" style={{ maxWidth: '400px' }}>
                <div>
                    <h5>活動資訊</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>選擇活動</Form.Label>
                        <Form.Select
                            style={{ width: 'fit-content' }}
                            value={selectedActivity?.id.toString() || ''}
                            onChange={onActivityChange}
                        >
                            {activities.map(activity => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Label>選擇場次</Form.Label>
                        <Form.Select
                            style={{ width: 'fit-content' }}
                            value={selectedShowtime?.id || ''}
                            onChange={e => {
                                const showtime = showtimes.find(s => s.id === e.target.value);
                                console.log('Selected showtime id:', showtime?.id);
                                setSelectedShowtime(showtime || null);
                            }}
                        >
                            <option value="">請選擇場次</option>
                            {showtimes.map(showtime => (
                                <option key={showtime.id} value={showtime.id}>
                                    {new Date(showtime.startTime).toLocaleString()} - {showtime.location}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <p>活動地點：{selectedShowtime?.location}</p>
                    <p>活動地址：{selectedShowtime?.address}</p>
                    {/*
                    <p>主辦單位：{selectedActivity?.organizer}</p>
                    */}
                </div>
                <Button variant="primary" onClick={toggleScanner}>
                    {scannerActive ? '關閉鏡頭' : '開啟鏡頭'}
                </Button>
                <div>
                    {scannerActive ? (
                        <video key="scanner" ref={scannerRef} className="w-100 h-100 object-fit-cover" />
                    ) : (
                        <div className="text-muted text-center border rounded p-5">鏡頭未啟用</div>
                    )}
                </div>
                {ticket && (
                    <div>
                        <h5>票卷資訊</h5>
                        <p>票卷條碼：{scannedQR}</p>
                        <p>活動名稱：{ticket.activityName}</p>
                        <p>開始時間：{new Date(ticket.startTime).toLocaleString()}</p>
                        <p>活動地點：{ticket.location}</p>
                        <p>活動地址：{ticket.address}</p>
                        <p>主辦單位：{ticket.organizerName}</p>
                        <p>票券類型：電子票券</p>
                        <p>座位：{ticket.section}</p>
                        <p>
                            狀態：<span className="text-danger">{ticket.useState ? '已使用' : '未使用'}</span>
                        </p>
                        <Button variant="primary" disabled={ticket.useState} onClick={setTicketUsed}>
                            確認
                        </Button>
                    </div>
                )}
                {errMsg && (
                    <div>
                        <span className="text-danger">{errMsg}</span>
                    </div>
                )}
                <Fade in={!!successMsg} timeout={500}>
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1050,
                            minWidth: '400px', // wider than default
                            maxWidth: '80vw'
                        }}
                    >
                        <Alert
                            variant="success"
                            onClose={() => setSuccessMsg(null)}
                            dismissible
                            style={{
                                fontSize: '1.2rem', // larger text
                                padding: '1.5rem' // more padding
                            }}
                        >
                            {successMsg}
                        </Alert>
                    </div>
                </Fade>
            </Container>
        </Suspense>
    );
}
