import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import History from "./pages/History";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {

  return (

    <>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/patients"
          element={<Patients />}
        />

        <Route
          path="/history"
          element={<History />}
        />
        
        <Route
          path="/doctor"
          element={<DoctorDashboard />}
        />

      </Routes>

    </>

  );
}

export default App;