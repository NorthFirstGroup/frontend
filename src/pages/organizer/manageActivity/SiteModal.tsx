import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Stack } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AddIcon from '@assets/icons/add.png';

import styled from 'styled-components';
import z from 'zod';
import { OrganizerActivitySite } from '@api/organizerAPI';
import { useParams } from 'react-router-dom';
import { useSiteContext } from '@contexts/context/SiteContext';
// import { useShowtimeContext } from '@contexts/context/ShowtimeContext';
import useManageActivityLogic from '@hooks/useManageActivityLogic';
import { getAvailAreas } from '@api/availArea';
import UploadImg from './UploadImg';
import Icon from '@components/Icon';
import { FaTrash } from 'react-icons/fa';

const ManageSiteStack = styled(Stack)`
    position: relative;
    min-height: 300px;
`;

const BorderWrapper = styled.div`
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--bs-border-color);
`;

const ImageWrapper = styled(BorderWrapper)`
    aspect-ratio: 3 / 2;
`;

const SiteImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const createSiteSchema = z
    .object({
        siteId: z.string(),
        areaId: z.number(),
        name: z.string({ required_error: '地點為必填' }),
        address: z.string({ required_error: '地址為必填' }),
        seatingMapUrl: z.string({ required_error: '座位圖為必填' }),
        prices: z.array(
            z.object({
                price: z.number({ required_error: '價格為必填' }),
                section: z.string({ required_error: '場次為必填' }),
                capacity: z.number({ required_error: '座位數為必填' })
            })
        )
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
    const { organizerSiteList } = useSiteContext();
    // const { createOrganizerShowtime, updateOrganizerShowtime } = useShowtimeContext();
    const [currentSite, setCurrentSite] = useState<OrganizerActivitySite | undefined>(undefined);
    const siteId = typeof showSiteModal === 'string' ? showSiteModal : undefined;
    const [regionList, setRegionList] = useState<RegionOption[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetFormData,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(createSiteSchema),
        defaultValues: {}
    });

    const siteIdValue = watch('siteId');

    const onClose = () => {
        toggleSiteModal(false);
        resetFormData({
            siteId: '',
            areaId: 0,
            name: '',
            address: '',
            seatingMapUrl: '',
            prices: []
        });
        setCurrentSite(undefined);
    };

    const addZonePrice = () => {
        if (!currentSite) return;

        const newPrice = {
            section: '',        // 預設分區名
            capacity: 0,        // 預設容量
            price: 0,           // 預設價格
        };

        const updatedSite: OrganizerActivitySite = {
            ...currentSite,
            prices: [...currentSite.prices, newPrice]
        };

        console.log('updatedSite', updatedSite);
        setCurrentSite(updatedSite);
    };

    const removeZonePrice = (index: number) => {
        if (!currentSite) return;

        const updatedPrices = currentSite.prices.filter((_, i) => i !== index);

        const updatedSite: OrganizerActivitySite = {
            ...currentSite,
            prices: updatedPrices,
            updatedAt: new Date().toISOString()
        };

        setCurrentSite(updatedSite);
    };

    const onFormSubmit = () => {
        handleSubmit(onSubmit, errors => {
            console.log('Form errors:', errors);
        })();
    };

    const onSubmit: SubmitHandler<FormData> = async () => {
        if (!activityId) return;
        console.log('Submit', currentSite);
        // 解析後Date轉換為字串
        // const transformedData = createSiteSchemaTransformed.parse(data);
        // if (activityId && siteId) {
        //     await updateOrganizerShowtime(activityId, siteId, transformedData);
        //     onClose();
        //     return;
        // }
        // await createOrganizerShowtime(activityId, transformedData);
        // onClose();
    };

    const fetchGetAvailAreas = useCallback(async () => {
        const response = await getAvailAreas();
        if (response.data?.results) {
            setRegionList(response.data.results);
        }
    }, []);

    useEffect(() => {
        fetchGetAvailAreas();
        // fetchGetActivity();
    }, [fetchGetAvailAreas]);

    useEffect(() => {
        if (siteIdValue) {
            const site = organizerSiteList?.find(site => site.id === siteIdValue);
            if (site) setCurrentSite(site);
            console.log('siteIdValue site:', site);
        } else {
            setCurrentSite(undefined);
        }
    }, [siteIdValue, organizerSiteList]);

    useEffect(() => {
        if (siteId) {
            const site = organizerSiteList?.find(site => site.id === siteId);
            if (site) {
                setCurrentSite(site);
                resetFormData(site);
                // console.log('useEffect site:', site);
            } else
                resetFormData({
                    siteId: '',
                    areaId: 0,
                    name: '',
                    address: '',
                    seatingMapUrl: '',
                    prices: []
                })
        }
    }, [siteId, organizerSiteList, resetFormData]);

    return (
        <Modal show={!!showSiteModal} onHide={onClose} backdrop="static" keyboard={false} centered scrollable>
            <Modal.Header closeButton={false}>
                <Modal.Title className="text-center w-100">場地設定</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ManageSiteStack className=" mx-auto">
                    <Form.Group className="mb-3">
                        <Form.Label column xs={2} className="pe-0">
                            地區
                        </Form.Label>
                        <Col xs={10}>
                            <Controller
                                name="areaId"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <>
                                            <Form.Select
                                                aria-label="Default select example"
                                                {...field}
                                                className={errors.areaId?.message && 'is-invalid'}
                                            >
                                                <option value="" hidden>
                                                    請選擇地區
                                                </option>
                                                {regionList.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.areaId && (
                                                <Form.Text className="text-danger">
                                                    {errors.areaId.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    );
                                }}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label column xs={2} className="pe-0">
                            地點
                        </Form.Label>
                        <Col xs={10}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            {...field}
                                            value={field.value ?? ''}
                                            className={errors.name?.message && 'is-invalid'}
                                        />
                                        { errors.name && (
                                            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
                                        )}
                                    </>
                                )}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label column xs={2} className="pe-0">
                            地址
                        </Form.Label>
                        <Col xs={10}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Form.Control
                                            {...field}
                                            value={field.value ?? ''}
                                            className={errors.address?.message && 'is-invalid'}
                                        />
                                        { errors.address && (
                                            <Form.Text className="text-danger">{errors.address.message}</Form.Text>
                                        )}
                                    </>
                                )}
                            />
                        </Col>
                    </Form.Group>

                    <Col xs={12}>
                        <Form.Group as={Col} controlId="formGroupFirstName">
                            <Form.Label column>分區座位示意圖</Form.Label>
                            <Controller
                                name="seatingMapUrl"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <UploadImg url={field.value} onChange={url => field.onChange(url)} />
                                        {errors.seatingMapUrl && (
                                            <Form.Text className="text-danger">
                                                {errors.seatingMapUrl.message}
                                            </Form.Text>
                                        )}
                                    </>
                                )}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={10} className="mb-3">
                        <Form.Label column xs={5} className="pe-0">
                            分區座位價格
                        </Form.Label>
                        <Button variant="secondary" className="me-2" onClick={addZonePrice}>
                            <Icon src={AddIcon} />
                            新增分區
                        </Button>
                    </Col>


                    <Col xs={10} className="d-flex gap-2 mb-2">
                    {/* 表頭列 */}
                        <div style={{ flex: 1 }} className="text-center fw-bold">分區</div>
                        <div style={{ flex: 1 }} className="text-center fw-bold">人數上限</div>
                        <div style={{ flex: 1 }} className="text-center fw-bold">金額</div>
                        <div style={{ width: '40px' }} /> {/* 空出刪除鈕的位置 */}
                    </Col>

                    {/* 輸入列 */}
                    {currentSite?.prices.map((zone, idx) => (
                        <div key={idx} className="d-flex gap-2 mb-2 align-items-center">
                            <Form.Control
                                placeholder="分區"
                                value={zone.section}
                                // onChange={(e) => updateZone(idx, 'section', e.target.value)}
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
                                        // updateZone(idx, 'capacity', val === '' ? 0 : Number(val));
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
                                        // updateZone(idx, 'price', value === '' ? 0 : Number(value));
                                    }
                                }}
                                inputMode="numeric" // 行動裝置輸入優化
                                style={{ flex: 1 }}
                            />
                            <Button
                                variant="outline-danger"
                                onClick={() => removeZonePrice(idx)}
                                style={{ width: '40px' }}
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    ))}

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
