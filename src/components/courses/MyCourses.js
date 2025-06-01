import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [unenrolling, setUnenrolling] = useState(false);
  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get('/Enrollment/student');
      console.log('Enrolled courses:', response.data);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load enrolled courses');
      console.error('Failed to load enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const handleUnenrollClick = (course) => {
    setSelectedCourse(course);
    setShowUnenrollModal(true);
  };

  const handleUnenrollConfirm = async () => {
    if (!selectedCourse) return;

    setUnenrolling(true);
    try {
      await api.delete(`/Enrollment/course/${selectedCourse.id}`);
      await fetchEnrolledCourses(); // Refresh the courses list
      toast.success('Successfully unenrolled from the course');
      setShowUnenrollModal(false);
    } catch (err) {
      toast.error('Failed to unenroll from the course');
      console.error('Unenrollment failed:', err);
    } finally {
      setUnenrolling(false);
      setSelectedCourse(null);
    }
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Courses</h2>
      {courses.length === 0 ? (
        <Alert variant="info">
          You haven't enrolled in any courses yet.{' '}
          <Link to="/student/dashboard">Browse available courses</Link>
        </Alert>
      ) : (
        <Row>
          {courses.map((course) => (
            <Col key={course.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Instructor: {course.instructorName}
                  </Card.Subtitle>
                  <Card.Text>{course.description}</Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      as={Link}
                      to={`/student/courses/${course.id}`}
                      variant="primary"
                    >
                      View Course
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleUnenrollClick(course)}
                    >
                      Unenroll
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Unenroll Confirmation Modal */}
      <Modal show={showUnenrollModal} onHide={() => setShowUnenrollModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Unenrollment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to unenroll from <strong>{selectedCourse?.title}</strong>?
          <br />
          <small className="text-muted">
            Note: This action cannot be undone. You will lose access to all course materials and assessments.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnenrollModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleUnenrollConfirm}
            disabled={unenrolling}
          >
            {unenrolling ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Unenrolling...
              </>
            ) : (
              'Confirm Unenroll'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyCourses; 