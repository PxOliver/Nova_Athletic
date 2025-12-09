import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  ListGroup,
  Alert,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Debes iniciar sesión para ver tu orden.");
        }

        const response = await axios.get(
          `http://localhost:8080/api/ordenes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error al cargar la orden."
        );
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getBadgeVariant = (estado) => {
    if (estado === "completado") return "success";
    if (estado === "cancelado") return "danger";
    return "warning";
  };

  // LOADING centrado
  if (loading) {
    return (
      <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 130px)" }}
        >
          <div
            style={{ maxWidth: "400px", width: "100%" }}
            className="text-center"
          >
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Cargando orden...</p>
          </div>
        </Container>
      </section>
    );
  }

  // ERROR centrado
  if (error) {
    return (
      <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 130px)" }}
        >
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <Alert variant="danger" className="text-center fs-5">
              {error}
            </Alert>
          </div>
        </Container>
      </section>
    );
  }

  // VISTA NORMAL
  return (
    <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
      <Container
        className="d-flex justify-content-center align-items-start"
        style={{ minHeight: "calc(100vh - 130px)" }}
      >
        <Card
          className="shadow-lg border-0"
          style={{ maxWidth: "750px", width: "100%", borderRadius: "18px" }}
        >
          <Card.Header
            as="h3"
            className="text-center fw-bold py-3"
            style={{ background: "#111", color: "white" }}
          >
            ¡Gracias por tu compra! 🎉
          </Card.Header>

          <Card.Body className="p-4">
            <Alert variant="success" className="text-center fs-6">
              Tu orden #{order.id} fue procesada correctamente.
            </Alert>

            {/* Resumen */}
            <section className="mb-4 text-center">
              <h5 className="fw-bold">Resumen de la Orden</h5>
              <p className="mb-1">
                <strong>Fecha:</strong>{" "}
                {new Date(order.fechaCreacion).toLocaleDateString()}
              </p>

              <p className="mb-0">
                <strong>Estado:</strong>{" "}
                <Badge bg={getBadgeVariant(order.estado)} className="fs-6">
                  {order.estado.toUpperCase()}
                </Badge>
              </p>
            </section>

            {/* Productos */}
            <section className="mb-4">
              <h5 className="fw-bold text-center">Productos</h5>
              <ListGroup>
                {order.items.map((item) => (
                  <ListGroup.Item
                    key={item.productoId}
                    className="d-flex justify-content-between"
                  >
                    <span>
                      {item.productoNombre} x {item.cantidad}
                    </span>
                    <strong>
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(item.precioUnitario * item.cantidad)}
                    </strong>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </section>

            {/* Dirección */}
            <section className="mb-4 text-center">
              <h5 className="fw-bold">Dirección de Envío</h5>
              <p className="mb-0">
                {order.direccionEnvio.direccion},{" "}
                {order.direccionEnvio.ciudad},{" "}
                {order.direccionEnvio.departamento}
                {order.direccionEnvio.codigoPostal &&
                  `, ${order.direccionEnvio.codigoPostal}`}
              </p>
            </section>

            {/* Totales */}
            <section className="mb-4">
              <h5 className="fw-bold text-center">Total</h5>
              <ListGroup>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <strong>
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(order.subtotal)}
                  </strong>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Envío:</span>
                  <strong>
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(order.costoEnvio)}
                  </strong>
                </ListGroup.Item>

                <ListGroup.Item className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total:</span>
                  <strong>
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(order.total)}
                  </strong>
                </ListGroup.Item>
              </ListGroup>
            </section>

            {/* Botones */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Button variant="dark" href="/" className="px-4">
                Volver al Inicio
              </Button>
              <Button
                variant="outline-dark"
                href="/mis-ordenes"
                className="px-4"
              >
                Ver mis órdenes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default OrderDetails;