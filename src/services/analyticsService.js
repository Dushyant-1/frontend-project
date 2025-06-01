import api from './api';

const analyticsService = {
  // Get course statistics
  async getCourseStats() {
    const response = await api.get('/analytics/courses');
    return response.data;
  },

  // Get assessment statistics
  async getAssessmentStats() {
    const response = await api.get('/analytics/assessments');
    return response.data;
  },

  // Get overall performance statistics
  async getPerformanceStats() {
    const response = await api.get('/analytics/performance');
    return response.data;
  },

  // Get recent results
  async getRecentResults() {
    const response = await api.get('/analytics/recent-results');
    return response.data;
  },

  // Get student progress
  async getStudentProgress(studentId) {
    const response = await api.get(`/analytics/student/${studentId}/progress`);
    return response.data;
  },

  // Get course analytics
  async getCourseAnalytics(courseId) {
    const response = await api.get(`/analytics/course/${courseId}`);
    return response.data;
  }
};

export default analyticsService; 