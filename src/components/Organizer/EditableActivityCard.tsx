// src/components/EditableActivityCard.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // <<< 導入 useNavigate
import { FaEdit, FaCopy, FaTrash } from 'react-icons/fa';
import ActivityCard from '../Home/ActivityCard'; // Import your read-only card
import { FrontpageActivity } from '../../types/home'; // Adjust path if necessary
import './EditableActivityCard.css'; // New CSS file for editable specific styles

interface EditableActivityCardProps {
    activity: FrontpageActivity;
    // You might want to pass down some props to ViewActivityCard if needed,
    // e.g., hasShadow, showRemainingSeats etc.
    hasBorder?: boolean;
    borderColor?: string;
    hasShadow?: boolean;
    showRemainingSeats?: boolean;

    // Handlers for the editable actions
    onCopy: (activityId: number) => void;
    onDelete: (activityId: number) => void;
}

const EditableActivityCard: React.FC<EditableActivityCardProps> = ({
    activity,
    hasBorder,
    borderColor,
    hasShadow,
    showRemainingSeats,
    onCopy,
    onDelete
}) => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchOrganizerActivities = async () => {
    //         try {
    //             const response: ApiResponse<FrontpageActivity[]> = await getHotTopicActivities();
    //             if (response.data) {
    //                 setActivities(response.data);
    //             }
    //         } catch (err) {
    //             console.error('Error fetching hot-topic activities:', err);
    //             setError('Failed to load hot-topic activities.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchHotTopicActivities();
    // }, []);

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the card's onClick from firing
        console.log('編輯活動 ID:', activity.id);
        navigate(`/organizer/activity-management/${activity.id}`); // Navigate to the single activity management page
    };

    const handleCopyClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the card's onClick from firing
        onCopy(activity.id);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the card's onClick from firing
        onDelete(activity.id);
    };

    return (
        <div className="editable-activity-card-wrapper">
            <ActivityCard
                activity={activity}
                hasBorder={hasBorder}
                borderColor={borderColor}
                hasShadow={hasShadow}
                showRemainingSeats={showRemainingSeats}
                // Note: ViewActivityCard already handles its own click for navigation.
                // We ensure our button clicks stop propagation to prevent double navigation.
            />
            <div className="editable-buttons-overlay">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 editable-btn edit-btn"
                    onClick={handleEditClick}
                >
                    <FaEdit />
                </Button>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 editable-btn copy-btn"
                    onClick={handleCopyClick}
                >
                    <FaCopy />
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    className="editable-btn delete-btn"
                    onClick={handleDeleteClick}
                >
                    <FaTrash />
                </Button>
            </div>
        </div>
    );
};

export default EditableActivityCard;
