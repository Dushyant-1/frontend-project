import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaImage } from 'react-icons/fa';
import api from '../../services/api';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    duration: '',
    thumbnail: null,
    materials: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Thumbnail size should be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        thumbnail: file
      });
    }
  };

  const handleMaterialUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }
      return true;
    });

    setFormData({
      ...formData,
      materials: [...formData.materials, ...validFiles]
    });
  };

  const removeMaterial = (index) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData object for course details
      const courseData = new FormData();
      courseData.append('title', formData.title);
      courseData.append('description', formData.description);
      courseData.append('level', formData.level);
      courseData.append('duration', formData.duration);
      
      if (formData.thumbnail) {
        courseData.append('thumbnail', formData.thumbnail);
      }

      // Post course details to get the course ID
      const courseResponse = await api.post('/Course', courseData);

      const courseId = courseResponse.data.id; // Assuming the response contains the course object with an 'id'

      // Upload materials one by one
      if (formData.materials.length > 0) {
        const uploadPromises = formData.materials.map(async (material) => {
          const materialData = new FormData();
          materialData.append('file', material); // Assuming backend expects the file under 'file' key
          
          try {
            await api.post(`/Material/course/${courseId}`, materialData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            toast.success(`Material '${material.name}' uploaded successfully!`);
          } catch (materialErr) {
            toast.error(`Failed to upload material '${material.name}': ${materialErr.response?.data?.message || 'Error'}`);
            // Decide whether to stop on first material upload error or continue
            // For now, we'll log the error and continue with other materials
            console.error(`Material upload failed for ${material.name}:`, materialErr);
          }
        });

        await Promise.all(uploadPromises); // Wait for all material uploads to complete
      }

      toast.success('Course created and materials uploaded successfully!');
      navigate('/instructor/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
      toast.error('Failed to create course');
      console.error('Course creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Create New Course</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter course title"
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
                rows={4}
                placeholder="Enter course description"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (in hours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter course duration"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>

          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Course Thumbnail (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="mb-2"
                  />
                  <small className="text-muted">
                    Recommended size: 1280x720px. Max size: 5MB. A default thumbnail will be used if none is provided.
                  </small>
                  {formData.thumbnail ? (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="Thumbnail preview"
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                      />
                    </div>
                  ) : (
                    <div className="mt-2 text-center p-3 bg-light rounded">
                      <FaImage size={40} className="text-muted mb-2" />
                      <p className="mb-0 text-muted">No thumbnail selected</p>
                    </div>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Course Materials</Card.Title>
            <Form.Group className="mb-3">
              <Form.Label>Upload Materials</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleMaterialUpload}
                className="mb-2"
              />
              <small className="text-muted">
                Supported formats: PDF, DOC, DOCX, PPT, PPTX, MP4, MP3. Max size per file: 50MB
              </small>
            </Form.Group>

            {formData.materials.length > 0 && (
              <div className="mt-3">
                <h6>Uploaded Materials:</h6>
                <ul className="list-group">
                  {formData.materials.map((material, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{material.name}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                      >
                        <FaTrash />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="me-2"
        >
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/instructor/courses')}
        >
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCourse; 