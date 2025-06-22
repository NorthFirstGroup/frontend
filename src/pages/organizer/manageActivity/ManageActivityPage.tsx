import styled from 'styled-components';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Button, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import Icon from '@components/Icon';
import ArrowLeft from '@assets/icons/arrow-left.png';
import DatePicker from 'react-datepicker';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useManageActivityContext } from '@contexts/context/ManageActivityContext';
import { ManageActivityProvider } from '@contexts/ManageActivityProvider';
import { useAppContext } from '@contexts/context/AppContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import TimeUtils from '@utils/TimeUtils';
import UploadImg from './UploadImg';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ShowTimeModal from './ShowTimeModal';
import ActivitySiteWithActivity from './ActivitySiteWithActivity';
import toast from 'react-hot-toast';
import { ShowtimeProvider } from '@contexts/ShowtimeProvider';
import { useSiteContext } from '@contexts/context/SiteContext';
import { SiteProvider } from '@contexts/SiteProvider';
import useManageActivityLogic from '@hooks/useManageActivityLogic';
import { isMobile } from 'react-device-detect';
import { FaPlus } from 'react-icons/fa';

const ManageActivityHeader = styled.div`
    position: fixed;
    top: 66px;
    width: 100vw;
    background-color: var(--bs-light, #f8f9fa);
    height: auto;
    left: 0;
    padding: 10px 24px;
    z-index: 200;
    padding: 10px 80px 10px;
    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px; /* 陰影高度 */
        box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.3);
    }

    @media (max-width: 992px) {
        top: 60px;
        padding: 12px 16px 8px;
    }
`;

const ManageActivityStack = styled(Stack)`
    max-width: 992px;
    padding-top: 120px;
    display: flex;
    position: relative;
    min-height: 600px;
`;

const FormSwitch = styled(Form.Check)`
    .form-check-input {
        width: 60px;
        height: 30px;
    }
`;
const ManageShowTime = styled.div``;
const ResponsiveRow = styled(Row)`
    ${isMobile &&
    ` flex-direction: column;
    align-items: flex-center;
    justify-content: center;`}
`;

const createActiveSchema = z
    .object({
        name: z
            .string({ required_error: '活動名稱為必填' })
            .min(2, { message: '活動名稱至少 2 個字' })
            .max(100, { message: '活動名稱最多 100 個字' }),
        categoryId: z.number({ required_error: '類別為必填' }).min(1, { message: '請選擇類別' }),
        active: z.boolean(),
        timeRange: z
            .tuple([z.date().nullable(), z.date().nullable()], {
                errorMap: (issue, ctx) => {
                    if (issue.code === z.ZodIssueCode.too_small) {
                        return { message: '活動開始與結束日期為必填' };
                    }
                    return { message: ctx.defaultError };
                }
            })
            .refine(arr => arr[0] !== null, { message: '活動開始日期為必填' })
            .refine(arr => arr[1] !== null, { message: '活動結束日期為必填' }),

        salesStartTime: z.date({ required_error: '售票開始時間為必填' }).nullable(),
        salesEndTime: z.date({ required_error: '售票結束時間為必填' }).nullable(),
        coverImage: z.string({ required_error: '封面圖片為必填' }).url(),
        bannerImage: z.string().optional(),
        description: z.string({ required_error: '活動描述為必填' }).max(500),
        information: z.string({ required_error: '活動資訊為必填' }).max(500)
    })
    .refine(data => data.salesStartTime !== null, {
        message: '售票開始時間為必填',
        path: ['salesStartTime']
    })
    .refine(data => data.salesEndTime !== null, {
        message: '售票結束時間為必填',
        path: ['salesEndTime']
    })
    .superRefine((data, ctx) => {
        const { salesStartTime, salesEndTime } = data;
        if (salesStartTime && salesEndTime && salesEndTime < salesStartTime) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '不可早於售票開始時間',
                path: ['salesEndTime']
            });
        }
    });

const createActiveSchemaTransformed = createActiveSchema.transform(data => {
    const {
        timeRange, // 先取出 timeRange
        salesStartTime,
        salesEndTime,
        ...rest
    } = data;
    if (!salesStartTime || !salesEndTime) {
        throw new Error('salesStartTime 和 salesEndTime 不能為空');
    }
    return {
        ...rest,
        status: data.active ? 2 : 1,
        salesEndTime: TimeUtils.timeFormatter(salesEndTime),
        salesStartTime: TimeUtils.timeFormatter(salesStartTime),
        startTime: TimeUtils.timeFormatter(timeRange[0]!),
        endTime: TimeUtils.timeFormatter(timeRange[1]!)
    };
});

