import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavigationBar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Instructor Components
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import ManageCourses from './components/courses/ManageCourses';
import CreateCourse from './components/courses/CreateCourse';
import EditCourse from './components/courses/EditCourse';
import ManageAssessments from './components/assessments/ManageAssessments';
import CreateAssessment from './components/assessments/CreateAssessment';
import EditAssessment from './components/assessments/EditAssessment';
import Analytics from './components/analytics/Analytics';
import ViewAssessmentResults from './components/assessments/ViewAssessmentResults';

// Student Components
import StudentDashboard from './components/dashboard/StudentDashboard';
import MyCourses from './components/courses/MyCourses';
import CourseView from './components/courses/CourseView';
import StudentAssessments from './components/assessments/StudentAssessments';
import AssessmentView from './components/assessments/AssessmentView';
import StudentResults from './components/results/StudentResults';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavigationBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="courses" element={<MyCourses />} />
                    <Route path="courses/:id" element={<CourseView />} />
                    <Route path="assessments" element={<StudentAssessments />} />
                    <Route path="assessments/:id" element={<AssessmentView />} />
                    <Route path="results" element={<StudentResults />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/instructor/*"
              element={
                <ProtectedRoute allowedRoles={['Instructor']}>
                  <Routes>
                    <Route path="dashboard" element={<InstructorDashboard />} />
                    <Route path="courses" element={<ManageCourses />} />
                    <Route path="courses/create" element={<CreateCourse />} />
                    <Route path="courses/edit/:id" element={<EditCourse />} />
                    <Route path="courses/:courseId/assessments" element={<ManageAssessments />} />
                    <Route path="courses/:courseId/assessments/create" element={<CreateAssessment />} />
                    <Route path="courses/:courseId/assessments/edit/:assessmentId" element={<EditAssessment />} />
                    <Route path="courses/:courseId/assessments/:assessmentId/results" element={<ViewAssessmentResults />} />
                    <Route path="analytics" element={<Analytics />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
