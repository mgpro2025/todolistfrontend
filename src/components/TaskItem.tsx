// src/components/TaskItem.tsx
import { useState } from 'react';
// 1. IMPORTAMOS el componente Modal de react-bootstrap
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
  
  // 2. AÑADIMOS un nuevo estado para controlar la visibilidad del modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- Funciones para el modo de edición (no cambian) ---
  const handleSave = () => {
    if (editedTitle.trim() === '') return;
    onEdit(task.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  // --- 3. NUEVAS FUNCIONES para manejar el modal de confirmación ---
  const handleShowModal = () => setShowConfirmModal(true);
  const handleCloseModal = () => setShowConfirmModal(false);

  const handleConfirmDelete = () => {
    onDelete(task.id); // Llama a la función de borrado original
    handleCloseModal(); // Cierra el modal después de borrar
  };


  // --- Funciones de formato y cálculo (no cambian) ---
  const formatChileanDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'America/Santiago'
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
    <> {/* Usamos un fragmento <>...</> para poder renderizar el Modal junto al ListGroup.Item */}
      <ListGroup.Item
        variant={task.completed ? 'light' : ''}
        className="d-flex justify-content-between align-items-center"
      >
        {isEditing ? (
          // ... VISTA DE EDICIÓN (no cambia) ...
          <Stack direction="horizontal" gap={2} className="w-100">
            <FormControl value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} autoFocus />
            <Button variant="success" size="sm" onClick={handleSave}>Guardar</Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
          </Stack>
        ) : (
          // VISTA NORMAL
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontWeight: 650, textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'grey' : 'black', cursor: 'pointer' }} onClick={() => onToggleComplete(task.id)}>
                {task.title}
              </span>
              <Stack direction="horizontal" gap={2}>
                <Form.Check type="checkbox" checked={task.completed} onChange={() => onToggleComplete(task.id)} title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'} />
                <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>Editar</Button>
                {/* 4. CAMBIAMOS el onClick del botón Eliminar */}
                <Button variant="outline-danger" size="sm" onClick={handleShowModal}>Eliminar</Button>
              </Stack>
            </div>
            <div className="mt-2" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <div><strong>Fecha de creación:</strong> {formatChileanDate(task.createdAt)}</div>
              {task.completed && task.completedAt && (
                <>
                  <div><strong>Fecha de término:</strong> {formatChileanDate(task.completedAt)}</div>
                  <div className="mt-1 fst-italic">{calculateDuration()}</div>
                </>
              )}
            </div>
          </div>
        )}
      </ListGroup.Item>

      {/* 5. AÑADIMOS el componente Modal. Solo se mostrará si showConfirmModal es true */}
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