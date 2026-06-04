import { useEffect, useState } from "react";
import API from "../services/api";

function PatientSelector({ onSelect }) {

  const [patients, setPatients] =
    useState([]);

  const [selectedPatient,
    setSelectedPatient] =
    useState("");

  useEffect(() => {

    fetchPatients();

  }, []);

  const fetchPatients = async () => {

    try {

      const response =
        await API.get("/patients");

      setPatients(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const handleChange = (e) => {

    const id = e.target.value;

    setSelectedPatient(id);

    onSelect(id);
  };

  return (

    <div className="card">

      <h2 className="card-title">

        Select Patient

      </h2>

      <select
        value={selectedPatient}
        onChange={handleChange}
      >

        <option value="">
          Select Patient
        </option>

        {patients.map(patient => (

          <option
            key={patient.id}
            value={patient.id}
          >

            {patient.name}

          </option>

        ))}

      </select>

    </div>
  );
}

export default PatientSelector;