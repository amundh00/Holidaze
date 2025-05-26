
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  // Sjekke om bruker allrede er logget inn med og henter brukerdata fra localStorage
  const user = localStorage.getItem("user");

  // Hvis bruker ikke er logget in omdiriger bruker til login siden
  if (!user) {
    return <Navigate to="/login" />; // Omdirigering til login side
  }

  // Hvis bruker er logget inn, rendrer vi det beskyttede elementetene
  return element;
};

export default PrivateRoute;
