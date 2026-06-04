function HistoryCard({ history }) {
  return (
    <div className="card">
      <h2>Prediction History</h2>

      {history.length === 0 ? (
        <p>No Predictions Yet</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="history-item">
            <p>{item.label}</p>
            <p>{item.confidence}%</p>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryCard;