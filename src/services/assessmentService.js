import api from './api';

const assessmentService = {
  // Get all assessments
  async getAllAssessments() {
    const response = await api.get('/assessment');
    return response.data;
  },

  // Get a single assessment
  async getAssessment(id) {
    const response = await api.get(`/assessment/${id}`);
    return response.data;
  },

  // Create a new assessment
  async createAssessment(assessmentData) {
    const response = await api.post('/assessment', assessmentData);
    return response.data;
  },

  // Update an assessment
  async updateAssessment(id, assessmentData) {
    const response = await api.put(`/assessment/${id}`, assessmentData);
    return response.data;
  },

  // Delete an assessment
  async deleteAssessment(id) {
    const response = await api.delete(`/assessment/${id}`);
    return response.data;
  },

  // Get assessment results
  async getAssessmentResults(id) {
    const response = await api.get(`/assessment/${id}/results`);
    return response.data;
  },

  // Get student performance
  async getStudentPerformance(assessmentId, studentId) {
    const response = await api.get(`/assessment/${assessmentId}/student/${studentId}`);
    return response.data;
  }
};

export default assessmentService; 