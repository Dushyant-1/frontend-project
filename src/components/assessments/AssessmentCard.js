import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';

const AssessmentCard = ({ assessment, onDelete }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{assessment.title}</span>
          <Badge bg={assessment.isActive ? "success" : "secondary"}>
            {assessment.isActive ? "Active" : "Draft"}
          </Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Course: {assessment.courseTitle}
        </Card.Subtitle>
        <Card.Text>{assessment.description}</Card.Text>
        <div className="mt-3">
          <small className="text-muted">
            Questions: {assessment.questionCount} | Duration: {assessment.duration} mins
          </small>
        </div>
        <div className="mt-3 d-flex gap-2">
          <Button
            as={Link}
            to={`/instructor/assessments/edit/${assessment.id}`}
            variant="outline-primary"
            size="sm"
          >
            <FaEdit className="me-1" /> Edit
          </Button>
          <Button
            as={Link}
            to={`/instructor/assessments/results/${assessment.id}`}
            variant="outline-info"
            size="sm"
          >
            <FaChartBar className="me-1" /> Results
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(assessment.id)}
          >
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AssessmentCard; 