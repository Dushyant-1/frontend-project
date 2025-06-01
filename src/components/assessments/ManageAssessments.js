import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ManageAssessments = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching assessments for courseId:', courseId);
        // Fetch assessments for the specific course
        const assessmentsRes = await api.get(`/Assessment/course/${courseId}`);
        setAssessments(assessmentsRes.data);
        // Note: Fetching course details here might be redundant if navigating from a course context.
        // Consider fetching course details on the previous page (ManageCourses) or a dedicated CourseDetail page.
        // If course title is needed here, you might pass it as state during navigation or fetch it separately if necessary.
        // For now, we'll rely on the courseId to fetch assessments.

      } catch (err) {
        setError('Failed to load assessments');
        toast.error('Failed to load assessments');
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) { // Only fetch if courseId is available
      fetchData();
    }
  }, [courseId]);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;

    try {
      // Use the correct backend endpoint for deleting an assessment
      await api.delete(`/Assessment/${assessmentId}`);
      setAssessments(assessments.filter(a => a.id !== assessmentId));
      toast.success('Assessment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete assessment');
      console.error('Failed to delete assessment:', err);
    }
  };

  const handlePublish = async (assessmentId) => {
    try {
      // Use the correct backend endpoint for publishing an assessment
      await api.put(`/Assessment/${assessmentId}/publish`);
      setAssessments(assessments.map(a =>
        a.id === assessmentId ? { ...a, isPublished: true } : a
      ));
      toast.success('Assessment published successfully');
    } catch (err) {
      toast.error('Failed to publish assessment');
      console.error('Failed to publish assessment:', err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  // We might not have course data fetched in this component anymore, 
  // so we should adjust the rendering logic if course title is needed.
  // For now, let's assume courseId is sufficient to fetch assessments.

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Update title display if course data is not fetched here */}
        <h2>Manage Assessments {courseId ? `for Course ID: ${courseId}` : ''}</h2>
        <Button
          as={Link}
          // Update the 'Create New Assessment' link to include courseId
          to={`/instructor/courses/${courseId}/assessments/create`}
          variant="primary"
        >
          Create New Assessment
        </Button>
      </div>

      <Row className="g-4">
        {assessments.map(assessment => (
          <Col key={assessment.id} md={6} lg={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{assessment.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Type: {assessment.type} | Total Marks: {assessment.totalMarks}
                </Card.Subtitle>
                <Card.Text>
                  <small>
                    Questions: {assessment.questions.length}
                  </small>
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    // Correct the 'to' prop to include courseId
                    to={`/instructor/courses/${courseId}/assessments/edit/${assessment.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  {!assessment.isPublished && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handlePublish(assessment.id)}
                    >
                      Publish
                    </Button>
                  )}
                  <Button
                    as={Link}
                    to={`/instructor/courses/${courseId}/assessments/${assessment.id}/results`}
                    variant="outline-info"
                    size="sm"
                  >
                    View Results
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(assessment.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {assessments.length === 0 && (
        <Alert variant="info">
          No assessments found. Create your first assessment to get started.
        </Alert>
      )}
    </Container>
  );
};

export default ManageAssessments; 