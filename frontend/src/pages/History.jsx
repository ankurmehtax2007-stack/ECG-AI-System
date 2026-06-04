import { useState } from "react";

import API from "../services/api";

import PatientSelector
from "../components/PatientSelector";

import HistoryTable
from "../components/HistoryTable";

import TrendChart
from "../components/TrendChart";

function History() {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (patientId) => {
    setSelectedPatientId(patientId);
    if (!patientId) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);

      const response = await API.get(`/history/${patientId}`);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ECG prediction record?")) {
      return;
    }
    try {
      setLoading(true);
      await API.delete(`/predictions/${id}`);
      alert("Prediction record deleted successfully.");
      fetchHistory(selectedPatientId);
    } catch (error) {
      console.log(error);
      alert("Error deleting prediction record.");
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all ECG prediction history for this patient? This action cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      await API.delete(`/patients/${selectedPatientId}/history`);
      alert("Patient history cleared successfully.");
      fetchHistory(selectedPatientId);
    } catch (error) {
      console.log(error);
      alert("Error clearing history.");
      setLoading(false);
    }
  };

  return (

    <div className="container">

      <PatientSelector
        onSelect={fetchHistory}
      />

      {loading && (

        <div className="card">

          <h2>
            Loading...
          </h2>

        </div>

      )}

      {history.length > 0 && (

        <>
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <h3 style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: 700, margin: 0 }}>⚠️ Clear Patient History</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>Permanently remove all recorded ECG diagnosis history for this patient.</p>
            </div>
            <button className="btn btn-danger" style={{ margin: 0 }} onClick={clearHistory}>
              Clear History
            </button>
          </div>

          <TrendChart
            history={history}
          />

          <HistoryTable
            history={history}
            onDeleteRecord={deleteRecord}
          />
        </>

      )}

    </div>
  );
}

export default History;