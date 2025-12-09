import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios"; 
import { Card, Button, Spinner, Row, Col, Container } from "react-bootstrap"; 
import { useCart } from "../Componentes/CartContext"; 
import "../stylesheets/ProductDetails.css"; 

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const { addToCart, setShowCartMenu, errorMessage } = useCart(); 
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/productos/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("Error al cargar el producto"); 
      } finally {
        setLoading(false); 
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = product.precio * quantity;

  return (
    <Container className="product-detail-container">
      <Card className="product-detail-card">
        <Row className="g-0">
          {/* Columna de la imagen del producto */}
          <Col md={6}>
            <Card.Img
              variant="top"
              src={
                product.imagenUrl.startsWith("http")
                  ? product.imagenUrl
                  : `${API_BASE}${product.imagenUrl}`
              }
              className="product-detail-img"
            />
          </Col>

          {/* Columna con los detalles del producto */}
          <Col md={6}>
            <Card.Body>
              <Card.Title>{product.nombre}</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {product.descripcion}
              </Card.Text>
              <Card.Text>
                <strong>Precio Unitario:</strong>{" "}
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: "PEN",
                  minimumFractionDigits: 2,
                }).format(product.precio)}
              </Card.Text>
              <Card.Text>
                <strong>Stock:</strong> {product.stock}
              </Card.Text>

              {/* Controles para seleccionar la cantidad */}
              <div className="quantity-container">
                <Button variant="secondary" onClick={decreaseQuantity}>
                  -
                </Button>
                <span className="quantity">{quantity}</span>
                <Button variant="secondary" onClick={increaseQuantity}>
                  +
                </Button>
              </div>

              {/* Muestra el precio total según la cantidad seleccionada */}
              <Card.Text>
                <strong>Precio Total:</strong>{" "}
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: "PEN",
                  minimumFractionDigits: 2,
                }).format(totalPrice)}
              </Card.Text>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => {
                  addToCart(product, quantity); 
                  setShowCartMenu(true);
                }}
              >
                Agregar al Carrito
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetail;