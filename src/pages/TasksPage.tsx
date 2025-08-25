import { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, ListGroup, Row, Col, Card, Spinner, ButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import type { Task } from '../types';
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import taskService from '../services/taskService';

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>(''); // Estado para la nueva fecha de vencimiento
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getTasks();
        setTasks(response.data);
      } catch (err) {
        toast.error('Error al cargar las tareas.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const displayedTasks = useMemo(() => {
    let filteredTasks = tasks;
    if (filter === 'pending') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }
    return filteredTasks.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [tasks, filter, sortOrder]);

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;
    try {
      // Pasa el título y la fecha (o null si está vacía)
      const response = await taskService.createTask(newTaskTitle, newDueDate || null);
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewDueDate(''); // Limpia el campo de fecha
      toast.success('¡Tarea creada exitosamente!');
    } catch (err) {
      toast.error('Error al crear la tarea.');
      console.error(err);
    }
  };

  const handleToggleComplete = async (id: number) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    try {
      const response = await taskService.updateTaskCompletion(id, !taskToUpdate.completed);
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
      toast.success('¡Tarea actualizada!');
    } catch (err) {
      toast.error('Error al actualizar la tarea.');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Tarea eliminada.');
    } catch (err) {
      toast.error('Error al eliminar la tarea.');
      console.error(err);
    }
  };

  const handleEdit = async (id: number, newTitle: string) => {
    try {
      const response = await taskService.updateTaskTitle(id, newTitle);
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
      toast.success('¡Tarea editada!');
    } catch (err) {
      toast.error('Error al editar la tarea.');
      console.error(err);
    }
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
                  <Row>
                    <Col sm={12} md={7} className="mb-2 mb-md-0">
                      <Form.Control
                        type="text"
                        placeholder="Añadir nueva tarea..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        required
                      />
                    </Col>
                    <Col sm={12} md={5}>
                       <Form.Control 
                        type="date" 
                        value={newDueDate} 
                        onChange={(e) => setNewDueDate(e.target.value)} 
                      />
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" className="mt-2 w-100">Añadir Tarea</Button>
                </Form>

                <Row className="mb-3 align-items-center">
                  <Col md={7}>
                    <ButtonGroup aria-label="Filtrar tareas">
                      <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('all')}>Todas</Button>
                      <Button variant={filter === 'pending' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('pending')}>Pendientes</Button>
                      <Button variant={filter === 'completed' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setFilter('completed')}>Completadas</Button>
                    </ButtonGroup>
                  </Col>
                  <Col md={5} className="d-flex justify-content-end">
                    <Form.Select size="sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}>
                      <option value="newest">Más recientes primero</option>
                      <option value="oldest">Más antiguas primero</option>
                    </Form.Select>
                  </Col>
                </Row>

                {isLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p>Cargando tareas...</p>
                  </div>
                ) : (
                  <>
                    {displayedTasks.length === 0 && (
                      <p className="text-center text-muted">
                        {filter === 'all' ? 'No tienes tareas.' : `No tienes tareas ${filter === 'pending' ? 'pendientes' : 'completadas'}.`}
                      </p>
                    )}
                    <ListGroup>
                      {displayedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                        />
                      ))}
                    </ListGroup>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TasksPage;