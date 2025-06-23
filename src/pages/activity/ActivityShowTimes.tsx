import { Button, Col, Row, Table } from 'react-bootstrap';
import { ActivityShowtime } from '@api/activityAPI';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CustomRow } from '@components/common';
import Icon from '@components/Icon';
import CalenderIcon from '@assets/icons/calender.png';
import LocationIcon from '@assets/icons/area.png';
import addressIcon from '@assets/icons/address.png';
import TimeUtils from '@utils/TimeUtils';
import { isMobile } from 'react-device-detect';

const ContentWrapper = styled.div``;
const ShowTimeBlock = styled.div`
    margin-bottom: 24px;
`;

const CustomTable = styled(Table)<{}>`
    border: 1px solid var(--gt-gray-100);
    border-collapse: separate;
    border-spacing: 0; /* 移除間距 */
    border-radius: 12px; /* 生效！ */
    overflow: hidden;
    font-size: 14px;

    tbody tr:last-child td {
        border-bottom: none;
    }

    td {
        background-color: transparent;
        padding: 12px 24px;
        vertical-align: middle;
    }
    th {
        background-color: var(--gt-gray-100) !important;
        font-weight: 400;
        padding: 12px 24px;
    }
`;
const ColoredTd = styled.td<{ vacancy: number }>`
    color: ${({ vacancy }) => {
        if (vacancy > 0 && vacancy <= 10) return 'var(--bs-danger) !important';
        if (vacancy <= 0) return 'var(--gt-gray-500) !important';
        return 'inherit'; // 預設顏色
    }};
`;

type ActivityShowtimeProps = {
    showTimesList: ActivityShowtime[];
};

const ActivityShowTimes = (props: ActivityShowtimeProps) => {
    const { showTimesList } = props;
    const navigate = useNavigate();
    const { activityId } = useParams<{ activityId: string }>();

    const handleOnBuyTicket = (showTimeId: string) => {
        navigate(`/seatmap/activity/${activityId}/${showTimeId}`);
    };
    return (
        <ContentWrapper>
            {showTimesList.map(showTime => (
                <ShowTimeBlock key={showTime.id}>
                    <IconRow icon={CalenderIcon} text={TimeUtils.timeFormatter(showTime.startTime)} />
                    <IconRow icon={LocationIcon} text={showTime.location} />
                    <IconRow icon={addressIcon} text={showTime.address} />
                    <CustomTable responsive className="mt-2">
                        <thead>
                            <tr>
                                <th>區域</th>
                                <th>價格</th>
                                <th>剩餘座位</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {showTime.seats.map(seat => {
                                const { price, vacancy, section } = seat;
                                return (
                                    <tr key={seat.id}>
                                        <td>{section}</td>
                                        <td>${price}</td>
                                        <ColoredTd vacancy={vacancy}>{vacancy ? `${vacancy} 席` : '完售'}</ColoredTd>
                                        {!isMobile && (
                                            <td className="text-end">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleOnBuyTicket(showTime.id)}
                                                >
                                                    系統配位
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </CustomTable>
                    {isMobile && (
                        <Row className="justify-content-center">
                            <Col xs={12} sm={6} className="d-flex justify-content-center">
                                <Button
                                    variant="primary"
                                    className="w-100"
                                    onClick={() => handleOnBuyTicket(showTime.id)}
                                >
                                    系統配位
                                </Button>
                            </Col>
                        </Row>
                    )}
                </ShowTimeBlock>
            ))}
        </ContentWrapper>
    );
};
export default ActivityShowTimes;

const Text = styled.span`
    font-size: 16px;
    line-height: 150%;
`;

const IconRow = (props: { icon: string; text: string; margin?: string }) => {
    const { icon, text, margin } = props;
    return (
        <CustomRow className={` ${margin || 'mb-2'}`}>
            <Icon src={icon} />
            <Text>{text}</Text>
        </CustomRow>
    );
};
