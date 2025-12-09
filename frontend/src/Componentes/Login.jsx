import { useState } from 'react';
import "../stylesheets/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Componentes/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      if (response.data.authStatus === "LOGIN_SUCCESS") {
        setSuccessMessage("Inicio de sesión exitoso");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("rol", response.data.rol);

        login({
          username,
          name: username,
          rol: response.data.rol,
        });

        setTimeout(() => {
          navigate(response.data.rol === "ADMIN" ? "/admin" : "/");
        }, 2000);
      }
    } catch (err) {
      setSuccessMessage("");
      setError(err.response?.data?.message || "Error al iniciar sesión. Por favor, intente más tarde.");
      console.error("Error detallado:", err);
    }
  }

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-5" style={{ width: "100%", maxWidth: "400px" }}>
        <form onSubmit={handleLogin}>
          <h2 className="form-title">Iniciar Sesión</h2>

          {error && !successMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {successMessage && !error && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          <div className="mb-3">

            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu Usuario"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>

          <div className="mb-1 form-check d-flex justify-content-center align-items-center gap-2">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Recordar Contraseña
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>

          <p className="text-center mt-3 mb-0">
            ¿No tienes una cuenta?{" "}
            <Link to="/registro" className="text-decoration-none fw-semibold">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;