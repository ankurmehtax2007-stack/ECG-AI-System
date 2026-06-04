import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await API.post(
          "/login",
          {
            username,
            password
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/");

    } catch {

      setError(
        "Invalid Credentials"
      );
    }
  };

  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h1>

          ECG AI System

        </h1>

        {error && (

          <p>

            {error}

          </p>

        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
        />

        <button type="submit">

          Login

        </button>

      </form>

    </div>
  );
}

export default Login;