// src/pages/TasksPage.tsx
import { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Row, Col, Card, Alert } from 'react-bootstrap';
import type { Task } from '../types';
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import taskService from '../services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasks();
        setTasks(response.data);
      } catch (err) {
        setError('Error al cargar las tareas. Por favor, intenta recargar la página.');
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    try {
      const response = await taskService.createTask(newTaskTitle);
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Error al crear la tarea. Inténtalo de nuevo.');
      console.error(err);
    }
  };

  const handleToggleComplete = (id: number) => {
    console.log("Completar tarea (lógica pendiente):", id);
  };

  const handleDelete = (id: number) => {
    console.log("Eliminar tarea (lógica pendiente):", id);
  };

  const handleEdit = (id: number, newTitle: string) => {
    console.log("Editar tarea (lógica pendiente):", id, newTitle);
  };

  return (
    <>
      <Header />
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4 text-center">Mis Tareas</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                
                {/* --- ESTA ES LA PARTE QUE FALTABA --- */}
                <Form onSubmit={handleAddTask} className="mb-4">
                  <Form.Group>
                    <Row>
                      <Col xs={9}>
                        <Form.Control
                          type="text"
                          placeholder="Añadir nueva tarea..."
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                      </Col>
                      <Col xs={3} className="d-grid">
                        <Button type="submit" variant="primary">Añadir</Button>
                      </Col>
                    </Row>
                  </Form.Group>
                </Form>
                {/* --- FIN DE LA SECCIÓN QUE FALTABA --- */}

                {tasks.length === 0 && !error && (
                  <p className="text-center text-muted">¡Felicidades! No tienes tareas pendientes.</p>
                )}

                <ListGroup>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TasksPage;