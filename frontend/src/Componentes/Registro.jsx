import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import "../stylesheets/Registro.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

function Registro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function save(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/auth/registrar`, {
        username,
        email,
        password,
      });

      if (response.data.authStatus === 'USER_CREATED_SUCCESSFULLY') {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          window.location.href = '/login';
        }, 4000);
      } else {
        setError(response.data.message || "No se pudo completar el registro");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.authStatus === 'USER_NOT_CREATED') {
        setError("No se pudo crear el usuario. Por favor, intente nuevamente.");
      } else {
        setError("Error en el registro. Por favor, intente más tarde.");
      }
      console.error("Error detallado:", err);
    }
  }

  return (
    <div className="registro-container">
      <div className='card registro-card'>
        <form onSubmit={save}>
          <h2 className='form-title'>Crea una cuenta</h2>

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          <div className='mb-3'>
            <input
              type='text'
              className='form-control input-clean'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nombre de usuario"
            />
          </div>

          <div className='mb-3'>
            <input
              type='email'
              className='form-control input-clean'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Correo electrónico"
            />
          </div>

          <div className='mb-3'>
            <input
              type='password'
              className='form-control input-clean'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Contraseña"
            />
          </div>

          <div className='mb-3'>
            <input
              type='password'
              className='form-control input-clean'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirmar contraseña"
            />
          </div>

          <button type='submit' className='btn btn-primary w-100'>Registrar</button>

          <p className='text-center mt-3'>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className='btn btn-link p-0'>Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;