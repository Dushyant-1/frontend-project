import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    courseStats: [],
    assessmentStats: [],
    studentPerformance: [],
    recentResults: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [courseRes, assessmentRes, performanceRes] = await Promise.all([
          api.get('/api/analytics/courses'),
          api.get('/api/analytics/assessments'),
          api.get('/api/analytics/performance')
        ]);

        setAnalytics({
          courseStats: courseRes.data,
          assessmentStats: assessmentRes.data,
          studentPerformance: performanceRes.data
        });
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const courseData = {
    labels: analytics.courseStats.map(stat => stat.courseName),
    datasets: [
      {
        label: 'Enrolled Students',
        data: analytics.courseStats.map(stat => stat.enrolledCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const assessmentData = {
    labels: analytics.assessmentStats.map(stat => stat.assessmentName),
    datasets: [
      {
        label: 'Average Score',
        data: analytics.assessmentStats.map(stat => stat.averageScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const performanceData = {
    labels: ['Passed', 'Failed', 'Not Attempted'],
    datasets: [
      {
        data: [
          analytics.studentPerformance.passed,
          analytics.studentPerformance.failed,
          analytics.studentPerformance.notAttempted
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Analytics Dashboard</h2>
      
      <Row className="g-4">
        {/* Course Enrollment Chart */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Course Enrollment</Card.Title>
              <Bar
                data={courseData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Student Enrollment by Course'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Assessment Performance Chart */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Assessment Performance</Card.Title>
              <Line
                data={assessmentData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Average Scores by Assessment'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Overall Performance */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Overall Performance</Card.Title>
              <Doughnut
                data={performanceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Student Performance Distribution'
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Results */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Recent Results</Card.Title>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Assessment</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentResults.map((result, index) => (
                      <tr key={index}>
                        <td>{result.studentName}</td>
                        <td>{result.assessmentName}</td>
                        <td>{result.score}%</td>
                        <td>
                          <span className={`badge bg-${result.passed ? 'success' : 'danger'}`}>
                            {result.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics; 