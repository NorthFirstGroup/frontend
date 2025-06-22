import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import z from 'zod';
import { useParams } from 'react-router-dom';
import { useSiteContext } from '@contexts/context/SiteContext';
import useManageActivityLogic from '@hooks/useManageActivityLogic';
import { getAvailAreas } from '@api/availArea';
import UploadImg from './UploadImg';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ManageSiteStack = styled(Stack)`
    position: relative;
    min-height: 300px;
`;

const BorderWrapper = styled.div`
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--bs-border-color);
`;

const pricesSchema = z.object({
    section: z.string().min(1, '分區必填'),
    capacity: z.coerce.number().min(1, '人數上限必填'),
    price: z.coerce.number().min(1, '金額不可為0')
});

const createSiteSchema = z.object({
    area: z.number({ required_error: '地點為必填' }),
    name: z.string({ required_error: '名稱為必填' }),
    address: z.string({ required_error: '地址為必填' }),
    seatingMapUrl: z.string({ required_error: '座位圖為必填' }),
    prices: z.array(pricesSchema).min(1, '至少需要一個分區價格設定')
});
type FormData = z.infer<typeof createSiteSchema>;

interface RegionOption {
    id: number;
    name: string;
}

const SiteModal = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const { showSiteModal } = useManageActivityContext();
    const { toggleSiteModal } = useManageActivityLogic();
    const { createOrganizerSite, updateOrganizerSite, organizerSiteList } = useSiteContext();
    const [regionList, setRegionList] = useState<RegionOption[]>([]);
    const siteId = typeof showSiteModal === 'string' ? showSiteModal : undefined;

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetFormData
    } = useForm<FormData>({
        resolver: zodResolver(createSiteSchema),
        defaultValues: {}
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'prices'
    });

    const onClose = () => {
        toggleSiteModal(false);
        resetFormData({
            area: 0,
            name: '',
            address: '',
            seatingMapUrl: '',
            prices: []
        });
    };

    const onFormSubmit = () => {
        handleSubmit(onSubmit, errors => {
            console.log('Form errors:', errors);
        })();
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        if (!activityId) return;
        if (activityId && siteId) {
            await updateOrganizerSite(activityId, siteId, data);
            onClose();
            return;
        }
        await createOrganizerSite(activityId, data);
        onClose();
    };

    const fetchGetAvailAreas = useCallback(async () => {
        const response = await getAvailAreas();
        if (response.data?.results) {
            setRegionList(response.data.results);
        }
    }, []);

    useEffect(() => {
        resetFormData({
            seatingMapUrl:
                'https://goticket-bucket.s3.ap-northeast-1.amazonaws.com/public/images/23752b7e-1ad6-48a4-b905-cdacd1b51544.jpg'
        });
    }, []);

    useEffect(() => {
        fetchGetAvailAreas();
    }, [fetchGetAvailAreas]);

    useEffect(() => {
        if (fields.length === 0) {
            append({ section: '', capacity: 0, price: 0 });
        }
    }, [append, fields.length]);
    useEffect(() => {
        if (siteId) {
            const site = organizerSiteList?.find(site => site.id === siteId);
            console.log('Site data:', site);
            if (site) resetFormData({ area: site.areaId, ...site });
        } else {
            resetFormData({
                area: 0,
                name: '',
                address: '',
                seatingMapUrl: '',
                prices: []
            });
        }
    }, [siteId, organizerSiteList]);

    return (
        <Modal show={!!showSiteModal} onHide={onClose} backdrop="static" keyboard={false} centered scrollable>
            <Modal.Header closeButton={false}>
                <Modal.Title className="text-center w-100">場地設定</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ManageSiteStack className=" mx-auto">
                    <form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column xs={2} className="pe-0">
                                地區
                            </Form.Label>
                            <Col xs={10}>
                                <Controller
                                    name="area"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <Form.Select
                                                {...field}
                                                className={errors.area?.message && 'is-invalid'}
                                                onChange={e => field.onChange(Number(e.target.value))} // 轉成數字
                                            >
                                                <option value="" hidden>
                                                    請選擇地區
                                                </option>
                                                {regionList.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        );
                                    }}
                                />
                                {errors.area && <Form.Text className="text-danger">{errors.area.message}</Form.Text>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column xs={2} className="pe-0">
                                名稱
                            </Form.Label>
                            <Col xs={10}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            value={field.value ?? ''}
                                            className={errors.name?.message && 'is-invalid'}
                                            placeholder="請輸入場地名稱"
                                        />
                                    )}
                                />
                                {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column xs={2} className="pe-0">
                                地址
                            </Form.Label>
                            <Col xs={10}>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            {...field}
                                            value={field.value ?? ''}
                                            className={errors.address?.message && 'is-invalid'}
                                            placeholder="請輸入場地地址"
                                        />
                                    )}
                                />
                                {errors.address && (
                                    <Form.Text className="text-danger">{errors.address.message}</Form.Text>
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGroupFirstName">
                            <Form.Label column>分區座位示意圖</Form.Label>
                            <Controller
                                name="seatingMapUrl"
                                control={control}
                                render={({ field }) => (
                                    <UploadImg url={field.value} onChange={url => field.onChange(url)} />
                                )}
                            />
                            {errors.seatingMapUrl && (
                                <Form.Text className="text-danger">{errors.seatingMapUrl.message}</Form.Text>
                            )}
                        </Form.Group>
                        <Row className="my-3">
                            <Col xs="auto" className="d-flex align-items-center ">
                                分區座位價格
                            </Col>
                            <Col>
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={() => append({ section: '', capacity: 0, price: 0 })}
                                >
                                    <FaPlus className="me-2" />
                                    新增分區
                                </Button>
                            </Col>
                        </Row>
                        <BorderWrapper>
                            {errors.prices && <Form.Text className="text-danger">{errors.prices.message}</Form.Text>}
                            <Row className="text-center fw-bold border-bottom pb-2 mb-3">
                                <Col xs={4}>分區</Col>
                                <Col xs={3}>人數上限</Col>
                                <Col xs={4}>金額</Col>
                                <Col xs={1} />
                            </Row>
                            <Stack gap={2}>
                                {fields.map((field, idx) => (
                                    <Form.Group as={Row} key={field.id}>
                                        <Col xs={4}>
                                            <Controller
                                                control={control}
                                                name={`prices.${idx}.section`}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        className={
                                                            errors?.prices?.[idx]?.section?.message && 'is-invalid'
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.prices?.[idx]?.section && (
                                                <div className="text-danger">{errors.prices[idx].section.message}</div>
                                            )}
                                        </Col>
                                        <Col xs={3}>
                                            <Controller
                                                control={control}
                                                name={`prices.${idx}.capacity`}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        type="number"
                                                        className={
                                                            errors?.prices?.[idx]?.capacity?.message && 'is-invalid'
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.prices?.[idx]?.capacity && (
                                                <div className="text-danger">{errors.prices[idx].capacity.message}</div>
                                            )}
                                        </Col>
                                        <Col xs={4}>
                                            <Controller
                                                control={control}
                                                name={`prices.${idx}.price`}
                                                render={({ field }) => (
                                                    <Form.Control
                                                        {...field}
                                                        type="number"
                                                        className={
                                                            errors?.prices?.[idx]?.price?.message && 'is-invalid'
                                                        }
                                                    />
                                                )}
                                            />
                                            {errors.prices?.[idx]?.price && (
                                                <div className="text-danger">{errors.prices[idx].price.message}</div>
                                            )}
                                        </Col>
                                        <Col xs={1}>
                                            <FaTrash onClick={() => remove(idx)} style={{ cursor: 'pointer' }} />
                                        </Col>
                                    </Form.Group>
                                ))}
                            </Stack>
                        </BorderWrapper>
                    </form>
                </ManageSiteStack>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="secondary" onClick={onClose}>
                    取消
                </Button>
                <Button variant="primary w-25" type="submit" onClick={onFormSubmit}>
                    確認
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default SiteModal;
