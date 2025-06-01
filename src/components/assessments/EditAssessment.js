import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const EditAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await api.get(`/Assessment/${assessmentId}`);
        console.log('Fetched assessment data:', response.data);
        
        const fetchedAssessment = response.data;

        setFormData({
          title: fetchedAssessment.title,
          description: fetchedAssessment.description,
          dueDate: fetchedAssessment.dueDate ? fetchedAssessment.dueDate.substring(0, 16) : '',
          totalMarks: fetchedAssessment.totalMarks || 100,
          type: fetchedAssessment.type || 'Quiz',
          questions: fetchedAssessment.questions.map(q => ({
            questionText: q.questionText || '',
            optionA: q.optionA || '',
            optionB: q.optionB || '',
            optionC: q.optionC || '',
            optionD: q.optionD || '',
            correctAnswer: '',
            marks: q.marks || 1
          })) || []
        });
      } catch (err) {
        setError('Failed to load assessment data');
        toast.error('Failed to load assessment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === 'questionText' || field === 'marks') {
       newQuestions[index] = {
         ...newQuestions[index],
         [field]: value
       };
    } 
    
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionField, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      [optionField]: value
    };
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex] = {
      ...newQuestions[questionIndex],
      correctAnswer: value
    };
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
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
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: newQuestions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Frontend validation: Check if all questions have a correct answer selected
    const allQuestionsHaveCorrectAnswer = formData.questions.every(q => q.correctAnswer !== '');
    if (!allQuestionsHaveCorrectAnswer) {
      setError('Please select a correct answer for all questions.');
      toast.error('Please select a correct answer for all questions.');
      setSaving(false);
      return;
    }

    try {
      const updatedAssessmentPayload = {
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString(),
        totalMarks: parseFloat(formData.totalMarks),
        type: formData.type,
        questions: formData.questions.map(q => {
           // Ensure question objects match CreateQuestionDto structure for sending
           const questionPayload = {
             questionText: q.questionText,
             optionA: q.optionA,
             optionB: q.optionB,
             optionC: q.optionC,
             optionD: q.optionD,
             correctAnswer: q.correctAnswer, // Should be 'A', 'B', 'C', or 'D'
             marks: parseFloat(q.marks) || 0
           };
           console.log('Question payload sent:', questionPayload); // Log each question payload
           return questionPayload;
        })
      };

      console.log('Update assessment payload sent:', updatedAssessmentPayload);

      await api.put(`/Assessment/${assessmentId}`, updatedAssessmentPayload);
      toast.success('Assessment updated successfully!');
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update assessment');
      toast.error('Failed to update assessment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Edit Assessment</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter assessment title"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Enter assessment description"
          />
        </Form.Group>

        <Row>
          <Col md={6}>
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
          <Col md={6}>
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
        </Row>

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

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Questions</h4>
            <Button variant="outline-primary" onClick={addQuestion}>
              Add Question
            </Button>
          </div>

          {formData.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5>Question {questionIndex + 1}</h5>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
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
                    onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                    required
                    placeholder="Enter question"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Options</Form.Label>
                  {['optionA', 'optionB', 'optionC', 'optionD'].map((optionField, optionIndex) => (
                    <div key={optionIndex} className="mb-2">
                      <Form.Check
                        type="radio"
                        name={`correctAnswer-${questionIndex}`}
                        id={`option-${questionIndex}-${optionIndex}`}
                        label={
                          <Form.Control
                            type="text"
                            name={optionField}
                            value={question[optionField]}
                            onChange={(e) => handleOptionChange(questionIndex, optionField, e.target.value)}
                            required
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                          />
                        }
                        checked={question.correctAnswer === String.fromCharCode(65 + optionIndex)}
                        onChange={() => handleCorrectAnswerChange(questionIndex, String.fromCharCode(65 + optionIndex))}
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
                      onChange={(e) => handleQuestionChange(questionIndex, 'marks', e.target.value)}
                      min="0"
                      required
                    />
                 </Form.Group>

              </Card.Body>
            </Card>
          ))}
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={saving}
          className="me-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default EditAssessment; 