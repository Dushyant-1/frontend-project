import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from './CourseCard';
import { toast } from 'react-toastify';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/course');
        setCourses(res.data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/Course/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
        toast.success('Course deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete course');
        console.error('Delete course failed:', err);
      }
    }
  };

  return (
    <Container>
      <Row className="mb-4 align-items-center">
        <Col><h2>Manage Courses</h2></Col>
        <Col className="text-end">
          <Button as={Link} to="/instructor/courses/create" variant="primary">
            + Create New Course
          </Button>
        </Col>
      </Row>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {courses.length === 0 && !loading && <p>No courses found.</p>}
        {courses.map(course => (
          <Col md={4} key={course.id} className="mb-4">
            <CourseCard course={course} isInstructor handleDelete={handleDeleteCourse} />
            <div className="mt-2 d-grid">
              <Button as={Link} to={`/instructor/courses/${course.id}/assessments`} variant="outline-secondary" size="sm">
                Manage Assessments
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ManageCourses; 