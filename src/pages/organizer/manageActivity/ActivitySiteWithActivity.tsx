import Icon from '@components/Icon';
import { Col, Row } from 'react-bootstrap';
import styled, { css } from 'styled-components';
import Delete from '@assets/icons/delete.png';
import Edit from '@assets/icons/edit.png';
import Person from '@assets/icons/person.png';
import TimeUtils from '@utils/TimeUtils';
import Calendar from '@assets/icons/calender.png';
import Ticket from '@assets/icons/ticket.png';
import { ActivityShowtime } from '@api/activityAPI';
import { useSiteContext } from '@contexts/context/SiteContext';
import useManageActivityLogic from '@hooks/useManageActivityLogic';
import { useShowtimeContext } from '@contexts/context/ShowtimeContext';
import { isMobile } from 'react-device-detect';

const BorderWrapper = styled.div`
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--bs-border-color);
`;
const mobileCss = css`
    padding: 0;
    .first-col {
        margin: 16px 16px 0;
    }
    .second-col {
        padding: 0;
    }
`;
const BorderWrapperShow = styled.div`
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--bs-border-color);
    ${isMobile && `${mobileCss}`}
`;

const Title = styled.div`
    font-weight: 700;
    font-size: 18px;
    line-height: 120%;
`;

const ButtonRow = styled.div`
    display: flex;
    margin: 0 16px;
`;
const MobileButton = styled.div<{}>`
    cursor: pointer;
    display: flex;
    padding: 8px 16px;
    justify-content: center;
`;
type ShowTimeProps = {
    showTimeList: ActivityShowtime[];
    activityId: number;
    siteId: string;
};

const ActivitySiteWithActivity = (props: ShowTimeProps) => {
    const { showTimeList, siteId, activityId } = props;
    const { organizerSiteList } = useSiteContext();
    const { toggleShowTimeModal, toggleSiteModal } = useManageActivityLogic();
    const { deleteOrganizerShowtime } = useShowtimeContext();
    const { deleteOrganizerSite } = useSiteContext();
    const siteData = organizerSiteList?.find(site => site.id === siteId);

    const handleSiteEdit = () => {
        console.log('Edit site :', siteId);
        toggleSiteModal(siteId);
    };
    const handleSiteDelete = async () => {
        console.log('Delete site :', siteId);
        await deleteOrganizerSite(activityId, siteId);
    };
    const handleShowTimeEdit = (showTimeId: string) => {
        toggleShowTimeModal(showTimeId);
    };
    const handleShowTimeDelete = async (showTimeId: string) => {
        await deleteOrganizerShowtime(activityId, showTimeId);
    };
    if (!siteData) return;
    return (
        <BorderWrapper className="mb-3">
            {/* className={`${isMobile && 'text-center mb-2' }` */}
            <Row className={`justify-content-between border-bottom mb-3 pb-3 ${isMobile && 'flex-column'}`}>
                <Col className={`${isMobile && 'mb-3'}`}>
                    <Title className="mb-2">{siteData.name}</Title>
                    <div>{siteData.address}</div>
                </Col>
                <Col xs="auto" className="d-flex align-items-center">
                    <Icon src={Edit} className="mx-3" onClick={handleSiteEdit} />
                    <Icon src={Delete} onClick={handleSiteDelete} />
                </Col>
            </Row>
            <p className="fw-bold">場次: </p>
            {showTimeList.map(showTime => {
                return (
                    <BorderWrapperShow key={showTime.id}>
                        <Row className={`${isMobile && 'flex-column'}`} w>
                            <Col className="first-col">
                                <Row className="mb-2">
                                    <Col className="d-flex align-items-center">
                                        <Icon src={Calendar} />
                                        {TimeUtils.timeFormatter(showTime.startTime, 'YYYY/MM/DD (dd) HH:mm')}
                                    </Col>
                                </Row>
                                <Row className={`${isMobile && 'flex-column mb-3'}`}>
                                    <Col className={`d-flex align-items-center ${isMobile && ' mb-2'}`}>
                                        <Icon src={Person} />
                                        <span>容納人數 : {siteData.seatCapacity} </span>
                                    </Col>
                                    <Col className="d-flex align-items-center">
                                        <Icon src={Ticket} />
                                        <span>
                                            票價 : {siteData.prices.map(price => `$${price.price}`).join(' | ')}{' '}
                                        </span>
                                    </Col>
                                    <Icon src={Edit} />
                                </Row>
                            </Col>
                            <Col
                                xs={12}
                                sm="auto"
                                className={`second-col${isMobile ? '' : ' d-flex align-items-center'}`}
                            >
                                {isMobile ? (
                                    <ButtonRow className="">
                                        <Col className="">
                                            <MobileButton
                                                className=" border-top border-end"
                                                onClick={() => handleShowTimeEdit(showTime.id)}
                                            >
                                                <Icon src={Edit} />
                                                編輯
                                            </MobileButton>
                                        </Col>
                                        <Col className="">
                                            <MobileButton
                                                className=" border-top "
                                                onClick={() => handleShowTimeDelete(showTime.id)}
                                            >
                                                <Icon src={Delete} width="16px" />
                                                刪除
                                            </MobileButton>
                                        </Col>
                                    </ButtonRow>
                                ) : (
                                    <>
                                        <Icon
                                            src={Edit}
                                            className="mx-3"
                                            onClick={() => handleShowTimeEdit(showTime.id)}
                                        />
                                        <Icon src={Delete} onClick={() => handleShowTimeDelete(showTime.id)} />
                                    </>
                                )}
                            </Col>
                        </Row>
                    </BorderWrapperShow>
                );
            })}
        </BorderWrapper>
    );
};

export default ActivitySiteWithActivity;
