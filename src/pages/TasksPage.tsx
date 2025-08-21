// src/pages/TasksPage.tsx
import { useState } from 'react';
import { Container, Form, Button, ListGroup, Row, Col, Card } from 'react-bootstrap';
import type { Task } from '../types'; // Corregido a 'import type'
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';

function TasksPage() {
  // 1. ACTUALIZAMOS los datos de ejemplo para incluir las nuevas propiedades.
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: 'Configurar el entorno de desarrollo', 
      completed: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // Hace 1 día
    },
    { id: 2, title: 'Crear componentes de la UI', completed: true, createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
    { id: 3, title: 'Conectar el frontend con el backend', completed: false, createdAt: new Date().toISOString() },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    // 2. AÑADIMOS 'createdAt' al crear una nueva tarea.
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString(), // Fecha de creación actual
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleToggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          const isCompleted = !task.completed;
          // 3. AÑADIMOS o quitamos 'completedAt' al marcar/desmarcar.
          return {
            ...task,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (id: number, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
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
                <Form onSubmit={handleAddTask} className="mb-4">
                  {/* ... el formulario no cambia ... */}
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