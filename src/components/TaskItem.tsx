import { useState } from 'react';
import { ListGroup, Button, Stack, Form, FormControl, Modal } from 'react-bootstrap';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Lógica para el modo de Edición ---
  const handleSave = () => {
    if (editedTitle.trim() === '') return;
    onEdit(task.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  // --- Lógica para el Modal de Confirmación de Borrado ---
  const handleShowModal = () => setShowConfirmModal(true);
  const handleCloseModal = () => setShowConfirmModal(false);

  const handleConfirmDelete = () => {
    onDelete(task.id);
    handleCloseModal();
  };

  // --- Funciones para Formatear Fechas y Calcular Duración ---
  const formatChileanDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Santiago'
    };
    return new Intl.DateTimeFormat('es-CL', options).format(date);
  };

  // Formato simple para la fecha de vencimiento (que no tiene hora)
  const formatChileanDate = (dateString: string) => {
    // Añadimos 'T00:00:00' y timeZone UTC para evitar que la fecha cambie por el desfase horario del navegador
    const date = new Date(`${dateString}T00:00:00`);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('es-CL', options).format(date);
  };

  const calculateDuration = () => {
    if (!task.completedAt) return null;
    const startDate = new Date(task.createdAt);
    const endDate = new Date(task.completedAt);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;
    if (diffDays === 0) return "Completada en el mismo día.";
    if (diffDays === 1) return "Tardaste 1 día en completarla.";
    return `Tardaste ${diffDays} días en completarla.`;
  };

  return (
    <>
      <ListGroup.Item
        variant={task.completed ? 'light' : ''}
        className="d-flex justify-content-between align-items-center"
      >
        {isEditing ? (
          <Stack direction="horizontal" gap={2} className="w-100">
            <FormControl value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} autoFocus />
            <Button variant="success" size="sm" onClick={handleSave}>Guardar</Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
          </Stack>
        ) : (
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontWeight: 650, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'grey' : 'black', cursor: 'pointer' }} onClick={() => onToggleComplete(task.id)}>
                {task.title}
              </span>
              <Stack direction="horizontal" gap={2}>
                <Form.Check type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'} />
                <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
                <Button variant="outline-danger" size="sm" onClick={handleShowModal}>Eliminar</Button>
              </Stack>
            </div>

            <div className="mt-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              {task.dueDate && (
                <div className="fw-bold text-danger">
                  Vencimiento: {formatChileanDate(task.dueDate)}
                </div>
              )}
              <div>
                <strong>Creación:</strong> {formatChileanDateTime(task.createdAt)}
              </div>
              {task.completed && task.completedAt && (
                <>
                  <div>
                    <strong>Término:</strong> {formatChileanDateTime(task.completedAt)}
                  </div>
                  <div className="mt-1 fst-italic">
                    {calculateDuration()}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </ListGroup.Item>

      <Modal show={showConfirmModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar la tarea: <strong>"{task.title}"</strong>?
          <br/>
          <span className="text-danger">Esta acción no se puede deshacer.</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskItem;