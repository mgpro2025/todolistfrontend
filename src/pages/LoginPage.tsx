// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Importamos el servicio

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Convertimos la función a 'async'
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // Llamamos al método 'login' de nuestro servicio
      const response = await authService.login({ email, password });

      // Si el login es exitoso y recibimos un token...
      if (response.data.token) {
        // Guardamos el token en el localStorage del navegador.
        // Esto nos permitirá mantener al usuario "logueado".
        localStorage.setItem('token', response.data.token);

        // Redirigimos al usuario a la página de tareas
        navigate('/tasks');
      }
    } catch (err: any) {
      // Si el backend devuelve un error (ej: credenciales incorrectas), lo mostramos.
      setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.");
      console.error("Error en el login:", err);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              {/* Mostramos el mensaje de error si existe */}
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