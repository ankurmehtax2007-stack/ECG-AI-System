import { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { FaUpload, FaFileCsv, FaExclamationTriangle } from "react-icons/fa";
import API from "../services/api";

function ECGUpload({ onPredict }) {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [fileName, setFileName] = useState("");
  const [signalData, setSignalData] = useState(null);
  const [parseStatus, setParseStatus] = useState(""); // "success" | "error" | ""
  const [parseMessage, setParseMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFile = () => {
    setFileName("");
    setSignalData(null);
    setParseStatus("");
    setParseMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setParseStatus("");
    setParseMessage("");
    setSignalData(null);

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        try {
          // Filter out completely empty rows
          const rows = result.data.filter(
            (row) => row.length > 0 && row.some((cell) => cell.toString().trim() !== "")
          );

          if (rows.length === 0) {
            setParseStatus("error");
            setParseMessage("CSV file is empty — no data rows found.");
            return;
          }

          // Detect format: single-row (187+ columns) or single-column (187+ rows with 1 value each)
          const firstRow = rows[0];
          const firstRowNumeric = firstRow
            .map((v) => parseFloat(v))
            .filter((v) => !isNaN(v));

          let signal = null;
          let infoMsg = "";

          if (firstRowNumeric.length >= 187) {
            // --- HORIZONTAL FORMAT: values across columns in one row ---
            if (firstRowNumeric.length === 187) {
              signal = firstRowNumeric;
            } else if (firstRowNumeric.length === 188) {
              // MIT-BIH format: 187 signal + 1 label, strip last column
              signal = firstRowNumeric.slice(0, 187);
            } else {
              signal = firstRowNumeric.slice(0, 187);
              infoMsg = `Row had ${firstRowNumeric.length} values. Used the first 187 as the ECG signal.`;
            }
          } else {
            // --- VERTICAL / COLUMN FORMAT: one value per row ---
            // Collect the first numeric value from each row
            const columnValues = rows
              .map((row) => parseFloat(row[0]))
              .filter((v) => !isNaN(v));

            if (columnValues.length === 187) {
              signal = columnValues;
            } else if (columnValues.length === 188) {
              signal = columnValues.slice(0, 187);
            } else if (columnValues.length > 188) {
              signal = columnValues.slice(0, 187);
              infoMsg = `File had ${columnValues.length} rows. Used the first 187 values as the ECG signal.`;
            } else {
              setParseStatus("error");
              setParseMessage(
                `Expected 187 signal values but found ${columnValues.length}. ` +
                `Upload a CSV with 187 values in a single row or single column.`
              );
              return;
            }
          }

          setSignalData(signal);
          setParseStatus("success");
          if (!infoMsg) {
            infoMsg = "ECG signal successfully loaded — 187 data points parsed.";
          }
          setParseMessage(infoMsg);
        } catch (err) {
          console.error("CSV parse error:", err);
          setParseStatus("error");
          setParseMessage("Failed to parse CSV file. Please check the file format.");
        }
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        setParseStatus("error");
        setParseMessage("Failed to read CSV file: " + err.message);
      }
    });
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <FaUpload style={{ marginRight: "10px", color: "var(--accent-color)" }} />
        ECG Signal Upload
      </h2>

      <label>Select Patient</label>
      <select
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      >
        <option value="">Select Patient</option>
        {patients.map((patient) => (
          <option key={patient.id} value={patient.id}>
            {patient.name} (ID: {patient.id})
          </option>
        ))}
      </select>

      <label>Upload ECG Data (.csv)</label>
      <div 
        style={{
          border: `2px dashed ${parseStatus === "error" ? "var(--color-danger, #ef4444)" : "var(--border-color)"}`,
          borderRadius: "var(--radius-md)",
          padding: "30px 20px",
          textAlign: "center",
          backgroundColor: "var(--bg-input)",
          cursor: "pointer",
          transition: "var(--transition)",
          marginTop: "8px"
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-color)"}
        onMouseOut={(e) => e.currentTarget.style.borderColor = parseStatus === "error" ? "var(--color-danger, #ef4444)" : "var(--border-color)"}
        onClick={() => {
          if (!patientId) {
            alert("Please select a patient first!");
            return;
          }
          fileInputRef.current.click();
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        
        {fileName && parseStatus === "success" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <FaFileCsv style={{ fontSize: "40px", color: "var(--color-success)" }} />
            <span style={{ fontSize: "15px", fontWeight: "600" }}>{fileName}</span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {parseMessage}
            </span>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: "10px", padding: "6px 12px", fontSize: "13px" }}
              onClick={(e) => {
                e.stopPropagation();
                resetFile();
              }}
            >
              Choose Different File
            </button>
          </div>
        ) : fileName && parseStatus === "error" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <FaExclamationTriangle style={{ fontSize: "40px", color: "var(--color-danger, #ef4444)" }} />
            <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-danger, #ef4444)" }}>{fileName}</span>
            <span style={{ fontSize: "13px", color: "var(--color-danger, #ef4444)" }}>
              {parseMessage}
            </span>
            <button 
              className="btn btn-secondary" 
              style={{ marginTop: "10px", padding: "6px 12px", fontSize: "13px" }}
              onClick={(e) => {
                e.stopPropagation();
                resetFile();
              }}
            >
              Try a Different File
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <FaUpload style={{ fontSize: "36px", color: "var(--text-secondary)", marginBottom: "5px" }} />
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Click to select ECG signal CSV
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Supported: CSV with 187 or 188 values (MIT-BIH format accepted)
            </span>
          </div>
        )}
      </div>

      {fileName && signalData && parseStatus === "success" && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <button
            className="btn"
            style={{ width: "100%", padding: "14px" }}
            onClick={() => onPredict(patientId, signalData)}
          >
            📊 Run Diagnostic Analysis
          </button>
        </div>
      )}
    </div>
  );
}

export default ECGUpload;