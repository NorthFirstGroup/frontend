// src/components/PopularActivitiesSection.tsx
import React, { useState, useEffect } from 'react';
import ActivitySection from '../ActivitySection';
import { ApiResponse } from '../../types/ApiResponse';
import { FrontpageActivity } from '../../types/home';
import { getHotTopicActivities } from '../../api/frontpage';

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
        return <div>Loading popular activities...</div>; // Or a more sophisticated spinner
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>; // Display error message
    }

    // You can customize the layout here if "popular" section needs a different one
    // For now, it reuses the generic ActivitySection
    return <ActivitySection title="發燒主題" activities={activities} />;
};

export default HotTopicActivitiesSection;
