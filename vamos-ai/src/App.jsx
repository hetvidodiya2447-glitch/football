import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CompanionHome from './pages/CompanionHome';
import CommandDashboard from './pages/CommandDashboard';
import StaffLogin from './pages/StaffLogin';

function App() {
  const [staff, setStaff] = useState(null);

  const handleLogin = (user) => {
    setStaff(user);
  };

  const handleLogout = () => {
    setStaff(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/companion" />} />
        <Route path="/companion" element={<CompanionHome />} />
        <Route path="/login" element={<StaffLogin onLogin={handleLogin} />} />
        <Route
          path="/command"
          element={
            staff
              ? <CommandDashboard staff={staff} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
