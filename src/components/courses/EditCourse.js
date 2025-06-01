import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash, FaImage } from 'react-icons/fa';
import api from '../../services/api';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '',
    duration: '',
    thumbnail: null,
    materials: []
  });
  const [existingMaterials, setExistingMaterials] = useState([]);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/Course/${id}`);
        setCourseData(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          level: response.data.level,
          duration: response.data.duration,
          thumbnail: null,
          materials: []
        });
        setExistingMaterials(response.data.materials || []);
      } catch (err) {
        setError('Failed to load course data');
        toast.error('Failed to load course data');
        console.error('Failed to load course data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Thumbnail size should be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        thumbnail: file
      });
    } else {
       setFormData({
         ...formData,
         thumbnail: null
       });
    }
  };

  const handleMaterialUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
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

  const removeExistingMaterial = async (materialId) => {
    setExistingMaterials(existingMaterials.filter(material => material.id !== materialId));
  };

  const removeNewMaterial = (index) => {
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
      const updateData = new FormData();
      
      // Always append all required fields
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      updateData.append('level', formData.level);
      updateData.append('duration', formData.duration);
      
      // Only append thumbnail if a new one was selected
      if (formData.thumbnail) {
        updateData.append('thumbnail', formData.thumbnail);
      }

      // Send course details update (using PUT)
      await api.put(`/Course/${id}`, updateData);

      // Upload new materials one by one
      if (formData.materials.length > 0) {
        const uploadPromises = formData.materials.map(async (material) => {
          const materialData = new FormData();
          materialData.append('file', material);
          
          try {
            await api.post(`/Material/course/${id}`, materialData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            toast.success(`Material '${material.name}' uploaded successfully!`);
          } catch (materialErr) {
            toast.error(`Failed to upload material '${material.name}': ${materialErr.response?.data?.message || 'Error'}`);
            console.error(`Material upload failed for ${material.name}:`, materialErr);
          }
        });

        await Promise.all(uploadPromises);
      }

      toast.success('Course updated successfully!');
      navigate('/instructor/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course');
      toast.error('Failed to update course');
      console.error('Course update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="m-auto d-block" />;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Edit Course</h2>
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
                    Recommended size: 1280x720px. Max size: 5MB. Upload a new image to replace the existing thumbnail.
                  </small>
                  {formData.thumbnail ? (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(formData.thumbnail)}
                        alt="New Thumbnail preview"
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                      />
                    </div>
                  ) : (
                    courseData?.thumbnailUrl ? (
                      <div className="mt-2">
                        <img
                          src={courseData.thumbnailUrl}
                          alt="Existing Thumbnail"
                          className="img-thumbnail"
                          style={{ maxHeight: '150px' }}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 text-center p-3 bg-light rounded">
                        <FaImage size={40} className="text-muted mb-2" />
                        <p className="mb-0 text-muted">No thumbnail selected</p>
                      </div>
                    )
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Course Materials</Card.Title>
            
            {existingMaterials.length > 0 && (
              <div className="mb-3">
                <h6>Existing Materials:</h6>
                <ul className="list-group">
                  {existingMaterials.map(material => (
                    <li key={material.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{material.title || material.name || `Material ${material.id}`}</span>
                       {material.url && (
                         <Button
                           variant="outline-secondary"
                           size="sm"
                           as="a"
                           href={material.url}
                           target="_blank"
                           className="me-2"
                         >
                          View
                         </Button>
                       )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeExistingMaterial(material.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Upload New Materials</Form.Label>
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
                <h6>New Materials to Upload:</h6>
                <ul className="list-group">
                  {formData.materials.map((material, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{material.name}</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeNewMaterial(index)}
                      >
                        <FaTrash /> Remove
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
          disabled={saving}
          className="me-2"
        >
          {saving ? 'Saving...' : 'Save Changes'}
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

export default EditCourse; 