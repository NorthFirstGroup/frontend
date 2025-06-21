import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import z from 'zod';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import TimeUtils from '@utils/TimeUtils';
import { OrganizerActivitySite } from '@api/organizerAPI';
import { useParams } from 'react-router-dom';
import { useSiteContext } from '@contexts/context/SiteContext';
import { useShowtimeContext } from '@contexts/context/ShowtimeContext';
import useManageActivityLogic from '@hooks/useMamageActivityLogic';

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
        startAt: z.date({ required_error: '開始時間為必填' }).nullable(),
        siteId: z.string({ required_error: '演出地點為必填' })
    })
    .refine(data => data.startAt !== null, {
        message: '開始時間為必填',
        path: ['startAt']
    });
type FormData = z.infer<typeof createSiteSchema>;

const createSiteSchemaTransformed = createSiteSchema.transform(data => {
    if (data.startAt) {
        return {
            ...data,
            startAt: TimeUtils.timeFormatter(data.startAt)
        };
    } else {
        throw new Error('開始時間為必填');
    }
});

const todayDate = dayjs().startOf('day').toDate(); // 取得今天日期（不含時間）

const ShowTimeModal = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const { showTimeModal } = useManageActivityContext();
    const { toggleShowTimeModal } = useManageActivityLogic();
    const { organizerSiteList } = useSiteContext();
    const { organizerShowTimeList, createOrganizerShowtime, updateOrganizerShowtime } = useShowtimeContext();
    const [currentSite, setCurrentSite] = useState<OrganizerActivitySite | undefined>(undefined);
    const showTimeId = typeof showTimeModal === 'string' ? showTimeModal : undefined;

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
        toggleShowTimeModal(false);
        resetFormData({
            startAt: null,
            siteId: ''
        });
        setCurrentSite(undefined);
    };
    const onFormSubmit = () => {
        handleSubmit(onSubmit, errors => {
            console.log('Form errors:', errors);
        })();
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        if (!activityId) return;
        // 解析後Date轉換為字串
        const transformedData = createSiteSchemaTransformed.parse(data);
        if (activityId && showTimeId) {
            await updateOrganizerShowtime(activityId, showTimeId, transformedData);
            onClose();
            return;
        }
        await createOrganizerShowtime(activityId, transformedData);
        onClose();
    };

    useEffect(() => {
        if (siteIdValue) {
            const site = organizerSiteList?.find(site => site.id === siteIdValue);
            if (site) setCurrentSite(site);
        } else {
            setCurrentSite(undefined);
        }
    }, [siteIdValue, organizerSiteList]);

    useEffect(() => {
        if (showTimeId) {
            const showTime = organizerShowTimeList?.find(showtime => showtime.id === showTimeId);
            const site = organizerSiteList?.find(site => site.id === showTime?.siteId);
            if (site && showTime) {
                setCurrentSite(site);
                resetFormData({ startAt: new Date(showTime.startTime), siteId: site.id });
            } else {
                resetFormData({
                    startAt: null,
                    siteId: ''
                });
            }
        }
    }, [showTimeId, organizerSiteList, organizerShowTimeList, resetFormData]);

    return (
        <Modal show={!!showTimeModal} onHide={onClose} backdrop="static" keyboard={false} centered scrollable>
            <Modal.Header closeButton={false}>
                <Modal.Title className="text-center w-100">場次設定</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ManageSiteStack className=" mx-auto">
                    <form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column xs={2} className="pe-0">
                                開始時間
                            </Form.Label>
                            <Col xs={10}>
                                <Controller
                                    name="startAt"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                className={`form-control ${errors.startAt?.message && 'is-invalid'}`}
                                                selected={field.value}
                                                onChange={field.onChange}
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy hh:mm"
                                                minDate={todayDate}
                                                showTimeInput
                                                isClearable
                                                placeholderText="請選擇開始時間"
                                            />
                                            {errors.startAt && (
                                                <Form.Text className="ps-2 text-danger">
                                                    {errors.startAt.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column xs={2} className="pe-0">
                                活動場地
                            </Form.Label>
                            <Col xs={10}>
                                <Controller
                                    name="siteId"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <Form.Select
                                                    aria-label="Default select example"
                                                    {...field}
                                                    className={errors.siteId?.message && 'is-invalid'}
                                                    disabled={!!showTimeId}
                                                >
                                                    <option value="">請選擇</option>
                                                    {organizerSiteList?.map(site => (
                                                        <option key={site.id} value={site.id}>
                                                            {site.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.siteId && (
                                                    <Form.Text className="text-danger">
                                                        {errors.siteId.message}
                                                    </Form.Text>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </Col>
                        </Form.Group>
                    </form>
                    {currentSite && (
                        <Row className="mb-3 flex-column">
                            <Form.Label column xs={12} className="pe-0">
                                分區座位示意圖
                            </Form.Label>
                            <Col xs={12}>
                                <ImageWrapper className="d-flex justify-content-center align-items-center p-0">
                                    <SiteImg src={currentSite.seatingMapUrl} />
                                </ImageWrapper>
                            </Col>
                        </Row>
                    )}
                    {currentSite && (
                        <Row className="mb-3 flex-column">
                            <Form.Label column xs={12} className="pe-0">
                                分區座位價格
                            </Form.Label>
                            <Col xs={12}>
                                <BorderWrapper>
                                    <Row className="mb-2 text-center fw-bold">
                                        <Col>分區</Col>
                                        <Col>人數上限</Col>
                                        <Col>金額</Col>
                                    </Row>
                                    {currentSite.prices.map((price, index) => (
                                        <Row key={`${price}${index}`} className="mb-2 text-center">
                                            <Col>{price.section}</Col>
                                            <Col>{price.capacity}</Col>
                                            <Col>${price.price}</Col>
                                        </Row>
                                    ))}
                                </BorderWrapper>
                            </Col>
                        </Row>
                    )}
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
export default ShowTimeModal;
