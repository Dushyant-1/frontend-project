import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Card, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ViewAssessmentResults = () => {
  const { courseId, assessmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [assessmentTitle, setAssessmentTitle] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch assessment results using the backend endpoint
        const response = await api.get(`/Result/assessment/${assessmentId}`);
        setResults(response.data);
        // Optionally fetch assessment details to display the title
        const assessmentResponse = await api.get(`/Assessment/${assessmentId}`);
        setAssessmentTitle(assessmentResponse.data.title);

      } catch (err) {
        setError('Failed to load assessment results');
        console.error('Failed to load assessment results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResults();
    }
  }, [assessmentId]);

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Results for Assessment: {assessmentTitle}</h2>

      {results.length === 0 ? (
        <Alert variant="info">No results found for this assessment yet.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Marks Obtained</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id}>
                    <td>{result.studentName}</td> {/* Assuming result includes studentName */}
                    <td>{result.marksObtained}</td>
                    <td>
                      <span className={`badge bg-${result.status === 'Passed' ? 'success' : 'danger'}`}>
                        {result.status}
                      </span>
                    </td>
                    <td>{new Date(result.submissionDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ViewAssessmentResults; 