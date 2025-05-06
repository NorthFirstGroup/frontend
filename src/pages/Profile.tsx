import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthStore';
import { loginApi } from '../api/authApi';
import DatePicker from 'react-datepicker';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const areaOptions = [
        '北北基宜地區',
        '桃竹苗地區',
        '中彰投地區',
        '雲嘉南地區',
        '高屏地區',
        '花東地區',
        '澎金馬地區'
    ];
    type Area = (typeof areaOptions)[number];

    const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {};

    // const [formData, setFormData] = useState({
    //     email: '',
    //     name: '',
    //     phoneNumber: '',
    //     selectedAreas: [] as string[],
    //     birthDate: null as Date | null
    // });

    const handleToggle = (area: Area) => {
        setSelectedAreas(
            prev =>
                prev.includes(area)
                    ? prev.filter(item => item !== area) // 移除
                    : [...prev, area] // 加入
        );
    };
    return (
        <div>
            <div className="container mt-5">
                <h1>會員中心</h1>
            </div>
            <Container className="mt-5" style={{ maxWidth: '400px' }}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formEmai">
                        <Form.Label>會員帳號</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="請輸入email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>暱稱</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="請輸入暱稱 (最多10個字)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={10}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPhoneNumber">
                        <Form.Label>手機號碼</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="格式 09NNNNNNNN"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            maxLength={10}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBirthDate">
                        <Form.Label>出生年月日</Form.Label>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                            <DatePicker
                                selected={birthDate}
                                onChange={date => setBirthDate(date)}
                                dateFormat="yyyy/MM/dd"
                                className="form-control"
                                placeholderText="請選擇出生日期"
                                wrapperClassName="w-100"
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formArea">
                        <Form.Label>偏好活動地區</Form.Label>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                            {areaOptions.map((area, index) => (
                                <Form.Check
                                    key={area}
                                    type="checkbox"
                                    label={area}
                                    id={index.toString()}
                                    checked={selectedAreas.includes(area)}
                                    onChange={() => handleToggle(area)}
                                    className="d-inline-block"
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        更新
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default Profile;
