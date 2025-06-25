import { Col, Nav, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import Loading from '@components/Loading';
import styled from 'styled-components';
import { CategoryBadge, CustomRow, fontStyle, PageTitle } from '@components/common';
import useActivity from '@hooks/useActivity';
import Icon from '@components/Icon';
import CalenderIcon from '@assets/icons/calender.png';
import LocationIcon from '@assets/icons/area.png';
import TimeUtils from '@utils/TimeUtils';
import ActivityShowTimes from './ActivityShowTimes';
import { isMobile } from 'react-device-detect';

const ActivityPage = styled.div``;
const PageContent = styled.div``;
const Block = styled.div``;
const BorderedBlock = styled(Block)`
    border-bottom: 1px solid var(--gt-gray-200);
`;
const DesktopImg = styled.img`
    width: 100%;
    border-radius: 24px;
`;
const InfoCard = styled.div`
    border: 1px solid var(--gt-gray-200);
    border-radius: 24px;
    padding: 48px;
    background-color: var(--bs-white);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    ${isMobile && 'padding: 16px;'}
`;
const InfoCardTitle = styled.div`
    ${fontStyle('32px', '120%', '700')};
    text-align: center;
    margin-bottom: 24px;
`;
const HighlightText = styled.span`
    color: var(--bs-primary);
`;
const NavLink = styled(Nav.Link)`
    ${fontStyle('18px', '120%', '600')};
    padding: 12px !important;
`;
const ActivityDetailPage = () => {
    const { activityId } = useParams<{ activityId: string }>();

    const [startTimeRange, setStartTimeRange] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);

    const numActivityId = Number(activityId);
    const { getActivityDetail, activityDetail, getActivityShowtimeList, showTimeResult } = useActivity(numActivityId);
    const { results: showTimesList } = showTimeResult || {};

    useEffect(() => {
        getActivityDetail();
        getActivityShowtimeList();
    }, [getActivityDetail, getActivityShowtimeList]);

    useEffect(() => {
        if (showTimesList) {
            const startTimes: number[] = [];
            const locations: string[] = [];
            showTimesList.forEach(item => {
                startTimes.push(item.startTime);
                locations.push(item.location);
            });
            const [early, late] = TimeUtils.getTimeRange(startTimes);
            setStartTimeRange([TimeUtils.timeFormatter(early), TimeUtils.timeFormatter(late)]);
            setLocations(locations);
        }
    }, [showTimesList]);

    useEffect(() => {
        // document.body.style.backgroundColor = '#FCFCFC'; // 背景顏色
    }, []);
    return (
        <Suspense fallback={<Loading />}>
            {activityDetail && (
                <ActivityPage>
                    <PageContent>
                        <Block className="mb-3">
                            <Row>
                                <Col md={6}>
                                    <DesktopImg src={activityDetail.coverImage} />
                                </Col>
                                <Col>
                                    <Stack>
                                        <CategoryBadge>{activityDetail?.category}</CategoryBadge>
                                        <PageTitle>{activityDetail?.name}</PageTitle>
                                        <CustomRow className="mb-2">
                                            <Icon src={CalenderIcon} />
                                            <span>
                                                {startTimeRange[0]} - {startTimeRange[1]}
                                            </span>
                                        </CustomRow>
                                        <CustomRow>
                                            <Icon src={LocationIcon} />
                                            <span>{locations.join('、')}</span>
                                        </CustomRow>
                                    </Stack>
                                </Col>
                            </Row>
                        </Block>
                        <BorderedBlock>
                            <Nav variant="underline" defaultActiveKey="info">
                                <Nav.Item className="me-2">
                                    <NavLink eventKey="info" href="#info">
                                        購票資訊
                                    </NavLink>
                                </Nav.Item>
                                <Nav.Item className="me-2">
                                    <NavLink eventKey="introduction" href="#introduction">
                                        節目介紹
                                    </NavLink>
                                </Nav.Item>
                                <Nav.Item className="me-2">
                                    <NavLink eventKey="notice" href="#notice">
                                        重要須知
                                    </NavLink>
                                </Nav.Item>
                            </Nav>
                        </BorderedBlock>
                    </PageContent>
                    <PageContent className="py-4">
                        <InfoCard className="mb-3" id="activity-info">
                            <InfoCardTitle>
                                <HighlightText>購票</HighlightText>資訊
                            </InfoCardTitle>
                            {showTimesList ? (
                                <ActivityShowTimes showTimesList={showTimesList} />
                            ) : (
                                <p>活動籌備中，敬請期待！</p>
                            )}
                        </InfoCard>
                        <InfoCard className="mb-3" id="introduction">
                            <InfoCardTitle>
                                <HighlightText>節目</HighlightText>介紹
                            </InfoCardTitle>
                            <p style={{ whiteSpace: 'pre-line' }}>{activityDetail?.description}</p>
                        </InfoCard>
                        <InfoCard className="mb-3" id="notice">
                            <InfoCardTitle>
                                <HighlightText>重要</HighlightText>須知
                            </InfoCardTitle>
                            <p style={{ whiteSpace: 'pre-line' }}>{activityDetail?.information}</p>
                        </InfoCard>
                    </PageContent>
                </ActivityPage>
            )}
        </Suspense>
    );
};
export default ActivityDetailPage;
