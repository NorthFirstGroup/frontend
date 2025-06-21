import { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaTrash, FaPlus } from 'react-icons/fa';
import UploadImg from '@pages/organizer/manageActivity/UploadImg';
import { getAvailAreas } from '@api/availArea';
import { useParams, useSearchParams } from 'react-router-dom';
// import activityAPI from '@api/activityAPI';

interface ZonePrice {
    id?: string;
    section: string;
    capacity: number;
    price: number;
}

interface RegionOption {
  id: number;
  name: string;
}

const VenueForm = () => {
    const { activityId } = useParams(); // 讀取 URL 參數
    const [searchParams] = useSearchParams();
    const siteId = searchParams.get('siteId');
    const [regionList, setRegionList] = useState<RegionOption[]>([]);
    const [regionId, setRegionId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [address, setLocation] = useState('');
    const [imageUrl, setSeatImage] = useState<string>('');
    const [zonePrices, setZonePrices] = useState<ZonePrice[]>([]);

    const addZone = () => {
        setZonePrices([...zonePrices, { section: '', capacity: 0, price: 0 }]);
    };

    const removeZone = (index: number) => {
        setZonePrices(zonePrices.filter((_, idx) => idx !== index));
    };

    const updateZone = (index: number, key: keyof ZonePrice, value: string | number) => {
        const updated = [...zonePrices];

        switch (key) {
            case 'section':
                updated[index].section = value as string;
                break;
            case 'capacity':
                updated[index].capacity = Number(value);
                break;
            case 'price':
                updated[index].price = Number(value);
                break;
        }

        setZonePrices(updated);
    };

    const handleSubmit = () => {
        // 檢查主要欄位
        if (!regionId) {
            alert('請選擇地區');
            return;
        }
        if (!name.trim()) {
            alert('請填寫地點名稱');
            return;
        }
        if (!address.trim()) {
            alert('請填寫地址');
            return;
        }
        if (!imageUrl.trim()) {
            alert('請填上傳圖片');
            return;
        }

        // 檢查每個 zone 的欄位
        for (const [i, zone] of zonePrices.entries()) {
            if (!zone.section.trim()) {
                alert(`第 ${i + 1} 行的「分區」未填`);
                return;
            }
            if (!zone.capacity || zone.capacity <= 0) {
                alert(`第 ${i + 1} 行的「人數上限」需大於 0`);
                return;
            }
            if (!zone.price || zone.price < 0) {
                alert(`第 ${i + 1} 行的「金額」需大於等於 0`);
                return;
            }
        }

        const payload = {
            area: regionId,
            name,
            address,
            seating_map_url: imageUrl,
            prices: zonePrices.map((z) => ({
                section: z.section,
                capacity: z.capacity,
                price: z.price,
            })),
        };

        console.log('送出資料', payload);
        // 假設用 axios.post 傳送 JSON
        // axios.post('/api/venues', payload);
    };

    const fetchGetAvailAreas = useCallback(async () => {
        const response = await getAvailAreas();
        if (response.data?.results) {
            setRegionList(response.data.results);
        }
    }, []);

    const fetchGetActivity = useCallback(async () => {
        if (!activityId || !siteId) return;

        try {
            console.log('活動資料:', activityId, siteId);
            // const response = await activityAPI.getActivityShowtimeSeatMap(activityId as string, showtimeId as string);
            // setName(response.activity.name);
            // setLocation(response.showtime.location);
            // setLocation(response.showtime.address);
            // setSeatImage(response.showtime.seat_image);
            // setZonePrices(response.showtime.seats);
        } catch (error) {
            console.error('載入活動資料失敗:', error);
        }
    }, [activityId, siteId]);    
    
    useEffect(() => {
        fetchGetAvailAreas();
        fetchGetActivity();
    }, [fetchGetAvailAreas, fetchGetActivity]);

    return (
        <div className="container mt-4" style={{ maxWidth: '720px' }}>
            <h3 className="fw-bold mb-4 text-center">場地設定</h3>

            <Form.Group className="mb-3">
                <Form.Label>演出地區</Form.Label>
                <Form.Select value= {regionId ?? ''} onChange={(e) => setRegionId(Number(e.target.value))}>
                    <option value="">請選擇地區</option>
                    {regionList.map((item) => (
                    <option key={item.id} value={item.name}>
                        {item.name}
                    </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>名稱</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>地址</Form.Label>
                <Form.Control value={address} onChange={(e) => setLocation(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>分區座位示意圖</Form.Label>
                <UploadImg
                    url={imageUrl}
                    onChange={(url) => setSeatImage(url)}
                />
            </Form.Group>

            <div className="mb-2 d-flex align-items-center justify-content-between">
                <strong>分區座位價格</strong>
                <Button variant="outline-dark" size="sm" onClick={addZone}>
                    <FaPlus />
                </Button>
            </div>

            {/* 表頭列 */}
            <div className="d-flex gap-2 mb-2">
                <div style={{ flex: 1 }} className="text-center fw-bold">分區</div>
                <div style={{ flex: 1 }} className="text-center fw-bold">人數上限</div>
                <div style={{ flex: 1 }} className="text-center fw-bold">金額</div>
                <div style={{ width: '40px' }} /> {/* 空出刪除鈕的位置 */}
            </div>

            {/* 輸入列 */}
            {zonePrices.map((zone, idx) => (
                <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
                    <Form.Control
                        placeholder="分區"
                        value={zone.section}
                        onChange={(e) => updateZone(idx, 'section', e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <Form.Control
                        type="text"
                        pattern="^[1-9][0-9]*$"
                        placeholder="人數上限"
                        value={zone.capacity === 0 ? '' : zone.capacity} // 避免初始 0 顯示
                        onChange={(e) => {
                            const val = e.target.value;
                            // 允許空白、或是長度最多5且符合正整數格式（首位非0）
                            if ((val === '') || (/^[1-9][0-9]{0,4}$/.test(val))) {
                                updateZone(idx, 'capacity', val === '' ? 0 : Number(val));
                            }
                        }}
                        inputMode="numeric" // 行動裝置輸入優化
                        style={{ flex: 1 }}
                    />
                    <Form.Control
                        type="text"
                        pattern="^[1-9][0-9]*$"
                        placeholder="金額"
                        value={zone.price === 0 ? '' : zone.price} // 避免初始 0 顯示
                        onChange={(e) => {
                            const value = e.target.value;
                            // 允許空白、或是長度最多6且符合正整數格式（首位非0）
                            if ((value === '') || (/^[1-9][0-9]{0,5}$/.test(value))) {
                                updateZone(idx, 'price', value === '' ? 0 : Number(value));
                            }
                        }}
                        inputMode="numeric" // 行動裝置輸入優化
                        style={{ flex: 1 }}
                    />
                    <Button
                        variant="outline-danger"
                        onClick={() => removeZone(idx)}
                        style={{ width: '40px' }}
                    >
                        <FaTrash />
                    </Button>
                </div>
            ))}

            <div className="mt-4 text-center">
                <Button variant="primary" className="me-3" onClick={handleSubmit}>
                    確認
                </Button>
                <Button variant="primary">取消</Button>
            </div>
        </div>
    );
};

export default VenueForm;