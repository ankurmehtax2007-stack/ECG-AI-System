import {

  BrowserRouter,

  Routes,

  Route

} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import History from "./pages/History";
import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route

          path="/login"

          element={<Login />}

        />

        <Route

          path="/"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path="/patients"

          element={

            <ProtectedRoute>

              <Patients />

            </ProtectedRoute>

          }

        />

        <Route

          path="/history"

          element={

            <ProtectedRoute>

              <History />

            </ProtectedRoute>

          }

        />

        <Route

          path="/doctor"

          element={

            <ProtectedRoute>

              <DoctorDashboard />

            </ProtectedRoute>

          }

        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;