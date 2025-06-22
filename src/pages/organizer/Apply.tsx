import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { ApiResponse } from '@type/ApiResponse';
import { useAuth } from '@hooks/useAuth';
import { OrganizerData, getOrganizerData, applyAsOrganizer, putOrganizerData } from '@api/organizer';
import UserNameInput from '@components/UserNameInput';
import PhoneNumberInput from '@components/PhoneNumberInput';

const OrganizerApplyForm: React.FC = () => {
    const { user } = useAuth();
    const [errors, setErrors] = useState({
        name: '',
        ubn: '',
        president: '',
        phone: '',
        address: ''
    });
    const [errMsg, setErrMsg] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState<OrganizerData>({
        name: '',
        ubn: '',
        president: '',
        phone: '',
        address: ''
    });
    const MAX_LENGTH = 50;

    useEffect(() => {
        const fetchOrganizerData = async () => {
            setErrMsg(null);
            try {
                if (user?.role === 'ORGANIZER') {
                    const response: ApiResponse<OrganizerData> = await getOrganizerData();
                    if (response.data) setFormData(response.data);
                }
            } catch (err: unknown) {
                setErrMsg(err instanceof Error ? err.message : '無法取得廠商資料');
            }
        };

        fetchOrganizerData();
    }, [user]);

    const validateTraditionalChineseName = (name: string) => {
        let errorMsg = '';

        // 1. 必填檢查
        if (!name || name.trim() === '') {
            errorMsg = '單位名稱不能為空。';
        }

        // 2. 字數限制檢查
        if (name.length > MAX_LENGTH) {
            errorMsg += `\r\n單位名稱長度不能超過 ${MAX_LENGTH} 個字。`;
        }

        // 4. 特殊字元檢查 (可根據需求定義允許或不允許的字元)
        // 允許中文、數字、英文字母，以及一些常見的標點符號如 - , . ()
        const validCharsRegex = /^[\u4e00-\u9fa50-9a-zA-Z\s\-,.()]$/; // [\u4e00-\u9fa5] 是中文範圍
        if (name.length > 0 && ![...name].every(char => validCharsRegex.test(char))) {
            errorMsg += '\r\n單位名稱包含不允許的特殊字元。';
        }

        return errorMsg;
    };

    const validateTraditionalChineseAddress = (address: string) => {
        let errorMsg = '';

        // 1. 必填檢查
        if (!address || address.trim() === '') {
            errorMsg = '住址不能為空。';
        }

        // 2. 字數限制檢查
        if (address.length > MAX_LENGTH) {
            errorMsg += `\r\n住址長度不能超過 ${MAX_LENGTH} 個字。`;
        }

        // 3. 基礎格式檢查 (可根據需求增加更多判斷)
        const commonAddressKeywords = ['路', '街', '段', '巷', '弄', '號', '樓', '室', '縣', '市', '區'];
        const hasKeyword = commonAddressKeywords.some(keyword => address.includes(keyword));

        if (address.length > 0 && !hasKeyword) {
            errorMsg += '\r\n住址似乎缺少常見的地址資訊（例如：路、街、段、號等）。';
        }

        // 4. 特殊字元檢查 (可根據需求定義允許或不允許的字元)
        // 允許中文、數字、英文字母，以及一些常見的標點符號如 - , . ()
        const validCharsRegex = /^[\u4e00-\u9fa50-9a-zA-Z\s\-,.()號樓室棟層]$/; // [\u4e00-\u9fa5] 是中文範圍
        if (address.length > 0 && ![...address].every(char => validCharsRegex.test(char))) {
            errorMsg += '\r\n住址包含不允許的特殊字元。';
        }

        return errorMsg;
    };

    const validateField = (name: string, value: string) => {
        let errorMsg = '';

        if (name === 'president') {
            if (value.length < 2 || value.length > 10) {
                errorMsg = '負責人姓名需為 2-10 字，且不可包含特殊符號';
            }
        }

        if (name === 'ubn') {
            const phoneRegex = /^\d{8}$/;
            if (!phoneRegex.test(value)) {
                errorMsg = '統一編號為 8 位數字';
            }
        }

        if (name === 'phone') {
            const phoneRegex = /^09\d{8}$/;
            if (!phoneRegex.test(value)) {
                errorMsg = '聯絡電話需為 09 開頭的 10 位數字';
            }
        }
        if (name === 'name') errorMsg = validateTraditionalChineseName(value);
        if (name === 'address') errorMsg = validateTraditionalChineseAddress(value);

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        validateField(name, value);
    };

    const isFormValid = () => {
        return Object.values(errors).every(errorMsg => errorMsg === '');
    };

    const validateAllFields = () => {
        const newErrors = {
            name: validateTraditionalChineseName(formData.name),
            ubn: validateField('ubn', formData.ubn) ? '' : errors.ubn, // Re-validate ubn
            president: validateField('president', formData.president) ? '' : errors.president, // Re-validate president
            phone: validateField('phone', formData.phone) ? '' : errors.phone, // Re-validate phone
            address: validateTraditionalChineseAddress(formData.address)
        };
        setErrors(newErrors);
        // Return true if all errors are empty strings
        return Object.values(newErrors).every(errorMsg => errorMsg === '');
    };

    const handleApply = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrMsg('');
        setSubmitSuccess('');
        if (!validateAllFields()) {
            setErrMsg('請修正表單中的錯誤。');
            return;
        }
        try {
            const response: ApiResponse<null> = await applyAsOrganizer(formData);
            if (response.status_code === 2000) {
                setSubmitSuccess('申請成功，請重新登入。');
            } else {
                setErrMsg(`申請失敗: ${response.message}`);
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            setErrMsg('申請失敗，請稍後再試。');
        }
    };

    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrMsg('');
        setSubmitSuccess('');
        if (!validateAllFields()) {
            setErrMsg('請修正表單中的錯誤。');
            return;
        }
        try {
            const response: ApiResponse<null> = await putOrganizerData(formData);
            if (response.status_code === 2000) {
                setSubmitSuccess('資料更新成功。');
            } else {
                setErrMsg(`更新失敗: ${response.message}`);
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            setErrMsg('更新失敗，請稍後再試。');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '600px' }}>
            <h3>廠商資訊</h3>
            {errMsg && <Alert variant="danger">{errMsg}</Alert>}
            {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
            <Form>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>單位名稱</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入單位名稱"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        maxLength={MAX_LENGTH}
                        required
                    />
                    {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formUbn">
                    <Form.Label>統一編號</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入統一編號"
                        name="ubn"
                        value={formData.ubn}
                        onChange={handleChange}
                        pattern="^\d{8}$"
                        required
                    />
                    {errors.ubn && <Form.Text className="text-danger">{errors.ubn}</Form.Text>}
                </Form.Group>

                <UserNameInput
                    inputLabel="負責人姓名"
                    inputName="president"
                    value={formData.president}
                    onChange={handleChange}
                    error={errors.president}
                />

                <PhoneNumberInput
                    inputLabel="聯絡電話"
                    inputName="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                />

                <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>地址</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="請輸入地址"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        maxLength={MAX_LENGTH}
                        required
                    />
                </Form.Group>

                {user?.role === 'USER' && (
                    <Button variant="primary" type="submit" disabled={!isFormValid()} onClick={handleApply}>
                        送出申請
                    </Button>
                )}
                {user?.role === 'ORGANIZER' && (
                    <Button variant="primary" type="submit" disabled={!isFormValid()} onClick={handleUpdate}>
                        更新資料
                    </Button>
                )}
            </Form>
        </Container>
    );
};

export default OrganizerApplyForm;
