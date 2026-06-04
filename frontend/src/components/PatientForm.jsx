import { useState } from "react";

function PatientForm({ onPatientCreated }) {

  const [formData, setFormData] =
    useState({
      name: "",
      age: "",
      gender: ""
    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await onPatientCreated(
      formData
    );

    setFormData({
      name: "",
      age: "",
      gender: ""
    });
  };

  return (

    <div className="card">

      <h2 className="card-title">

        Register Patient

      </h2>

      <form onSubmit={handleSubmit}>

        <label>
          Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>
          Age
        </label>

        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <label>
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >

          <option value="">
            Select Gender
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>

          <option value="Other">
            Other
          </option>

        </select>

        <button
          className="btn"
          type="submit"
        >
          Create Patient
        </button>

      </form>

    </div>
  );
}

export default PatientForm;