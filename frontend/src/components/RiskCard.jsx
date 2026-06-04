function RiskCard({

  risk

}) {

  const getClass = () => {

    if (risk === "High")
      return "high-risk";

    if (risk === "Medium")
      return "medium-risk";

    return "low-risk";
  };

  return (

    <div className="card">

      <h2 className="card-title">

        Risk Assessment

      </h2>

      <h3 className={getClass()}>

        {risk}

      </h3>

    </div>
  );
}

export default RiskCard;