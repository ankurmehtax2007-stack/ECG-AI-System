import { useEffect } from "react";
import { useState } from "react";

import API from "../services/api";

import PatientForm from "../components/PatientForm";
import PatientTable from "../components/PatientTable";

function Patients() {

  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchPatients();

  }, []);

  const fetchPatients = async () => {

    try {

      setLoading(true);

      const response =
        await API.get(
          "/patients"
        );

      setPatients(
        response.data
      );

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  const createPatient = async (
    patientData
  ) => {

    try {

      await API.post(
        "/patients",
        patientData
      );

      fetchPatients();

      alert(
        "Patient Created Successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error Creating Patient"
      );
    }
  };

  const deletePatient = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete patient "${name}" (ID: ${id}) and all of their associated ECG prediction history?`)) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/patients/${id}`);
      alert("Patient and their history deleted successfully.");
      fetchPatients();
    } catch (error) {
      console.log(error);
      alert("Error deleting patient.");
      setLoading(false);
    }
  };

  return (

    <div className="container">

      <PatientForm
        onPatientCreated={
          createPatient
        }
      />

      {loading ? (

        <div className="card">

          <h3>
            Loading...
          </h3>

        </div>

      ) : (

        <PatientTable
          patients={patients}
          onDelete={deletePatient}
        />

      )}

    </div>
  );
}

export default Patients;