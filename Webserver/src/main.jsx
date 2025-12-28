import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { BoatProvider } from "./context/BoatContext.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BoatProvider>
      <App />
    </BoatProvider>
  </StrictMode>,
)
