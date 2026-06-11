import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";



function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const registerUser = async () => {

    try {

      await API.post(
        "/register",
        {
          username,
          password,
        }
      );

      alert(
        "Registration Successful"
      );

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Registration Failed"
      );
    }
  };

  return (

    <div className="auth-container">

      <h1>Register</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

     

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={registerUser}
      >
        Register
      </button>

    </div>
  );
}

export default Register;