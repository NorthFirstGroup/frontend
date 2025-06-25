import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Pagination, Spinner, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ActivityCard from '@components/Home/ActivityCard';
import { FrontpageActivity } from '@type/home'; // Adjust path if necessary
import {
    activityStatusMap,
    organizerSearchParams,
    OrganizerOneActivityData,
    getOrganizerActivities,
    deleteOrganizerActivities
} from '@api/organizer';
import { Categories, Category } from '@api/category';

const ActivityList: React.FC = () => {
    const [filterType, setFilterType] = useState(0);
    const [filterStatus, setFilterStatus] = useState(0);
    const [searchName, setSearchName] = useState<string>('');
    const [activities, setActivities] = useState<FrontpageActivity[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<{ id: number; name: string } | null>(null);

    const itemsPerPage = 6;

    const navigate = useNavigate();

    // Function to fetch activities from backend
    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const getParams: organizerSearchParams = {
                name: searchName || '',
                limit: itemsPerPage,
                offset: (currentPage - 1) * itemsPerPage
            };
            if (filterStatus !== 0) getParams.status = Number(filterStatus);
            if (filterType !== 0) getParams.category = Number(filterType);

            const response = await getOrganizerActivities(getParams);

            if (response.status_code === 2000 && response.data) {
                const fetchedActivities: FrontpageActivity[] = response.data.results.map(
                    (e: OrganizerOneActivityData) => ({
                        id: e.id,
                        category: e.category.name,
                        start_time: e.start_time,
                        end_time: e.end_time,
                        name: e.name,
                        cover_image: e.cover_image,
                        status: activityStatusMap[e.status]
                    })
                );
                setActivities(fetchedActivities);
                setTotalPages(Math.ceil(response.data.total_count / itemsPerPage));
            } else {
                setError(response.message || 'Failed to fetch activities.');
                setActivities([]); // Clear activities on error
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError('Failed to load activities. Please try again later.');
            setActivities([]); // Clear activities on error
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [searchName, filterStatus, filterType, currentPage, itemsPerPage]); // Dependencies for useCallback

    // Effect hook to call fetchActivities when dependencies change
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]); // fetchActivities is already memoized by useCallback

    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterStatus, searchName]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const confirmDelete = (activityId: number, activityName: string) => {
        setActivityToDelete({ id: activityId, name: activityName });
        setShowDeleteConfirmModal(true);
    };

    // Function to handle the actual deletion after modal confirmation
    const executeDelete = async () => {
        if (activityToDelete) {
            const response = await deleteOrganizerActivities(activityToDelete.id); // Assuming deleteOrganizerActivities exists
            if (response.status_code === 2000) {
                setActivities(prev => prev.filter(act => act.id !== activityToDelete.id));
                // Optional: show a success toast/message
            } else {
                // Handle error: show an error toast/message
            }
            setActivityToDelete(null); // Clear pending deletion
            setShowDeleteConfirmModal(false); // Hide the modal
        }
    };

    // Function to close the modal without deleting
    const cancelDelete = () => {
        setActivityToDelete(null);
        setShowDeleteConfirmModal(false);
    };

    // Replace your handleDelete with this
    // This is called directly by your delete button onClick
    const handleDeleteButtonClick = (activityId: number, activityName: string) => {
        confirmDelete(activityId, activityName);
    };

    const handleEdit = (activityId: number) => {
        console.log('編輯活動 ID from ActivityList:', activityId);
        navigate(`/organizer/activity/manage/${activityId}`);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <Container fluid className="activity-list-container p-0">
            {/* Header and Filter Section remain the same */}
            {/* ... (your existing Navbar and Filter Form code) ... */}

            <Container className="main-content py-4">
                <h3 className="mb-4">活動管理</h3>

                {/* Section 1: Filter/Search Form */}
                <div className="filter-section p-3 mb-4 rounded shadow-sm">
                    <Form onSubmit={handleSearch}>
                        <Row className="g-3 align-items-end">
                            <Col xs={12} md={4} lg={3}>
                                <Form.Group controlId="filterType">
                                    <Form.Label>類型</Form.Label>
                                    <Form.Select
                                        value={filterType}
                                        onChange={e => setFilterType(Number(e.target.value))}
                                    >
                                        <option value={0}>全部</option>
                                        {Categories.map((cat: Category) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4} lg={3}>
                                <Form.Group controlId="filterStatus">
                                    <Form.Label>活動狀態</Form.Label>
                                    <Form.Select
                                        value={filterStatus}
                                        onChange={e => setFilterStatus(Number(e.target.value))}
                                    >
                                        {activityStatusMap.map((value, index) => (
                                            <option key={index} value={index}>
                                                {value}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4} lg={4}>
                                <Form.Group controlId="searchName">
                                    <Form.Label>活動名稱</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="請輸入活動名稱"
                                        value={searchName}
                                        onChange={e => setSearchName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={12} lg={2} className="d-flex justify-content-lg-end">
                                <Button variant="primary" type="submit" className="w-100">
                                    搜尋
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Section 2: Activity List */}
                <div className="activity-list-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="mb-0">活動清單</h4>
                        <Button variant="secondary" onClick={() => navigate('/organizer/activity/manage/create')}>
                            <FaPlus className="me-2" />
                            新增活動
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-2">載入中...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger my-5 text-center">
                            {error}
                            <button className="btn btn-link" onClick={fetchActivities}>
                                重試
                            </button>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="alert alert-info my-5 text-center">沒有找到符合條件的活動。</div>
                    ) : (
                        <Row>
                            {activities.map(activity => (
                                <Col xs={12} md={6} lg={4} className="mb-4" key={activity.id}>
                                    <ActivityCard
                                        activity={activity}
                                        hasShadow={true}
                                        isEditable={true}
                                        onEdit={handleEdit} // Pass if you defined a custom handler in ActivityList
                                        onDelete={handleDeleteButtonClick}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}

                    {/* Pagination */}
                    {activities.length > 0 && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-center">
                                <Pagination>
                                    <Pagination.Prev
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    />
                                    {[...Array(totalPages)].map((_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === currentPage}
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </Col>
                        </Row>
                    )}
                </div>
                <Modal show={showDeleteConfirmModal} onHide={cancelDelete} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>確認刪除</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        確定要刪除活動: <strong>{activityToDelete?.name}</strong> 嗎？此操作無法復原。
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={cancelDelete}>
                            取消
                        </Button>
                        <Button variant="danger" onClick={executeDelete}>
                            確定刪除
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Container>
    );
};

export default ActivityList;
