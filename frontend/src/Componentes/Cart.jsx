import React from "react";
import { useCart } from "./CartContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // Calcular subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  // Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info" className="py-4 fs-5">
          Tu carrito está vacío 🛒
        </Alert>

        <Button variant="dark" size="lg" onClick={() => navigate("/home")}>
          Ir a comprar
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="fw-bold mb-4 text-center">Tu Carrito de Compras 🛒</h2>

      <Row>
        {/* Lista de productos */}
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-dark text-white fs-5">
              Productos agregados
            </Card.Header>

            <ListGroup variant="flush">
              {cart.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="fw-bold mb-1">{item.nombre}</h6>
                    <p className="text-muted mb-1">
                      Precio: S/ {item.precio.toFixed(2)}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </Button>

                      <span className="px-2">{item.quantity}</span>

                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal por producto */}
                  <div className="text-end">
                    <p className="fw-bold mb-1">
                      S/ {(item.precio * item.quantity).toFixed(2)}
                    </p>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Resumen */}
        <Col md={4}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: "90px" }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Resumen de Compra</h5>
            </Card.Header>

            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="fw-semibold">Subtotal:</span>
                  <span className="fw-bold">S/ {subtotal.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>

              <div className="d-grid mt-4">
                <Button
                  variant="dark"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar Compra
                </Button>
              </div>

              <div className="d-grid mt-2">
                <Button variant="outline-danger" size="sm" onClick={clearCart}>
                  Vaciar Carrito
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;