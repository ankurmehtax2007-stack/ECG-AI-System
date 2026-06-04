import { useEffect, useState } from "react";
import API from "../services/api";

import StatsCards from "../components/StatsCards";
import PredictionPieChart from "../components/PredictionPieChart";
import RecentActivity from "../components/RecentActivity";

function DoctorDashboard() {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState({});
  const [activities, setActivities] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchDashboard(selectedPatientId);

    const intervalId = setInterval(() => {
      fetchDashboard(selectedPatientId);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedPatientId]);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.log("Error fetching patients:", error);
    }
  };

  const fetchDashboard = async (patientId) => {
    try {
      const query = patientId ? `?patient_id=${patientId}` : "";
      
      const statsRes = await API.get(`/dashboard/stats${query}`);
      const distRes = await API.get(`/dashboard/distribution${query}`);
      const recentRes = await API.get(`/dashboard/recent${query}`);

      setStats(statsRes.data);
      setDistribution(distRes.data);
      setActivities(recentRes.data);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  const handlePatientChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ECG prediction record?")) {
      return;
    }
    try {
      await API.delete(`/predictions/${id}`);
      alert("Prediction record deleted successfully.");
      fetchDashboard(selectedPatientId);
    } catch (error) {
      console.log("Error deleting prediction record:", error);
      alert("Error deleting prediction record.");
    }
  };

  if (!stats) {
    return (
      <div className="container">
        <h3>Loading statistics...</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="card-title">🩺 Doctor's Analytics Portal</h2>
        <label>Filter Statistics by Patient</label>
        <select value={selectedPatientId} onChange={handlePatientChange}>
          <option value="">All Patients (Aggregated Stats)</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (ID: {p.id})
            </option>
          ))}
        </select>
      </div>

      <StatsCards stats={stats} />

      <div className="grid-2" style={{ marginTop: "24px" }}>
        <PredictionPieChart distribution={distribution} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <RecentActivity activities={activities} onDeleteRecord={deleteRecord} />
      </div>
    </div>
  );
}

export default DoctorDashboard;