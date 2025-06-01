import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaFile, FaVideo, FaDownload, FaEye } from 'react-icons/fa';
import api from '../../services/api';

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await api.get(`/Course/${id}`);
        console.log('Course data:', courseResponse.data);
        setCourse(courseResponse.data);

        // Fetch course materials
        const materialsResponse = await api.get(`/Material/course/${id}`);
        console.log('Materials data:', materialsResponse.data);
        setMaterials(materialsResponse.data);
      } catch (err) {
        setError('Failed to load course content');
        console.error('Failed to load course content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handlePdfPreview = (url) => {
    // Use Google Docs Viewer to display PDF inline
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    setSelectedPdfUrl(googleDocsUrl);
    setShowPdfModal(true);
  };

  const isPdfFile = (fileName) => {
    return fileName.toLowerCase().endsWith('.pdf');
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!course) return <Alert variant="warning">Course not found or an error occurred.</Alert>;

  return (
    <Container className="py-4">
      <Row>
        {/* Course Content */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{course.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Instructor: {course.instructorName}
              </Card.Subtitle>
              <Card.Text>{course.description}</Card.Text>
              
              {materials.length > 0 && (
                <div className="mt-4">
                  <h5>Course Materials</h5>
                  {materials.map((material, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <FaFile className="me-2" />
                      <span className="me-2">{material.fileName.split('/').pop()}</span>
                      <div className="ms-auto">
                        {material.fileUrl && isPdfFile(material.fileName) && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2"
                            onClick={() => handlePdfPreview(material.fileUrl)}
                          >
                            <FaEye className="me-1" /> Preview
                          </Button>
                        )}
                        {material.fileUrl && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as="a"
                            href={material.fileUrl}
                            target="_blank"
                            download
                          >
                            <FaDownload className="me-1" /> Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Course Info Sidebar */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Course Information</Card.Title>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Created:</strong> {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PDF Preview Modal */}
      <Modal
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        size="lg"
        centered
        dialogClassName="pdf-preview-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh', padding: 0 }}>
          <iframe
            src={selectedPdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="PDF Preview"
            allowFullScreen
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseView; 