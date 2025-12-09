import React from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  ListGroup,
  Accordion
} from "react-bootstrap";
import MyNavbar from "../views/MyNavbar";

function Ayuda() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <MyNavbar />
      
      {/* Contenido principal centrado */}
      <Container className="flex-grow-1 mt-5 pt-5 mb-4 d-flex flex-column justify-content-center py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={8} className="mx-auto">
            
            {/* Encabezado principal centrado */}
            <div className="text-center mb-5">
              <h1 className="fw-bold text-primary mb-3">
                <i className="bi bi-question-circle me-2"></i>
                Centro de Ayuda
              </h1>
              <p className="lead text-muted">
                Encuentra respuestas a tus preguntas o contacta con nuestro equipo de soporte
              </p>
            </div>

            {/* Sección de Preguntas Frecuentes - Ahora centrada */}
            <Card className="border-0 shadow-sm mb-4 mx-auto" style={{ maxWidth: "800px" }}>
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0 text-center">
                  <i className="bi bi-question-diamond me-2"></i>
                  Preguntas Frecuentes
                </h3>
              </Card.Header>
              <Card.Body>
                <Accordion flush>
                  <Accordion.Item eventKey="0" className="mb-2 border rounded">
                    <Accordion.Header className="justify-content-center">
                      <strong>¿Cómo crear una cuenta?</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="px-3">
                        <p>Para crear una cuenta:</p>
                        <ol>
                          <li>Haz clic en "Registrarse" en la esquina superior derecha</li>
                          <li>Completa el formulario con tus datos</li>
                          <li>Verifica tu correo electrónico</li>
                          <li>¡Listo! Ya puedes acceder a tu cuenta</li>
                        </ol>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="1" className="mb-2 border rounded">
                    <Accordion.Header className="justify-content-center">
                      <strong>¿Cómo realizar un pedido?</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="px-3">
                        <p>El proceso de compra es muy sencillo:</p>
                        <ol>
                          <li>Selecciona el producto que deseas comprar</li>
                          <li>Haz clic en "Agregar al carrito"</li>
                          <li>Ve a tu carrito de compras</li>
                          <li>Selecciona método de pago y envío</li>
                          <li>Confirma tu pedido</li>
                        </ol>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey="2" className="mb-2 border rounded">
                    <Accordion.Header className="justify-content-center">
                      <strong>¿Puedo cambiar mi pedido?</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="px-3">
                        <p>Una vez realizado el pedido, no podrás modificarlo directamente desde tu cuenta. Sin embargo:</p>
                        <ul>
                          <li>Si el pedido aún no ha sido procesado, puedes contactarnos para solicitar cambios</li>
                          <li>Para cancelaciones, consulta nuestra política de devoluciones</li>
                        </ul>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>

            {/* Guía Rápida - Centrada */}
            <Card className="border-0 shadow-sm mb-4 mx-auto" style={{ maxWidth: "800px" }}>
              <Card.Header className="bg-light">
                <h3 className="mb-0 text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  Guía Rápida
                </h3>
              </Card.Header>
              <Card.Body>
                <Row className="justify-content-center">
                  <Col md={6} className="mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3 text-primary">
                        <i className="bi bi-search fs-3"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Buscar Productos</h5>
                        <p className="text-muted mb-0">
                          Usa la barra de búsqueda para encontrar lo que necesitas
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3 text-primary">
                        <i className="bi bi-funnel fs-3"></i>
                      </div>
                      <div>
                        <h5 className="mb-1">Filtrar Resultados</h5>
                        <p className="text-muted mb-0">
                          Aplica filtros por perfil o ayuda
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Contacto Directo - Centrado */}
            <Card className="border-0 shadow-sm mb-4 mx-auto" style={{ maxWidth: "800px" }}>
              <Card.Header className="bg-success text-white">
                <h3 className="mb-0 text-center">
                  <i className="bi bi-headset me-2"></i>
                  Contacto Directo
                </h3>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex flex-column flex-md-row align-items-center justify-content-center py-3 text-center text-md-start">
                    <div className="d-flex align-items-center mb-2 mb-md-0 me-md-3">
                      <i className="bi bi-envelope-fill text-success fs-4 me-3"></i>
                      <h5 className="mb-0">Correo Electrónico</h5>
                    </div>
                    <a href="mailto:soporte@miempresa.com" className="text-decoration-none">
                      NovaAthletic@gmail.com
                    </a>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex flex-column flex-md-row align-items-center justify-content-center py-3 text-center text-md-start">
                    <div className="d-flex align-items-center mb-2 mb-md-0 me-md-3">
                      <i className="bi bi-telephone-fill text-success fs-4 me-3"></i>
                      <h5 className="mb-0">Teléfono</h5>
                    </div>
                    <a href="tel:+51123456789" className="text-decoration-none">
                      +51 123 456 789
                    </a>
                  </ListGroup.Item>
                  
                  <ListGroup.Item className="d-flex flex-column flex-md-row align-items-center justify-content-center py-3 text-center text-md-start">
                    <div className="d-flex align-items-center mb-2 mb-md-0 me-md-3">
                      <i className="bi bi-clock-fill text-success fs-4 me-3"></i>
                      <h5 className="mb-0">Horario de Atención</h5>
                    </div>
                    <div>
                      <p className="mb-0">Lunes a Viernes: 8am - 6pm</p>
                      <p className="mb-0">Sábados: 8am - 1pm</p>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Ayuda;