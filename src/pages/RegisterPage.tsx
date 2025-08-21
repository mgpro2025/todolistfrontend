import { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log({ email, password });
    alert('Usuario registrado (simulación con TypeScript)');
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      {/* Se aplican los mismos cambios aquí */}
      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Registrarse</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group id="password" className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group id="confirm-password">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control type="password" required onChange={(e) => setConfirmPassword(e.target.value)} />
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