import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  Button,
  Offcanvas,
  Badge,
} from "react-bootstrap";
import { FaShoppingBag } from "react-icons/fa";
import { useAuth } from "../Componentes/AuthContext";
import { useCart } from "../Componentes/CartContext";
import { useNavigate } from "react-router-dom";
import "../stylesheets/MyNavbar.css";

function MyNavbar() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    showCartMenu,
    setShowCartMenu,
    clearCart,
  } = useCart();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/productos")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredProducts([]);
      setShowSuggestions(false);
    } else {
      const filtered = products.filter((p) =>
        p.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filteredProducts.length > 0) {
      navigate(`/producto/${filteredProducts[0].id}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  const handleCartClick = () => {
    setShowCartMenu(!showCartMenu);
  };

  const handleIncreaseQuantity = (productId, stock) => {
    const productInCart = cart.find((item) => item.id === productId);
    if (productInCart.quantity < stock) {
      increaseQuantity(productId);
      setErrorMessage("");
    } else {
      setErrorMessage("No hay suficiente stock disponible.");
    }
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
    setErrorMessage("");
  };

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  const handleCheckout = () => {
    navigate(user ? "/checkout" : "/login");
  };

  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  return (
    <Navbar expand="lg" className="color-navbar fixed-top px-3 py-2">
      <Container fluid>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={require("../imagenes/logo.png")}
            alt="Logo"
            className="imagen_logo me-2"
            style={{ height: "40px" }}
          />
          Tienda Deportiva Nova Atletic
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* IZQUIERDA */}
          <Nav className="me-auto align-items-center">
            {/* Buscador */}
            <div className="search-container ms-4" ref={searchRef}>
              <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Buscar productos"
                  className="rounded-pill px-3"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                />
              </Form>

              {showSuggestions && (
                <div className="search-suggestions">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="suggestion-item"
                        onClick={() => {
                          setSearchTerm("");
                          setShowSuggestions(false);
                          navigate(`/producto/${product.id}`);
                        }}
                      >
                        <img
                          src={
                            product.imagenUrl.startsWith("http")
                              ? product.imagenUrl
                              : `http://localhost:8080${product.imagenUrl}`
                          }
                          alt={product.nombre}
                          className="suggestion-image"
                        />
                        <div className="suggestion-details">
                          <div className="suggestion-name">
                            {product.nombre}
                          </div>
                          <div className="suggestion-price">
                            {new Intl.NumberFormat("es-PE", {
                              style: "currency",
                              currency: "PEN",
                            }).format(product.precio)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      No se encontraron productos.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Nav>

          {/* DERECHA */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Icono carrito */}
            <Nav.Link onClick={handleCartClick} className="position-relative">
              <FaShoppingBag size={24} />
              {totalItemsInCart > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {totalItemsInCart}
                </Badge>
              )}
            </Nav.Link>

            {/* Usuario / Admin */}
            {user ? (
              user.rol === "ADMIN" ? (
                // Dropdown para ADMIN
                <NavDropdown
                  title={user.name || user.username || "Admin"}
                  id="basic-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item href="/admin">
                    Panel Admin
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Dropdown para usuario normal
                <NavDropdown
                  title={user.name || user.username || "Usuario"}
                  id="basic-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item href="/perfil">Perfil</NavDropdown.Item>
                  <NavDropdown.Item href="/mis-ordenes">
                    Mis pedidos
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/ayuda">Ayuda</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              )
            ) : (
              <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* OFFCANVAS CARRITO */}
      <Offcanvas
        show={showCartMenu}
        onHide={() => setShowCartMenu(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="form-title fw-semibold w-100 text-center">
            🛒 Carrito de Compras
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          {errorMessage && (
            <div className="alert alert-danger text-center">
              {errorMessage}
            </div>
          )}

          <div className="cart-items-container">
            {cart.length > 0 ? (
              cart.map((product) => (
                <div key={product.id} className="cart-item mb-3">
                  <img
                    src={
                      product.imagenUrl.startsWith("http")
                        ? product.imagenUrl
                        : `http://localhost:8080${product.imagenUrl}`
                    }
                    alt={product.nombre}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <p className="fw-bold mb-1">{product.nombre}</p>
                    <p className="text-muted mb-1">
                      Unitario:{" "}
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(product.precio)}
                    </p>
                    <div className="quantity-container mb-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDecreaseQuantity(product.id)}
                      >
                        -
                      </Button>
                      <span className="mx-2 fw-semibold">
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleIncreaseQuantity(product.id, product.stock)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p className="mb-2">
                      Total:{" "}
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(product.precio * product.quantity)}
                    </p>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted mt-4">
                Tu carrito está vacío.
              </p>
            )}
          </div>

          <div className="cart-total mt-4">
            <hr />
            <p className="fw-bold text-center mb-3">
              Total a pagar:{" "}
              {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(totalPrice)}
            </p>
            {totalItemsInCart > 0 && (
              <Button
                className="w-100 bg-green text-white"
                onClick={handleCheckout}
              >
                {user ? "Ir a pagar" : "Inicia sesión para continuar"}
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default MyNavbar;