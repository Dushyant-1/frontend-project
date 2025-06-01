import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, ProgressBar, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AssessmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        // First check if student is enrolled in the course
        const assessmentResponse = await api.get(`/Assessment/${id}`);
        const assessmentData = assessmentResponse.data;
        
        // Check enrollment status
        const enrollmentResponse = await api.get(`/Enrollment/course/${assessmentData.courseId}`);
        setIsEnrolled(enrollmentResponse.data);

        if (!enrollmentResponse.data) {
          setError('You must be enrolled in this course to take the assessment');
          setLoading(false);
          return;
        }

        setAssessment(assessmentData);
        // Initialize answers object with empty values for each question
        const initialAnswers = {};
        assessmentData.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        setAnswers(initialAnswers);
        setTimeLeft(assessmentData.duration * 60); // Convert minutes to seconds
      } catch (err) {
        setError('Failed to load assessment');
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    // Check if all questions are answered
    const unansweredQuestions = Object.entries(answers).filter(([_, answer]) => !answer);
    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/Result/assessment/${id}/submit`, {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId: parseInt(questionId),
          selectedAnswer: answer
        }))
      });
      
      setAssessment(prev => ({
        ...prev,
        result: response.data
      }));
      setShowResults(true);
      toast.success('Assessment submitted successfully!');
    } catch (err) {
      setError('Failed to submit assessment');
      toast.error(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setShowResults(false);
    setAnswers({});
    setTimeLeft(assessment.duration * 60);
    setError('');
    // Reset the assessment state to allow a new submission
    setAssessment(prev => ({
      ...prev,
      result: null
    }));
  };

  useEffect(() => {
    // Only start timer or submit if assessment is loaded and not showing results
    if (!loading && assessment && !showResults) {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        // Automatically submit when time runs out
        handleSubmit();
      }
    }
  }, [timeLeft, showResults, loading, assessment, handleSubmit]); // Added loading, assessment, and handleSubmit as dependencies

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!assessment) return <Alert variant="warning">Assessment not found</Alert>;
  if (!isEnrolled) return <Alert variant="warning">You must be enrolled in this course to take the assessment</Alert>;

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{assessment.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            Course: {assessment.courseTitle}
          </Card.Subtitle>
          {!showResults && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>Time Remaining:</strong> {formatTime(timeLeft)}
              </div>
              <div>
                <strong>Questions:</strong> {assessment.questions.length}
              </div>
            </div>
          )}
          {showResults && assessment.result && (
            <div className="mb-3">
              <h4>Results</h4>
              <ProgressBar
                now={(assessment.result.marksObtained / assessment.totalMarks) * 100}
                label={`${assessment.result.marksObtained}/${assessment.totalMarks}`}
                variant={assessment.result.status === 'Passed' ? 'success' : 'danger'}
              />
              <div className="mt-2">
                <strong>Status:</strong>{' '}
                <span className={`badge bg-${assessment.result.status === 'Passed' ? 'success' : 'danger'}`}>
                  {assessment.result.status}
                </span>
              </div>
              <div className="mt-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/student/assessments')}
                >
                  Back to Assessments
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {!showResults ? (
        // Assessment Questions
        <div>
          {assessment.questions.map((question, index) => (
            <Card key={question.id} className="mb-3">
              <Card.Body>
                <Card.Title>Question {index + 1}</Card.Title>
                <Card.Text>{question.questionText}</Card.Text>
                <Form>
                  {['A', 'B', 'C', 'D'].map((option, optionIndex) => (
                    <Form.Check
                      key={optionIndex}
                      type="radio"
                      id={`question-${question.id}-option-${optionIndex}`}
                      name={`question-${question.id}`}
                      label={
                        <>
                          {question[`option${option}`]}
                          {showResults && answers[question.id] === option && (
                            <span className="ms-2 text-primary">Your Answer</span>
                          )}
                          {showResults && option === question.correctAnswer && (
                            <span className="ms-2 text-success">Correct Answer</span>
                          )}
                        </>
                      }
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="mb-2"
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>
          ))}

          <div className="text-center mt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </div>
        </div>
      ) : (
        // Results Review
        <div>
          {assessment.questions.map((question, index) => (
            <Card key={question.id} className="mb-3">
              <Card.Body>
                <Card.Title>Question {index + 1}</Card.Title>
                <Card.Text>{question.questionText}</Card.Text>
                <Form>
                  {['A', 'B', 'C', 'D'].map((option, optionIndex) => (
                    <Form.Check
                      key={optionIndex}
                      type="radio"
                      id={`question-${question.id}-option-${optionIndex}`}
                      name={`question-${question.id}`}
                      label={
                        <>
                          {question[`option${option}`]}
                          {/* Display Your Answer label only if this was the selected option */}
                          {showResults && answers[question.id] === option && (
                            <span className="ms-2 text-primary">Your Answer</span>
                          )}
                          {/* Display Correct Answer label if this option is the correct answer */}
                          {showResults && option === question.correctAnswer && (
                            <span className="ms-2 text-success">Correct Answer</span>
                          )}
                        </>
                      }
                      // In results review, check if the option is the correct answer for the checked state (or student's answer if incorrect)
                      checked={showResults ? option === question.correctAnswer : answers[question.id] === option}
                      disabled
                      className={`mb-2 ${
                        // Highlight correct answer in green
                        showResults && option === question.correctAnswer
                          ? 'text-success'
                          // Highlight incorrect selected answer in red
                          : showResults && answers[question.id] === option && answers[question.id] !== question.correctAnswer
                          ? 'text-danger'
                          : ''
                      }`}
                    />
                  ))}
                </Form>
              </Card.Body>
            </Card>
          ))}

          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/student/assessments')}
            >
              Back to Assessments
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AssessmentView; 