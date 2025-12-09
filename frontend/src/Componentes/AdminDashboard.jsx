import React, { useState, useEffect } from "react";
import MyNavbar from "../views/MyNavbar";
import axios from "axios";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

function AdminDashboard() {
  // ---------- ESTADO PARA NUEVO PRODUCTO ----------
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // ---------- ESTADO PARA LISTA / EDICIÓN DE PRODUCTOS ----------
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState("");

  const [productoEdit, setProductoEdit] = useState(null);
  const [mostrandoModalEdit, setMostrandoModalEdit] = useState(false);
  const [guardandoProducto, setGuardandoProducto] = useState(false);

  // ---------- ESTADO PARA ÓRDENES ----------
  const [ordenes, setOrdenes] = useState([]);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(true);
  const [errorOrdenes, setErrorOrdenes] = useState("");
  const [actualizando, setActualizando] = useState(false);

  // ---------- HELPERS ----------
  const getBadgeColor = (estado) => {
    if (estado === "completado") return "success";
    if (estado === "cancelado") return "danger";
    return "warning";
  };

  const formatearMoneda = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(valor);

  // ---------- CARGAR ÓRDENES ----------
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró token. Inicia sesión como admin.");
        }

        const response = await axios.get(`${API_BASE}/api/ordenes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrdenes(response.data);
        setCargandoOrdenes(false);
      } catch (err) {
        setErrorOrdenes(
          err.response?.data?.message ||
          err.message ||
          "Error al cargar las órdenes."
        );
        setCargandoOrdenes(false);
      }
    };

    fetchOrdenes();
  }, []);

  // ---------- CARGAR PRODUCTOS ----------
  const fetchProductos = async () => {
    try {
      setCargandoProductos(true);
      const response = await axios.get(`${API_BASE}/api/productos`);
      setProductos(response.data);
      setCargandoProductos(false);
    } catch (err) {
      setErrorProductos(
        err.response?.data?.message ||
        err.message ||
        "Error al cargar los productos."
      );
      setCargandoProductos(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ---------- CREAR PRODUCTO ----------
  const handleSubmitProducto = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !precio || !stock || !imagen) {
      setError("Todos los campos son obligatorios.");
      setMensaje(null);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión como admin para agregar productos.");
      setMensaje(null);
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("stock", stock);
    formData.append("imagen", imagen);

    try {
      await axios.post(`${API_BASE}/api/productos/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje("Producto agregado correctamente.");
      setError(null);

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setImagen(null);

      fetchProductos();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Error al agregar el producto."
      );
      setMensaje(null);
    }
  };

  // ---------- CAMBIAR ESTADO DE ORDEN ----------
  const handleCambiarEstado = async (idOrden, nuevoEstado) => {
    try {
      setActualizando(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró token. Inicia sesión como admin.");
      }

      const response = await axios.put(
        `${API_BASE}/api/ordenes/${idOrden}/estado`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrdenes((prev) =>
        prev.map((o) => (o.id === idOrden ? response.data : o))
      );

      setActualizando(false);
    } catch (err) {
      console.error(err);
      setErrorOrdenes(
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el estado de la orden."
      );
      setActualizando(false);
    }
  };

  // ---------- MODAL EDICIÓN PRODUCTO ----------
  const manejarAbrirEditarProducto = (producto) => {
    setProductoEdit({ ...producto });
    setMostrandoModalEdit(true);
  };

  const manejarCerrarModal = () => {
    setMostrandoModalEdit(false);
    setProductoEdit(null);
  };

  const handleGuardarProductoEditado = async (e) => {
    e.preventDefault();
    if (!productoEdit) return;

    try {
      setGuardandoProducto(true);

      const token = localStorage.getItem("token");
      console.log("TOKEN QUE SE ENVÍA EN EDIT:", token);

      const formData = new FormData();
      formData.append("nombre", productoEdit.nombre);
      formData.append("descripcion", productoEdit.descripcion || "");
      formData.append("precio", productoEdit.precio);
      formData.append("stock", productoEdit.stock);

      if (productoEdit.imagen instanceof File) {
        formData.append("imagen", productoEdit.imagen);
      }

      const response = await axios.put(
        `${API_BASE}/api/productos/actualizar/${productoEdit.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProductos((prev) =>
        prev.map((p) => (p.id === productoEdit.id ? response.data : p))
      );

      setGuardandoProducto(false);
      manejarCerrarModal();
    } catch (err) {
      console.error("Error al guardar producto editado:", err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el producto."
      );
      setGuardandoProducto(false);
    }
  };

  return (
    <>
      <MyNavbar />

      <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <Container className="d-flex justify-content-center">
          <div style={{ maxWidth: "1200px", width: "100%" }}>
            <h2 className="fw-bold mb-4 text-center">
              🛠 Panel de Administración
            </h2>

            <Row className="g-4 justify-content-center">
              {/* ------------ CARD 1: AGREGAR PRODUCTO ------------ */}
              <Col lg={4} md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <h4 className="mb-3 text-center">
                      🛒 Agregar Nuevo Producto
                    </h4>

                    {mensaje && <Alert variant="success">{mensaje}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmitProducto}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre del producto</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ej. Camiseta Oficial 2024"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Descripción detallada del producto"
                          value={descripcion}
                          onChange={(e) => setDescripcion(e.target.value)}
                        />
                      </Form.Group>

                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Precio (S/)</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="299.90"
                              step="0.01"
                              value={precio}
                              onChange={(e) => setPrecio(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="50"
                              value={stock}
                              onChange={(e) => setStock(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Imagen del producto</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImagen(e.target.files[0])}
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="success" type="submit">
                          Guardar Producto
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* ------------ CARD 2: LISTA DE PRODUCTOS ------------ */}
              <Col lg={4} md={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <h4 className="mb-3 text-center">📋 Productos</h4>

                    {errorProductos && (
                      <Alert variant="danger">{errorProductos}</Alert>
                    )}

                    {cargandoProductos ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2 mb-0">Cargando productos...</p>
                      </div>
                    ) : productos.length === 0 ? (
                      <Alert variant="info">
                        No hay productos registrados todavía.
                      </Alert>
                    ) : (
                      <Table
                        hover
                        size="sm"
                        className="align-middle w-100 mb-0"
                      >
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((p) => (
                            <tr key={p.id}>
                              <td style={{ maxWidth: 130 }}>
                                <span style={{ fontSize: "0.85rem" }}>
                                  {p.nombre}
                                </span>
                              </td>
                              <td style={{ fontSize: "0.85rem" }}>
                                {formatearMoneda(p.precio)}
                              </td>
                              <td style={{ fontSize: "0.85rem" }}>{p.stock}</td>
                              <td className="text-center">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => manejarAbrirEditarProducto(p)}
                                >
                                  Editar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* ------------ CARD 3: GESTIÓN DE PEDIDOS ------------ */}
              <Col lg={4} md={8}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <h4 className="mb-3 text-center">📦 Gestión de Pedidos</h4>

                    {errorOrdenes && <Alert variant="danger">{errorOrdenes}</Alert>}

                    {cargandoOrdenes ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2 mb-0">Cargando órdenes...</p>
                      </div>
                    ) : ordenes.length === 0 ? (
                      <Alert variant="info">No hay órdenes registradas todavía.</Alert>
                    ) : (
                      // 💡 WRAPPER RESPONSIVE PARA LA TABLA
                      <div className="table-responsive">
                        <Table
                          hover
                          size="sm"
                          className="align-middle w-100 mb-0"
                        >
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Fecha</th>
                              <th>Estado</th>
                              <th>Total</th>
                              <th className="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordenes.map((orden) => (
                              <tr key={orden.id}>
                                <td style={{ fontSize: "0.85rem" }}>{orden.id}</td>
                                <td style={{ fontSize: "0.85rem" }}>
                                  {new Date(orden.fechaCreacion).toLocaleDateString()}
                                </td>
                                <td>
                                  <Badge
                                    bg={getBadgeColor(orden.estado)}
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {orden.estado.toUpperCase()}
                                  </Badge>
                                </td>
                                <td style={{ fontSize: "0.85rem" }}>
                                  {formatearMoneda(orden.total)}
                                </td>
                                <td
                                  className="text-center"
                                  style={{ fontSize: "0.8rem", minWidth: 160 }}
                                >
                                  {/* 💡 FLEX CON WRAP PARA QUE NO SE SALGA */}
                                  <div className="d-flex flex-column flex-md-row flex-wrap justify-content-center gap-2">
                                    <Button
                                      variant="success"
                                      size="sm"
                                      disabled={
                                        actualizando || orden.estado === "completado"
                                      }
                                      onClick={() =>
                                        handleCambiarEstado(orden.id, "completado")
                                      }
                                    >
                                      {actualizando && orden.estado !== "completado"
                                        ? "Actualizando..."
                                        : "Marcar entregado"}
                                    </Button>

                                    <Button
                                      variant="danger"
                                      size="sm"
                                      disabled={
                                        actualizando || orden.estado === "cancelado"
                                      }
                                      onClick={() =>
                                        handleCambiarEstado(orden.id, "cancelado")
                                      }
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* -------- MODAL EDICIÓN PRODUCTO -------- */}
      <Modal show={mostrandoModalEdit} onHide={manejarCerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar producto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGuardarProductoEditado}>
          <Modal.Body>
            {productoEdit && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={productoEdit.nombre}
                    onChange={(e) =>
                      setProductoEdit((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={productoEdit.descripcion || ""}
                    onChange={(e) =>
                      setProductoEdit((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio (S/)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        value={productoEdit.precio}
                        onChange={(e) =>
                          setProductoEdit((prev) => ({
                            ...prev,
                            precio: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        value={productoEdit.stock}
                        onChange={(e) =>
                          setProductoEdit((prev) => ({
                            ...prev,
                            stock: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={manejarCerrarModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={guardandoProducto}>
              {guardandoProducto ? "Guardando..." : "Guardar cambios"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AdminDashboard;