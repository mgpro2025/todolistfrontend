import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });

    // Simulación de login exitoso
    alert('Inicio de sesión exitoso (simulación)');
    navigate('/tasks'); // ¡Redirige a la página de tareas!
  };

  return (
    // El Container sigue siendo flex para centrar verticalmente (align-items-center)
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      
      {/* CAMBIO CLAVE: 
          - w-100: Asegura que la fila ocupe todo el ancho del contenedor.
          - justify-content-center: Es la clase de Bootstrap para centrar las columnas horizontalmente dentro de la fila.
      */}
      <Row className="w-100 justify-content-center">

        {/* CAMBIO CLAVE: Se definen anchos para distintos tamaños de pantalla.
            - xs={11}: En pantallas extra pequeñas (móviles), la columna ocupa 11 de 12 espacios. No toca los bordes.
            - md={8}: En pantallas medianas, se hace un poco más ancha.
            - lg={6}: En pantallas grandes, se hace más angosta y centrada.
            - xl={5}: En pantallas extra grandes, aún más compacta.
        */}
        <Col xs={11} md={8} lg={6} xl={5}>

          {/* AÑADIDO: La clase 'shadow-sm' le da una sombra sutil a la tarjeta para que resalte más. */}
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Button className="w-100 mt-4" type="submit">
                  Entrar
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;