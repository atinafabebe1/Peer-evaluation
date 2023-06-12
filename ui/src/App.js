import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext } from './context/userContext';
import Registration from './components/auth/register';
import Login from './components/auth/login';
import PresentationUpload from './components/presentation/PresentationUpload';
import Evaluation from './pages/evaluation';
import PeerEvaluation from './components/evaluation/PeerEvaluation';
import ProfessorEvaluation from './components/evaluation/ProfessorEvaluation';
import CustomNavbar from './components/shared/Navbar';
import Homepage from './pages/homepage';
import EvaluationForm from './components/evaluation/EvaluationForm';
import PresentationPage from './components/report/Report.js';
import PresentationReport from './components/report/PresentaionReport';

function App() {
  const { isAuthenticated } = useContext(UserContext);

  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/upload" element={isAuthenticated ? <PresentationUpload /> : <Navigate to="/" replace />} />
          <Route path="/evaluation" element={isAuthenticated ? <Evaluation /> : <Navigate to="/" replace />} />
          <Route path="/report" element={isAuthenticated ? <PresentationPage /> : <Navigate to="/" replace />} />
          <Route path="/presentationreport/:presentationId" element={isAuthenticated ? <PresentationReport /> : <Navigate to="/" replace />} />
          <Route path="/evaluate/:id" element={isAuthenticated ? <EvaluationForm /> : <Navigate to="/" replace />} />
          <Route path="/peer-evaluation" element={isAuthenticated ? <PeerEvaluation /> : <Navigate to="/" replace />} />
          <Route path="/professor-evaluation" element={isAuthenticated ? <ProfessorEvaluation /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
