import api from './api';

const courseService = {
  // Get all courses
  async getAllCourses() {
    const response = await api.get('/course');
    return response.data;
  },

  // Get a single course
  async getCourse(id) {
    const response = await api.get(`/course/${id}`);
    return response.data;
  },

  // Create a new course
  async createCourse(courseData) {
    const response = await api.post('/course', courseData);
    return response.data;
  },

  // Update a course
  async updateCourse(id, courseData) {
    const response = await api.put(`/course/${id}`, courseData);
    return response.data;
  },

  // Delete a course
  async deleteCourse(id) {
    const response = await api.delete(`/course/${id}`);
    return response.data;
  },

  // Upload course media
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/course/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default courseService; 