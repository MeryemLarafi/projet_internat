// RoomCard.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const RoomCard = ({ room, onDelete, onDragStart, onDrop, searchQuery }) => {
  const handleDeleteStudent = (index) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      onDelete(room.id, index);
    }
  };

  const handleDragStart = (student, index) => {
    onDragStart(student, room.id, index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    onDrop(room.id);
  };

  const isOccupied = room.students.length >= room.capacity;
  const hasMatch = searchQuery && room.students.some(student => 
    student.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="room-card"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        color: '#4a5568',
        borderRadius: '12px',
        backgroundColor: 'white',
        padding: '20px',
        margin: '15px',
        transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
        boxShadow: hasMatch 
          ? '0 10px 20px rgba(0, 255, 0, 0.3), 0 6px 6px rgba(0, 255, 0, 0.2)' 
          : '0 10px 20px rgba(0, 0, 0, 0.15), 0 6px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        borderLeft: `6px solid ${isOccupied ? '#EF4444' : '#E5E7EB'}`,
        ':hover': {
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-5px)',
          boxShadow: hasMatch 
            ? '0 15px 30px rgba(0, 255, 0, 0.4), 0 8px 8px rgba(0, 255, 0, 0.3)'
            : '0 15px 30px rgba(0, 0, 0, 0.2), 0 8px 8px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          backgroundColor: isOccupied ? '#EF4444' : '#E5E7EB',
          borderRadius: '12px 0 0 12px'
        }}
      />
      <h5 
        className="fw-bold text-center mb-3"
        style={{ 
          borderBottom: '1px solid #E5E7EB', 
          paddingBottom: '12px',
          fontSize: '1.25rem'
        }}
      >
        Chambre {room.id}
      </h5>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <p className="mb-0">
          <strong>Capacité:</strong> {room.capacity}
        </p>
        <p className="mb-0">
          <strong>Occupé:</strong> {room.students.length}
        </p>
      </div>
      <p className="mb-3 text-center">
        <strong>Status:</strong>
        <span 
          className={`ms-2 ${isOccupied ? "text-danger" : "text-success"} fw-bold`}
          style={{ fontSize: '1.1rem' }}
        >
          {isOccupied ? "Occupée" : "Disponible"}
        </span>
      </p>
      <div className="students-list">
        {room.students.map((student, index) => {
          const isSearched = searchQuery && student.toLowerCase().includes(searchQuery.toLowerCase());
          return (
            <div 
              key={index} 
              className="student-item d-flex justify-content-between align-items-center mb-2 p-2"
              draggable
              onDragStart={() => handleDragStart(student, index)}
              style={{
                backgroundColor: isSearched ? '#D1FAE5' : '#E5E7EB',
                borderRadius: '6px',
                cursor: 'grab',
                transition: 'transform 0.2s ease',
                ':hover': {
                  transform: 'translateX(5px)'
                }
              }}
            >
              <span 
                className="student-name" 
                style={{ 
                  fontSize: '0.95rem',
                  fontWeight: isSearched ? '600' : 'normal',
                  color: isSearched ? '#059669' : '#4a5568'
                }}
              >
                {student}
              </span>
              <span>
                <button 
                  className="btn p-0 border-0" 
                  onClick={() => handleDeleteStudent(index)}
                  style={{ color: '#dc143c' }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomCard;