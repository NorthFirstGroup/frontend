// src/components/PopularActivitiesSection.tsx
import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import ActivitySection from './ActivitySection';
import { ApiResponse } from '@type/ApiResponse';
import { FrontpageActivity } from '@type/home';
import { getHotTopicActivities } from '@api/frontpage';
import { FaThumbsUp } from 'react-icons/fa6';

const HotTopicActivitiesSection: React.FC = () => {
    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        const fetchHotTopicActivities = async () => {
            try {
                const response: ApiResponse<FrontpageActivity[]> = await getHotTopicActivities();
                if (response.data) {
                    setActivities(response.data);
                }
            } catch (err) {
                console.error('Error fetching hot-topic activities:', err);
                setError('Failed to load hot-topic activities.');
            } finally {
                setLoading(false);
            }
        };
        fetchHotTopicActivities();
    }, []);

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Display error message
    }

    if (activities.length === 0) {
        return null;
    }

    return (
        <ActivitySection
            title="熱門推薦"
            subtitle="現在大家都在搶這些！熱門活動一次看，精彩不漏接。"
            activities={activities}
            iconSvg={FaThumbsUp}
            initialRows={2}
            cardsPerRow={3}
            searchKeyword="熱門"
            searchCategoryId="1"
            showRemainingSeats={false}
        />
    );
};

export default HotTopicActivitiesSection;
