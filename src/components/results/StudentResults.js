import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Card, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch results for the logged-in student
        const response = await api.get('/Result/student');
        setResults(response.data);
      } catch (err) {
        setError('Failed to load results');
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Group results by assessmentId
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.assessmentId]) acc[result.assessmentId] = [];
    acc[result.assessmentId].push(result);
    return acc;
  }, {});

  // Sort each group by submission date ascending (oldest first)
  Object.values(groupedResults).forEach(group =>
    group.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate))
  );

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Assessment Results</h2>

      {results.length === 0 ? (
        <Alert variant="info">You haven't completed any assessments yet.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Assessment Title</th>
                  <th>Course</th>
                  <th>Attempt</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedResults).map((group, groupIdx) =>
                  group.map((result, idx) => (
                    <tr key={result.id}>
                      <td>{result.assessmentTitle}</td>
                      <td>{result.courseTitle}</td>
                      <td>{idx + 1}</td>
                      <td>{result.marksObtained}</td>
                      <td>{result.totalMarks}</td>
                      <td>
                        <span className={`badge bg-${result.status === 'Passed' ? 'success' : 'danger'}`}>
                          {result.status}
                        </span>
                      </td>
                      <td>{new Date(result.submissionDate).toLocaleString()}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/student/assessments/${result.assessmentId}`)}
                        >
                          Retake
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default StudentResults; 