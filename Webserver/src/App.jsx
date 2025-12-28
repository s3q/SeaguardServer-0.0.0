import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./Screens/DashboardPage";
import BoatsListPage from "./Screens/BoatsListPage";
import BoatDetailsPage from "./Screens/BoatDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/boats" element={<BoatsListPage />} />
        <Route path="/boats/:id" element={<BoatDetailsPage />} />
        <Route path="/telemetry" element={<Navigate to="/" />} />
        <Route path="/controls" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
