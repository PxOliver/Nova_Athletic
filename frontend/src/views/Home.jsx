import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';
import img1 from '../imagenes/banner1.png';
import img2 from '../imagenes/banner2.png';
import ProductSlider from './ProductSlider';


function Home() {
  return (
    <div id="main-carousel" className="carousel">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={img1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={img2}
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
      <Container className="mt-5">
        <h2 className="text-center mb-3">¿Por qué elegirnos?</h2>
        <Row className="text-center">
          <Col md={4}>
            <img src="https://img.icons8.com/ios-filled/100/000000/delivery.png" alt="Envíos rápidos" />
            <h5 className="mt-3">Envíos Rápidos</h5>
            <p>Recibe tus productos en tiempo récord en todo el país.</p>
          </Col>
          <Col md={4}>
            <img src="https://img.icons8.com/ios-filled/100/000000/price-tag-euro.png" alt="Precios competitivos" />
            <h5 className="mt-3">Precios Justos</h5>
            <p>Ofertas y promociones constantes en toda la tienda.</p>
          </Col>
          <Col md={4}>
            <img src="https://img.icons8.com/ios-filled/100/000000/customer-support.png" alt="Atención al cliente" />
            <h5 className="mt-3">Atención Personalizada</h5>
            <p>Estamos aquí para ayudarte antes, durante y después de tu compra.</p>
          </Col>
        </Row>
      </Container>
      <ProductSlider />
    </div>
  );
}

export default Home;