import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login({ email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/tasks');
      }
    } catch (err: any) {
      setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.");
      console.error("Error en el login:", err);
    }
  };

  return (
    // CAMBIO 1: Quitamos 'justify-content-center' y añadimos 'pt-5' (padding-top)
    // Esto alinea el contenido arriba en lugar de al centro.
    <Container className="d-flex flex-column align-items-center pt-5" style={{ minHeight: '100vh' }}>
      
      {/* CAMBIO 2: Unimos el título en una sola línea y ajustamos el margen */}
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-primary">Gestor de Tareas MGM</h2>
      </div>

      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">Iniciar Sesión</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group id="password" className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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