import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const StudentAssessments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch enrolled courses
        const enrolledResponse = await api.get('/Enrollment/student');
        const enrolledCourses = enrolledResponse.data;
        setEnrolledCourses(enrolledCourses);

        // Then, fetch assessments for each enrolled course
        const courseIds = enrolledCourses.map(course => course.id);
        const assessmentsPromises = courseIds.map(courseId => 
          api.get(`/Assessment/course/${courseId}`)
        );

        const assessmentResponses = await Promise.all(assessmentsPromises);
        const allAssessments = assessmentResponses.flatMap((response, index) => 
          response.data.map(assessment => ({
            ...assessment,
            courseTitle: enrolledCourses[index].title,
            courseId: enrolledCourses[index].id
          }))
        );

        // Filter out assessments that are past due date
        const currentDate = new Date();
        const activeAssessments = allAssessments.filter(assessment => 
          new Date(assessment.dueDate) > currentDate
        );

        setAssessments(activeAssessments);
      } catch (err) {
        setError('Failed to load assessments');
        toast.error('Failed to load assessments');
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Available Assessments</h2>
      
      {assessments.length === 0 ? (
        <Alert variant="info">
          No assessments available at the moment. Check back later for new assessments.
        </Alert>
      ) : (
        <Row className="g-4">
          {assessments.map(assessment => (
            <Col key={assessment.id} md={6} lg={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{assessment.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Course: {assessment.courseTitle}
                  </Card.Subtitle>
                  <Card.Text>{assessment.description}</Card.Text>
                  <div className="mb-3">
                    <Badge bg="info" className="me-2">
                      {assessment.type}
                    </Badge>
                    <Badge bg="secondary">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Questions: {assessment.questions?.length || 0} | 
                      Total Marks: {assessment.totalMarks}
                    </small>
                    <Button
                      as={Link}
                      to={`/student/assessments/${assessment.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Take Assessment
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentAssessments; 