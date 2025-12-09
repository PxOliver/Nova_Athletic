import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Modal,
  Spinner,
} from "react-bootstrap";
import UsuarioService from "../services/UsuarioService";
import "../stylesheets/Perfil.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Perfil = () => {
  const [perfilData, setPerfilData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    pais: "",
  });

  const notifySuccess = (msg) =>
    toast.success(msg, { position: "top-right", autoClose: 3000 });

  const notifyError = (msg) =>
    toast.error(msg, { position: "top-right", autoClose: 3000 });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Cargar perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const datos = await UsuarioService.getPerfil();

        setPerfilData(datos);

        setFormData({
          nombre: datos.nombre || "",
          email: datos.email || "",
          telefono: datos.telefono || "",
          pais: datos.pais || "",
        });

        setLoading(false);
      } catch (err) {
        const msg = err.response?.data?.message || "Error al cargar el perfil";
        setError(msg);
        notifyError(msg);
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosActualizados = await UsuarioService.actualizarPerfil(formData);
      setPerfilData(datosActualizados);
      handleClose();
      notifySuccess("¡Perfil actualizado correctamente!");
    } catch (err) {
      notifyError(
        err.response?.data?.message || "Error al actualizar el perfil"
      );
    }
  };

  // Subir imagen
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("imagen", file);

    try {
      const datosActualizados =
        await UsuarioService.actualizarImagenPerfil(fileData);
      setPerfilData(datosActualizados);
      notifySuccess("Imagen actualizada correctamente");
    } catch (err) {
      notifyError(
        err.response?.data?.message || "Error al actualizar la imagen"
      );
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" />
        <p className="mt-2 ms-2">Cargando perfil...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <ToastContainer />
        <p className="text-center text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <section>
      <ToastContainer />

      {/* CONTENEDOR: CENTRADO EN X E Y */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        {/* CARD ÚNICA */}
        <Card
          className="shadow-sm p-4"
          style={{ maxWidth: "500px", width: "100%", borderRadius: "18px" }}
        >
          {/* TÍTULO */}
          <h2
            className="fw-bold text-center mb-4"
            style={{ fontSize: "1.9rem" }}
          >
            👤 Mi Perfil
          </h2>

          {/* AVATAR + USERNAME */}
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative d-inline-block mb-3">
              <Image
                src={
                  perfilData?.imagenUrl
                    ? `http://localhost:8080${perfilData.imagenUrl}`
                    : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                }
                roundedCircle
                width={130}
                height={130}
                className="object-fit-cover"
              />
              {/* Ícono cámara */}
              <div className="profile-camera-icon">
                <label htmlFor="file-upload" className="profile-camera-label">
                  <i className="fas fa-camera text-white"></i>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <p className="mb-0 fw-semibold">@{perfilData?.username}</p>
            <p className="text-muted mb-0">Usuario</p>
          </div>

          {/* DATOS DEL PERFIL – TODOS CENTRADOS IGUAL */}
          <div className="mb-3 text-center">
            <p className="mb-1 fw-semibold">Nombre</p>
            <p className="text-muted border rounded px-3 py-2 m-0">
              {perfilData?.nombre || "No especificado"}
            </p>
          </div>

          <div className="mb-3 text-center">
            <p className="mb-1 fw-semibold">Email</p>
            <p className="text-muted border rounded px-3 py-2 m-0">
              {perfilData?.email || "No especificado"}
            </p>
          </div>

          <div className="mb-3 text-center">
            <p className="mb-1 fw-semibold">Teléfono</p>
            <p className="text-muted border rounded px-3 py-2 m-0">
              {perfilData?.telefono || "No especificado"}
            </p>
          </div>

          <div className="mb-4 text-center">
            <p className="mb-1 fw-semibold">País</p>
            <p className="text-muted border rounded px-3 py-2 m-0">
              {perfilData?.pais || "No especificado"}
            </p>
          </div>

          <div className="text-center">
            <Button variant="primary" onClick={handleShow}>
              Editar Perfil
            </Button>
          </div>
        </Card>
      </Container>

      {/* MODAL EDITAR */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Nombre */}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Teléfono */}
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>

            {/* País */}
            <Form.Group className="mb-3">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button
                variant="secondary"
                className="me-2 mt-3 mb-0"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default Perfil;