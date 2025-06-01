import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    allCourses: [],
    enrolledCourses: []
  });
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all courses
        const allCoursesRes = await api.get('/Course');
        
        // Fetch enrolled courses
        const enrolledCoursesRes = await api.get('/Enrollment/student');
        
        setDashboardData({
          allCourses: allCoursesRes.data,
          enrolledCourses: enrolledCoursesRes.data
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      // Check if already enrolled
      const isAlreadyEnrolled = dashboardData.enrolledCourses.some(
        course => course.id === courseId
      );

      if (isAlreadyEnrolled) {
        toast.warning('You are already enrolled in this course!');
        return;
      }

      setEnrollingCourseId(courseId);
      await api.post(`/Enrollment/course/${courseId}`);
      
      // Update the enrolled courses list
      const enrolledCoursesRes = await api.get('/Enrollment/student');
      setDashboardData(prev => ({
        ...prev,
        enrolledCourses: enrolledCoursesRes.data
      }));
      
      toast.success('Successfully enrolled in the course!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll in the course');
      console.error('Enrollment failed:', err);
    } finally {
      setEnrollingCourseId(null);
    }
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Student Dashboard</h2>

      <Row className="g-4">
        {/* Display All Available Courses */}
        <Col md={12}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>All Available Courses</span>
                <Button as={Link} to="/student/courses" variant="outline-primary" size="sm">
                  View My Courses
                </Button>
              </Card.Title>
              <Row className="g-3">
                {dashboardData.allCourses.map(course => {
                  const isEnrolled = dashboardData.enrolledCourses.some(
                    enrolledCourse => enrolledCourse.id === course.id
                  );
                  
                  return (
                    <Col key={course.id} sm={6} md={4} lg={3}>
                      <Card className="h-100">
                        <Card.Body>
                          <Card.Title>{course.title}</Card.Title>
                          <Card.Text>{course.description}</Card.Text>
                          {isEnrolled ? (
                            <Button
                              as={Link}
                              to={`/student/courses/${course.id}`}
                              variant="success"
                              size="sm"
                              className="me-2"
                            >
                              Continue Learning
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrollingCourseId === course.id}
                              className="me-2"
                            >
                              {enrollingCourseId === course.id ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-1"
                                />
                              ) : (
                                'Enroll'
                              )}
                            </Button>
                          )}
                          <Button
                            as={Link}
                            to={`/student/courses/${course.id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              {dashboardData.allCourses.length === 0 && !loading && (
                <Alert variant="info">No courses available yet.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard; 