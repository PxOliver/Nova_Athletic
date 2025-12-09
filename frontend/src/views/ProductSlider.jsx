import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { MdChevronLeft, MdChevronRight } from "react-icons/md"; 
import "../stylesheets/ProductSlider.css"; 
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ProductSlider = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/productos`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
      });
  }, []); 

  const slideLeft = () => {
    const slider = document.getElementById("product-slider");
    slider.scrollLeft = slider.scrollLeft - 300; 
  };

  const slideRight = () => {
    const slider = document.getElementById("product-slider");
    slider.scrollLeft = slider.scrollLeft + 300; 
  };

  return (
    <div className="product-slider-container">
      <MdChevronLeft
        size={40}
        className="slider-icon left"
        onClick={slideLeft}
      />

      <div id="product-slider" className="product-slider">
        {products.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={
                    product.imagenUrl.startsWith("http")
                      ? product.imagenUrl
                      : `${API_BASE}${product.imagenUrl}`
                  }
                />

                <Card.Body>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text>
                    <strong>Precio:</strong>{" "}
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                      minimumFractionDigits: 2,
                    }).format(product.precio)}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/producto/${product.id}`)}
                  >
                    Ver Producto
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>

      <MdChevronRight
        size={40}
        className="slider-icon right"
        onClick={slideRight}
      />
    </div>
  );
};

export default ProductSlider;