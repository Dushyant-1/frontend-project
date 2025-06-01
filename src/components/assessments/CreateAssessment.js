import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const CreateAssessment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    totalMarks: 100,
    type: 'Quiz',
    questions: [
      {
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        marks: 1
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    // No longer need to update formData with courseId here
    // The courseId is now accessed directly in handleSubmit
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionField, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        [optionField]: value
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        correctAnswer: value
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: '',
          marks: 1
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get courseId directly from useParams for reliability
      const assessmentPayload = {
        title: formData.title,
        description: formData.description,
        courseId: parseInt(courseId), // Ensure courseId is an integer
        dueDate: new Date(formData.dueDate).toISOString(),
        totalMarks: parseFloat(formData.totalMarks), // Ensure it's a number
        type: formData.type, // Include Type
        questions: formData.questions.map(q => ({
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          marks: parseFloat(q.marks) || 0
        }))
      };
      console.log('Assessment data being sent:', assessmentPayload);
      
      await api.post('/Assessment', assessmentPayload);
      toast.success('Assessment created successfully!');
      // Navigate back to the assessments list for this course
      navigate(`/instructor/courses/${courseId}/assessments`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assessment');
      toast.error(err.response?.data?.message || 'Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Create New Assessment</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Removed Course dropdown - courseId is from URL */}
                {/* 
                <Form.Group className="mb-3">
                  <Form.Label>Course</Form.Label>
                  <Form.Select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                */}
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Quiz">Quiz</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Questions</h5>
                <Button variant="outline-primary" onClick={addQuestion}>
                  Add Question
                </Button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <Card key={qIndex} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <h6>Question {qIndex + 1}</h6>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                        disabled={formData.questions.length === 1}
                      >
                        Remove
                      </Button>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>Question Text</Form.Label>
                      <Form.Control
                        type="text"
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Options</Form.Label>
                      {['optionA', 'optionB', 'optionC', 'optionD'].map((optionField, oIndex) => (
                        <div key={oIndex} className="mb-2">
                          <Form.Check
                            type="radio"
                            name={`correctAnswer-${qIndex}`}
                            id={`option-${qIndex}-${oIndex}`}
                            label={
                              <Form.Control
                                type="text"
                                name={optionField}
                                value={question[optionField]}
                                onChange={(e) => handleOptionChange(qIndex, optionField, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                required
                              />
                            }
                            checked={question.correctAnswer === String.fromCharCode(65 + oIndex)}
                            onChange={() => handleCorrectAnswerChange(qIndex, String.fromCharCode(65 + oIndex))}
                          />
                        </div>
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Marks for this Question</Form.Label>
                      <Form.Control
                        type="number"
                        name="marks"
                        value={question.marks}
                        onChange={(e) => handleQuestionChange(qIndex, 'marks', e.target.value)}
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Assessment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAssessment; 