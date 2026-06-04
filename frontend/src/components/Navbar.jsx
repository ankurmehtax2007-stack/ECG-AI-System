import { NavLink } from "react-router-dom";

import {
  FaHeartbeat,
  FaUser,
  FaHistory
} from "react-icons/fa";

function Navbar() {

  return (

    <nav className="navbar">

      <div className="navbar-logo">
        <div className="navbar-logo-circle">
          <FaHeartbeat />
        </div>
        <span className="navbar-logo-text">
          ECG AI System
        </span>
      </div>

      <div className="navbar-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        <NavLink to="/patients">
          <FaUser style={{ marginRight: "6px" }} />
          Patients
        </NavLink>

        <NavLink to="/history">
          <FaHistory style={{ marginRight: "6px" }} />
          History
        </NavLink>
      </div>

      <div className="navbar-actions">
        <NavLink to="/doctor" className={({ isActive }) => isActive ? "navbar-btn-pill active" : "navbar-btn-pill"}>
          Doctor Dashboard
        </NavLink>
      </div>

    </nav>

  );
}

export default Navbar;