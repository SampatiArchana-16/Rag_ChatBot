import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";




function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const loginUser = async () => {

    try {

      const response = await API.post(
        "/login",
        {
          username,
          password
        }
      );


      console.log("Login Response:", response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );
      localStorage.setItem(
        "username",
        username
      );

      console.log(
        "Saved Token:",
        localStorage.getItem("token")
      );



      alert(
        "Login Successful"
      );

      navigate("/chat");


    } catch (error) {

      console.log(error);

      alert(
        "Invalid Credentials"
      );
    }
  };

  return (

    <div className="auth-container">

      <h1>Login</h1>

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
        onClick={loginUser}
      >
        Login
      </button>

    </div>
  );
}

export default Login;