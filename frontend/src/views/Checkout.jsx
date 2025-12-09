import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Componentes/CartContext";
import { useAuth } from "../Componentes/AuthContext";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";

function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  const [shippingAddress, setShippingAddress] = useState({
    direccion: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );
  const shippingCost = subtotal > 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para completar la compra.");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "No se encontró el token de autenticación. Vuelve a iniciar sesión."
        );
      }

      if (
        !shippingAddress.direccion ||
        !shippingAddress.ciudad ||
        !shippingAddress.departamento
      ) {
        throw new Error("Por favor completa todos los campos de dirección.");
      }

      const orderData = {
        items: cart.map((item) => ({
          productoId: item.id,
          cantidad: item.quantity,
          precioUnitario: item.precio,
        })),
        direccionEnvio: shippingAddress,
        metodoPago: paymentMethod,
        subtotal,
        costoEnvio: shippingCost,
        total,
        estado: "pendiente",
      };

      const response = await axios.post(
        "http://localhost:8080/api/ordenes",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate(`/orden/${response.data.id}`);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al procesar la orden."
      );
      setLoading(false);
    }
  };

  // 🔹 Bloque visual para simular los datos de pago
  const renderPaymentFields = () => {
    if (paymentMethod === "tarjeta") {
      return (
        <div className="bg-light rounded-3 p-3 mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre en la tarjeta</Form.Label>
            <Form.Control
              type="text"
              placeholder="Oliver Perez"
              autoComplete="cc-name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Número de tarjeta</Form.Label>
            <Form.Control
              type="text"
              placeholder="**** **** **** 1234"
              autoComplete="cc-number"
            />
          </Form.Group>
          <Row>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Fecha vencimiento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="MM/AA"
                  autoComplete="cc-exp"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="***"
                  autoComplete="cc-csc"
                />
              </Form.Group>
            </Col>
          </Row>
          <small className="text-muted">
            Esta información es privada, no dudes en confiar en nosotros.
          </small>
        </div>
      );
    }

    if (paymentMethod === "paypal") {
      return (
        <div className="bg-light rounded-3 p-3 mb-4">
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Correo de PayPal</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu-correo@paypal.com"
              autoComplete="email"
            />
          </Form.Group>
          <small className="text-muted">
            No compartas tu información con cualquiera.
          </small>
        </div>
      );
    }

    // contraentrega
    return (
      <div className="bg-light rounded-3 p-3 mb-4">
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Teléfono de contacto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: 987 654 321"
            autoComplete="tel"
          />
        </Form.Group>
        <small className="text-muted">
          Pagarás al momento de recibir tu pedido. Nuestro repartidor se
          comunicará contigo al llegar.
        </small>
      </div>
    );
  };

  // ✅ Pantalla de éxito
  if (success) {
    return (
      <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
        <Container className="d-flex justify-content-center">
          <div style={{ maxWidth: "500px", width: "100%" }}>
            <Card className="shadow-lg border-0 text-center">
              <Card.Body className="p-4">
                <Alert variant="success" className="mb-0">
                  <Alert.Heading>¡Compra exitosa! 🎉</Alert.Heading>
                  <p className="mt-3 mb-1">
                    Tu orden ha sido procesada correctamente.
                  </p>
                  <p className="mb-0">
                    Serás redirigido a los detalles de tu orden en unos momentos...
                  </p>
                </Alert>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: "90px", paddingBottom: "40px" }}>
      <Container className="d-flex justify-content-center">
        <div style={{ maxWidth: "1100px", width: "100%" }}>
          <Row className="mb-4">
            <Col className="text-center">
              <h2 className="fw-bold mb-2">Finalizar Compra</h2>
              <p className="text-muted mb-0">
                Revisa tus datos y confirma tu pedido. Estás a un paso de estrenar tu nuevo outfit ✨
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            {/* IZQUIERDA */}
            <Col lg={7} md={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                  <span>Información de Envío</span>
                  {user && (
                    <small className="text-light-50">
                      Comprador: <strong>{user.username || user.nombre}</strong>
                    </small>
                  )}
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        placeholder="Av. Siempre Viva 742"
                        value={shippingAddress.direccion}
                        onChange={handleAddressChange}
                        required
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Ciudad</Form.Label>
                          <Form.Control
                            type="text"
                            name="ciudad"
                            placeholder="Lima"
                            value={shippingAddress.ciudad}
                            onChange={handleAddressChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Departamento
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="departamento"
                            placeholder="Lima"
                            value={shippingAddress.departamento}
                            onChange={handleAddressChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        Código Postal <span className="text-muted">(opcional)</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="codigoPostal"
                        placeholder="15001"
                        value={shippingAddress.codigoPostal}
                        onChange={handleAddressChange}
                      />
                    </Form.Group>

                    <hr />

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold mb-3">
                        Método de Pago
                      </Form.Label>
                      <div className="d-flex flex-column gap-2">
                        <Form.Check
                          type="radio"
                          id="tarjeta"
                          label="Tarjeta de Crédito/Débito"
                          name="paymentMethod"
                          value="tarjeta"
                          checked={paymentMethod === "tarjeta"}
                          onChange={() => setPaymentMethod("tarjeta")}
                        />
                        <Form.Check
                          type="radio"
                          id="paypal"
                          label="PayPal"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                        />
                        <Form.Check
                          type="radio"
                          id="contraentrega"
                          label="Contra Entrega"
                          name="paymentMethod"
                          value="contraentrega"
                          checked={paymentMethod === "contraentrega"}
                          onChange={() => setPaymentMethod("contraentrega")}
                        />
                      </div>
                    </Form.Group>

                    {/* 🔹 Simulación de datos según el método de pago */}
                    {renderPaymentFields()}

                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}

                    <Button
                      variant="dark"
                      type="submit"
                      disabled={loading}
                      className="w-100 py-2 fw-semibold"
                    >
                      {loading ? "Procesando..." : "Confirmar Compra"}
                    </Button>

                    <p
                      className="text-muted text-center mt-3 mb-0"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Al confirmar, aceptas nuestros términos y condiciones de compra.
                    </p>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* DERECHA */}
            <Col lg={5} md={4}>
              <Card
                className="shadow-sm border-0"
                style={{ borderRadius: "16px" }}
              >
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Resumen de Orden</span>
                  {shippingCost === 0 && <Badge bg="success">Envío Gratis</Badge>}
                </Card.Header>
                <Card.Body className="p-3">
                  <ListGroup variant="flush">
                    {cart.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex justify-content-between align-items-start"
                      >
                        <div>
                          <div className="fw-semibold">{item.nombre}</div>
                          <small className="text-muted">
                            Cantidad: {item.quantity}
                          </small>
                        </div>
                        <div className="fw-semibold">
                          {new Intl.NumberFormat("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          }).format(item.precio * item.quantity)}
                        </div>
                      </ListGroup.Item>
                    ))}

                    <ListGroup.Item className="d-flex justify-content-between">
                      <div>Subtotal</div>
                      <div>
                        {new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        }).format(subtotal)}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between">
                      <div>Envío</div>
                      <div>
                        {shippingCost === 0 ? (
                          <span className="text-success fw-semibold">Gratis</span>
                        ) : (
                          new Intl.NumberFormat("es-PE", {
                            style: "currency",
                            currency: "PEN",
                          }).format(shippingCost)
                        )}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                      <div>Total</div>
                      <div>
                        {new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        }).format(total)}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
                    <p className="mb-1">
                      📦 Entrega estimada: <strong>3 - 5 días hábiles</strong>.
                    </p>
                    <p className="mb-0">🔒 Pago 100% seguro y protegido.</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default Checkout;