import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaChartBar } from 'react-icons/fa';

const InstructorDashboard = () => {
  return (
    <Container>
      <h2 className="mb-4">Instructor Dashboard</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaBook size={48} className="text-primary mb-3" />
              <Card.Title>Manage Courses</Card.Title>
              <Card.Text>View, create, edit, and delete your courses.</Card.Text>
              <Button as={Link} to="/instructor/courses" variant="primary">
                Go to Courses
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaTasks size={48} className="text-success mb-3" />
              <Card.Title>Manage Assessments</Card.Title>
              <Card.Text>Create and manage quizzes and assignments for your courses.</Card.Text>
              <Button as={Link} to="/instructor/assessments" variant="success">
                Go to Assessments
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FaChartBar size={48} className="text-info mb-3" />
              <Card.Title>Analytics</Card.Title>
              <Card.Text>View student performance and quiz analytics.</Card.Text>
              <Button as={Link} to="/instructor/analytics" variant="info">
                Go to Analytics
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorDashboard; 