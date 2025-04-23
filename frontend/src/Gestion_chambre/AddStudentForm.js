// AddStudentForm.js
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const AddStudentForm = ({ show, handleClose, onAddStudent, rooms }) => {
  const [name, setName] = useState("");
  const [filiere, setFiliere] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRoom = rooms.find((room) => room.id === parseInt(roomId));
    if (selectedRoom && selectedRoom.students.length >= selectedRoom.capacity) {
      setError("Cette chambre est déjà occupée.");
      return;
    }

    onAddStudent({ name, filiere, roomId: parseInt(roomId) });
    setName("");
    setFiliere("");
    setRoomId("");
    setError("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: '#4a5568' }}>Ajouter un Stagiaire</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: '#4a5568' }}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom du stagiaire</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Filière</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez la filière"
              value={filiere}
              onChange={(e) => setFiliere(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sélectionner une chambre</Form.Label>
            <Form.Select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              <option value="">-- Choisissez une chambre --</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Chambre {room.id} ({room.students.length}/{room.capacity})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button 
            type="submit"
            style={{ backgroundColor: '#4a5568', borderColor: '#4a5568' }}
          >
            Ajouter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddStudentForm;