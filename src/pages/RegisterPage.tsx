// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function RegisterPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await authService.register({ email, password });
      setSuccess(response.data);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Error al registrar el usuario. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Registrarse</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {/* LA PARTE QUE FALTABA ESTÁ AQUÍ DENTRO */}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  {/* Aquí se usa setEmail */}
                  <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group id="password" className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  {/* Aquí se usa setPassword */}
                  <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Form.Group id="confirm-password">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  {/* Aquí se usa setConfirmPassword */}
                  <Form.Control type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>

                <Button className="w-100 mt-4" type="submit">
                  Registrarse
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-muted text-center">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;