// src/components/SellingOutActivitiesSection.tsx

import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import ActivitySection from './ActivitySection';
import { ApiResponse } from '@type/ApiResponse';
import { FrontpageActivity } from '@type/home';
import { getLowStockActivities } from '@api/frontpage';
import { BsLightningChargeFill } from 'react-icons/bs';

const SellingOutActivitiesSection: React.FC = () => {
    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLowStockActivities = async () => {
            try {
                const response: ApiResponse<FrontpageActivity[]> = await getLowStockActivities();
                if (response.data) {
                    // TODO: 目前 API 取得的資料可能會有重複的活動
                    // setActivities(response.data);

                    // TODO: 目前先手動移除重複資料，並用 activity.id 降幂排序
                    //       等後端 API 修正後再移除這段程式碼
                    const dataSet = response.data.reduce((acc: { [key: string]: FrontpageActivity }, activity) => {
                        const id = activity.id;
                        if (!acc[id]) {
                            acc[id] = activity;
                        }
                        return acc;
                    }, {});
                    const result = Object.values(dataSet);
                    const sortedResult = result.sort((a, b) => b.id - a.id);
                    setActivities(sortedResult);
                }
            } catch (err) {
                console.error('Error fetching selling out activities:', err);
                setError('Failed to load selling out activities.');
            } finally {
                setLoading(false);
            }
        };
        fetchLowStockActivities();
    }, []);

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <div className="text-danger">錯誤：{error}</div>;
    }

    if (activities.length === 0) {
        return null;
    }

    return (
        <ActivitySection
            title="即將完售"
            subtitle="剩下不多啦！這些活動快要賣光，手刀搶票別猶豫！"
            activities={activities}
            iconSvg={BsLightningChargeFill}
            initialRows={2}
            cardsPerRow={3}
            searchKeyword="即將完售"
            showRemainingSeats={true}
        />
    );
};

export default SellingOutActivitiesSection;
