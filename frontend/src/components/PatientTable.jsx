function PatientTable({ patients, onDelete }) {

  return (

    <div className="card">

      <h2 className="card-title">

        Patient Records

      </h2>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Name</th>

            <th>Age</th>

            <th>Gender</th>

            <th>Latest Condition</th>

            <th>Risk Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {patients.map((patient) => (

            <tr key={patient.id}>

              <td>
                {patient.id}
              </td>

              <td>
                {patient.name}
              </td>

              <td>
                {patient.age}
              </td>

              <td>
                {patient.gender}
              </td>

              <td>
                {patient.latest_condition}
              </td>

              <td>
                <span
                  className={`badge ${
                    patient.latest_status === "High"
                      ? "high-risk"
                      : patient.latest_status === "Medium"
                      ? "medium-risk"
                      : patient.latest_status === "Low"
                      ? "low-risk"
                      : ""
                  }`}
                >
                  {patient.latest_status}
                </span>
              </td>

              <td>
                {onDelete && (
                  <button
                    className="btn btn-danger"
                    style={{ padding: "6px 12px", fontSize: "13px", margin: 0 }}
                    onClick={() => onDelete(patient.id, patient.name)}
                  >
                    Delete
                  </button>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default PatientTable;