import Papa from "papaparse";

function UploadCard({
  setSignal,
  predictECG
}) {
  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      complete: (result) => {

        const values =
          result.data
            .flat()
            .map(Number)
            .filter(v => !isNaN(v));

        if (values.length !== 187) {
          alert(
            "CSV must contain exactly 187 ECG values"
          );
          return;
        }

        setSignal(values);

        predictECG(values);
      }
    });
  };

  return (
    <div className="card">
      <h2>Upload ECG CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
      />
    </div>
  );
}

export default UploadCard;