type FormData = z.infer<typeof createActiveSchema>;
const todayDate = dayjs().startOf('day').toDate(); // 取得今天日期（不含時間）

export const ManageActivity = () => {
    const navigate = useNavigate();
    const { activityId } = useParams<{ activityId: string }>();
    const { activityDetail, createActivity, updateActivity, organizerSiteMap } = useManageActivityContext();
    const { organizerSiteList } = useSiteContext();
    const { manageActivityInit, resetActivityDetail, toggleShowTimeModal, toggleSiteModal } = useManageActivityLogic();
    const { categoryList } = useAppContext();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetFormData,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(createActiveSchema),
        defaultValues: {
            timeRange: [], // 預設空陣列，避免 undefined
            active: false
        }
    });

    const salesStartTime = watch('salesStartTime');

    const handlePrevPage = () => {
        resetActivityDetail(); // 重置活動詳情
        navigate(-1);
    };
    const handleAddSite = () => {
        toggleSiteModal(true);
    };
    const handleAddShowTime = () => {
        if (!organizerSiteList?.length) {
            toast('請先新增場地!', {
                icon: '👏'
            });
            return;
        }

        toggleShowTimeModal(true);
    };

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        // 解析後Date轉換為字串
        const transformedData = createActiveSchemaTransformed.parse(data);
        if (activityId) {
            await updateActivity(Number(activityId), transformedData);
            return;
        }
        await createActivity(transformedData);
    };

    useEffect(() => {
        if (activityId) manageActivityInit(activityId);
    }, [activityId, manageActivityInit]);

    useEffect(() => {
        if (activityDetail) {
            resetFormData({
                ...activityDetail,
                active: activityDetail.status === 2, // 將狀態轉換為布林值
                salesStartTime: dayjs(activityDetail.salesStartTime).toDate(),
                salesEndTime: dayjs(activityDetail.salesEndTime).toDate(),
                timeRange: TimeUtils.stringToDate([activityDetail.startTime, activityDetail.endTime]) as [Date, Date]
            });
        }
    }, [activityDetail, resetFormData]);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center">
            <ManageActivityStack gap={3} className=" mx-auto">
                <form
                    onSubmit={handleSubmit(onSubmit, errors => {
                        console.log('Form errors:', errors);
                    })}
                >
                    <ManageActivityHeader className="d-flex justify-content-between align-items-center">
                        <Row className="align-items-center justify-content-between w-100 flex-nowrap">
                            <Col xs="auto">
                                <Button variant="light" className="me-2" onClick={handlePrevPage}>
                                    <Icon src={ArrowLeft} height="12px" width="auto" /> 返回
                                </Button>
                            </Col>
                            <Col xs="auto">
                                <div className="d-flex align-items-center">
                                    <Form.Label className="m-0">活動是否公開</Form.Label>
                                    <Controller
                                        name="active"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <FormSwitch
                                                    type="switch"
                                                    className="ms-1 ms-md-3 "
                                                    checked={field.value}
                                                    onChange={e => field.onChange(e.target.checked)}
                                                />
                                            );
                                        }}
                                    />
                                    <Button variant="primary" className="mx-2 mx-md-3" type="submit">
                                        {activityId ? '儲存' : '新增'}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </ManageActivityHeader>
                    <Row className="mb-2">
                        <Col xs={12} md={6}>
                            <Form.Group as={Col} controlId="formGroupFirstName">
                                <Form.Label column>活動名稱</Form.Label>
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
                                            {errors.name && (
                                                <Form.Text className="text-danger">{errors.name.message}</Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group as={Col} controlId="formGroupIceCreamType">
                                <Form.Label column>活動類型</Form.Label>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <Form.Select
                                                    aria-label="Default select example"
                                                    {...field}
                                                    className={errors.categoryId?.message && 'is-invalid'}
                                                    onChange={e => field.onChange(Number(e.target.value))} // 轉成數字
                                                >
                                                    <option value={-100}>請選擇</option>
                                                    {categoryList.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.categoryId && (
                                                    <Form.Text className="text-danger">
                                                        {errors.categoryId.message}
                                                    </Form.Text>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs={12} md={6}>
                            <Form.Group as={Row} controlId="formGroupIceCreamType">
                                <Form.Label column>活動開始 - 結束日期</Form.Label>
                                <Controller
                                    name="timeRange"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <DatePicker
                                                    className={`form-control ${errors.timeRange?.message && 'is-invalid'}`}
                                                    startDate={field.value?.[0] ?? null}
                                                    endDate={field.value?.[1] ?? null}
                                                    minDate={todayDate}
                                                    onChange={dates => {
                                                        field.onChange(dates);
                                                    }}
                                                    selectsRange
                                                    isClearable
                                                    dateFormat="yyyy/MM/dd"
                                                    placeholderText="請選擇日期範圍"
                                                />
                                                {errors.timeRange && (
                                                    <Form.Text className="text-danger">
                                                        {errors.timeRange.message}
                                                    </Form.Text>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group as={Row} controlId="formGroupIceCreamType">
                                <Form.Label column>售票開始時間</Form.Label>
                                <Controller
                                    name="salesStartTime"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                className={`form-control ${errors.timeRange?.message && 'is-invalid'}`}
                                                selected={field.value}
                                                onChange={field.onChange}
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy hh:mm"
                                                minDate={todayDate}
                                                showTimeInput
                                                isClearable
                                                placeholderText="請選擇售票開始時間"
                                            />
                                            {errors.salesStartTime && (
                                                <Form.Text className="text-danger">
                                                    {errors.salesStartTime.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={3}>
                            <Form.Group as={Row} controlId="formGroupIceCreamType">
                                <Form.Label column>售票結束時間</Form.Label>
                                <Controller
                                    name="salesEndTime"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <DatePicker
                                                className={`form-control ${errors.timeRange?.message && 'is-invalid'}`}
                                                selected={field.value}
                                                onChange={field.onChange}
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy hh:mm"
                                                minDate={salesStartTime || todayDate}
                                                showTimeInput
                                                isClearable
                                                placeholderText="請選擇售票結束時間"
                                            />
                                            {errors.salesEndTime && (
                                                <Form.Text className="text-danger">
                                                    {errors.salesEndTime.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs={12} md={6}>
                            <Form.Group as={Col} controlId="formGroupFirstName">
                                <Form.Label column>封面圖</Form.Label>
                                <Controller
                                    name="coverImage"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <UploadImg url={field.value} onChange={url => field.onChange(url)} />
                                            {errors.coverImage && (
                                                <Form.Text className="text-danger">
                                                    {errors.coverImage.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                            <Form.Group as={Col} controlId="formGroupFirstName">
                                <Form.Label column>宣傳海報</Form.Label>
                                <Controller
                                    name="bannerImage"
                                    control={control}
                                    render={({ field }) => (
                                        <UploadImg url={field.value} onChange={url => field.onChange(url)} />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-2 ps-2">
                        <Col xs={12}>
                            <Form.Group as={Row}>
                                <Form.Label column>活動簡介</Form.Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Form.Control
                                                {...field}
                                                as="textarea"
                                                placeholder="Leave a comment here"
                                                style={{ height: '200px', resize: 'none' }}
                                            />
                                            {errors.description && (
                                                <Form.Text className="text-danger">
                                                    {errors.description.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col />
                    </Row>
                    <Row className="mb-2 ps-2">
                        <Col xs={12}>
                            <Form.Group as={Row}>
                                <Form.Label column>活動資訊</Form.Label>
                                <Controller
                                    name="information"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Form.Control
                                                {...field}
                                                as="textarea"
                                                placeholder="Leave a comment here"
                                                style={{ height: '200px', resize: 'none' }}
                                            />
                                            {errors.information && (
                                                <Form.Text className="text-danger">
                                                    {errors.information.message}
                                                </Form.Text>
                                            )}
                                        </>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col />
                    </Row>
                </form>
                {activityId && (
                    <ManageShowTime className="mb-3">
                        <ResponsiveRow className="align-items-center mb-3">
                            <Col className={`${isMobile ? 'text-center mb-2' : ''}`}>
                                <h5>活動場地及場次</h5>
                            </Col>
                            <Col xs="auto">
                                <Button variant="secondary" className="me-2" onClick={handleAddSite}>
                                    <FaPlus className="me-2" />
                                    新增場地
                                </Button>
                                <Button variant="secondary" onClick={handleAddShowTime}>
                                    <FaPlus className="me-2" />
                                    新增場次
                                </Button>
                            </Col>
                        </ResponsiveRow>
                        {organizerSiteMap &&
                            Array.from(organizerSiteMap.keys()).map(siteId => {
                                const site = organizerSiteMap.get(siteId);
                                if (site) {
                                    return (
                                        <ActivitySiteWithActivity
                                            key={siteId}
                                            showTimeList={site}
                                            siteId={siteId}
                                            activityId={Number(activityId)}
                                        />
                                    );
                                }
                                return null;
                            })}
                    </ManageShowTime>
                )}
            </ManageActivityStack>
        </Container>
    );
};

export default function ManageActivityPage() {
    return (
        <SiteProvider>
            <ShowtimeProvider>
                <ManageActivityProvider>
                    <ManageActivity />
                    <ShowTimeModal />
                </ManageActivityProvider>
            </ShowtimeProvider>
        </SiteProvider>
    );
}
