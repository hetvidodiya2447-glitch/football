import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompanionHome from './pages/CompanionHome';
import CommandDashboard from './pages/CommandDashboard';
import OptimusPage from './pages/OptimusPage';
import AppShell from './components/AppShell';

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
        {/* Landing Page (Stand-alone minimalist portal) */}
        <Route path="/" element={<LandingPage />} />

        {/* Companion Workspace */}
        <Route
          path="/companion"
          element={
            <AppShell staff={staff} onLogout={handleLogout}>
              <CompanionHome />
            </AppShell>
          }
        />

        {/* Command Center Workspace (with inline authorization) */}
        <Route
          path="/command"
          element={
            <AppShell staff={staff} onLogout={handleLogout}>
              <CommandDashboard staff={staff} onLogin={handleLogin} onLogout={handleLogout} />
            </AppShell>
          }
        />

        {/* Optimus Telemetry Workspace */}
        <Route
          path="/optimus"
          element={
            <AppShell staff={staff} onLogout={handleLogout}>
              <OptimusPage />
            </AppShell>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
