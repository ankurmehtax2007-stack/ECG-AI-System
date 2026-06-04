import { useState } from "react";

import API from "../services/api";

import ECGUpload from
"../components/ECGUpload";

import ECGChart from
"../components/ECGChart";

import PredictionCard from
"../components/PredictionCard";

import RiskCard from
"../components/RiskCard";
import ClinicalExplainability from "../components/ClinicalExplainability";

function Dashboard() {

  const [signal, setSignal] =
    useState([]);

  const [prediction,
    setPrediction] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const predictECG = async (

    patientId,

    signalData

  ) => {

    try {

      if (!patientId) {

        alert(
          "Select Patient First"
        );

        return;
      }

      setLoading(true);

      const response =
        await API.post(
          "/predict",
          {

            patient_id:
            Number(patientId),

            signal:
            signalData
          }
        );

      setSignal(
        signalData
      );

      setPrediction(
        response.data
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

      alert(
        "Prediction Failed"
      );
    }
  };

  return (

    <div className="container">

      <ECGUpload
        onPredict={
          predictECG
        }
      />

      {signal.length > 0 && (

        <ECGChart
          signal={signal}
        />

      )}

      {loading && (

        <div className="card">

          <h2 style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            Running 1D CNN Inference...
          </h2>

        </div>
      )}

      {prediction && (

        <>
          <div className="grid-2">
            <PredictionCard

              label={
                prediction.label
              }

              confidence={
                prediction.confidence
              }

            />

            <RiskCard

              risk={
                prediction.risk_level
              }

            />
          </div>

          <ClinicalExplainability 
            predictionId={prediction.id} 
            predictionLabel={prediction.label} 
          />

          <div className="card" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <button
              className="btn"
              onClick={() => window.open(`http://localhost:5000/reports/${prediction.id}`, "_blank")}
            >
              📄 Generate Clinical PDF / Print Report
            </button>
          </div>
        </>

      )}

    </div>
  );
}

export default Dashboard;