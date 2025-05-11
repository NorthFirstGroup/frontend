import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';

interface OrganizerApplyData {
    name: string;
    ubn: string;
    president: string;
    phone: string;
    address: string;
}

const OrganizerApplyForm: React.FC = () => {
    const [formData, setFormData] = useState<OrganizerApplyData>({
        name: '',
        ubn: '',
        president: '',
        phone: '',
        address: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('送出的資料:', formData);

        try {
            const response = await fetch('/api/v1/organizer/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('成功回傳:', responseData);
                // 在這裡處理成功回傳的資訊，例如顯示成功訊息或導向其他頁面
            } else {
                console.error('申請失敗:', response.status);
                // 在這裡處理錯誤情況，例如顯示錯誤訊息
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            // 處理網路錯誤或其他異常
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>單位名稱</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入單位名稱"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUbn">
                    <Form.Label>統一編號</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入統一編號"
                        name="ubn"
                        value={formData.ubn}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPresident">
                    <Form.Label>負責人姓名</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入負責人姓名"
                        name="president"
                        value={formData.president}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>聯絡電話</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="請輸入聯絡電話"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>地址</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="請輸入地址"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled>
                    送出申請(還沒好)
                </Button>
            </Form>
        </Container>
    );
};

export default OrganizerApplyForm;
