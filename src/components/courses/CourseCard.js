import React from 'react';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const CourseCard = ({ course, showProgress = true, showActions = true, isInstructor, handleDelete }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>{course.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Instructor: {course.instructorName}
        </Card.Subtitle>
        <Card.Text>{course.description}</Card.Text>
        
        {showProgress && course.progress !== undefined && (
          <div className="mb-3">
            <ProgressBar
              now={course.progress}
              label={`${course.progress}%`}
              className="mb-2"
            />
            <small className="text-muted">
              {course.progress}% Complete
            </small>
          </div>
        )}

        {showActions && (
          <div className="d-flex gap-2">
            {isInstructor ? (
              <>
                <Button
                  as={Link}
                  to={`/instructor/courses/edit/${course.id}`}
                  variant="outline-primary"
                  size="sm"
                >
                  Edit Course
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                >
                  <FaTrash /> Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to={`/student/courses/${course.id}`}
                  variant="primary"
                  size="sm"
                >
                  {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </Button>
                {course.assessments && course.assessments.length > 0 && (
                  <Button
                    as={Link}
                    to={`/student/courses/${course.id}/assessments`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Assessments
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted">
        <small>
          Duration: {course.duration} hours | Level: {course.level}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default CourseCard; 