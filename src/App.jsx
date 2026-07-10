import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import FanPortal from "./components/FanPortal";
import OpsPortal from "./components/OpsPortal";

export default function App() {
  const [view, setView] = useState("fan"); // "fan" or "ops"
  const [stadium, setStadium] = useState("metlife"); // used by OpsPortal
  const [language, setLanguage] = useState("english");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <Sidebar currentView={view} setView={setView} currentStadium={stadium} />

      <div className="main-content">
        <Header
          currentView={view}
          currentStadium={stadium}
          setStadium={setStadium}
          language={language}
          setLanguage={setLanguage}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(d => !d)}
        />

        <main className="scroll-area">
          {view === "fan" ? (
            <FanPortal language={language} />
          ) : (
            <OpsPortal stadiumKey={stadium} darkMode={darkMode} />
          )}
        </main>
      </div>
    </div>
  );
}
