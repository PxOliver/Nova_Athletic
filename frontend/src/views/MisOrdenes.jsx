import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Button,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Debes iniciar sesión.");

        const response = await axios.get(
          `${API_BASE}/api/ordenes/usuario`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrdenes(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Error al cargar tus órdenes"
        );
        setLoading(false);
      }
    };

    cargarOrdenes();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5 pt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando órdenes...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container
      className="my-5"
      style={{
        maxWidth: "1100px",
        paddingTop: "80px",
      }}
    >
      <h2
        className="fw-bold mb-4"
        style={{
          fontSize: "2rem",
          textAlign: "center",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <span role="img" aria-label="box">📦</span>
        Mis Órdenes
      </h2>

      {ordenes.length === 0 ? (
        <Alert variant="info" className="text-center fs-5 py-4">
          Aún no tienes órdenes registradas.
        </Alert>
      ) : (
        <Row className="g-4 justify-content-center">
          {ordenes.map((orden) => (
            <Col xs={12} sm={6} md={4} key={orden.id}>
              <Card
                className="shadow border-0 h-100"
                style={{
                  borderRadius: "20px",
                  padding: "10px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Card.Body className="d-flex flex-column align-items-center">
                  <h5 className="fw-bold mb-3">Orden #{orden.id}</h5>

                  <p className="m-0">
                    <strong>Fecha:</strong>{" "}
                    {new Date(orden.fechaCreacion).toLocaleDateString()}
                  </p>

                  <p className="m-0 mt-2">
                    <strong>Estado:</strong>{" "}
                    <Badge
                      bg={
                        orden.estado === "completado"
                          ? "success"
                          : orden.estado === "cancelado"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {orden.estado}
                    </Badge>
                  </p>

                  <p className="m-0 mt-2">
                    <strong>Total:</strong>{" "}
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(orden.total)}
                  </p>

                  <Button
                    variant="dark"
                    className="mt-4"
                    style={{ width: "100%" }}
                    onClick={() => navigate(`/orden/${orden.id}`)}
                  >
                    Ver detalles
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default MisOrdenes;