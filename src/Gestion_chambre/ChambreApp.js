import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import RoomList from './RoomList';
import AddStudentForm from './AddStudentForm';
import "bootstrap/dist/css/bootstrap.min.css";
import './ChambreApp.css';

const ChambreApp = () => {
  const location = useLocation();
  console.log('Current path:', location.pathname);

  const [roomsFilles, setRoomsFilles] = useState({
    firstFloor: [
      { id: 4, capacity: 4, students: [] },
      { id: 5, capacity: 4, students: [] },
      { id: 6, capacity: 4, students: [] },
      { id: 7, capacity: 4, students: [] },
      { id: 8, capacity: 4, students: [] },
      { id: 9, capacity: 4, students: [] },
    ],
    secondFloor: [
      { id: 10, capacity: 4, students: [] },
      { id: 11, capacity: 4, students: [] },
      { id: 12, capacity: 4, students: [] },
      { id: 13, capacity: 4, students: [] },
      { id: 14, capacity: 4, students: [] },
      { id: 15, capacity: 4, students: [] },
    ]
  });

  const [roomsGarcons, setRoomsGarcons] = useState({
    firstFloor: [
      { id: 4, capacity: 4, students: [] },
      { id: 5, capacity: 4, students: [] },
      { id: 6, capacity: 4, students: [] },
      { id: 7, capacity: 4, students: [] },
      { id: 8, capacity: 4, students: [] },
      { id: 9, capacity: 4, students: [] },
    ],
    secondFloor: [
      { id: 10, capacity: 4, students: [] },
      { id: 11, capacity: 4, students: [] },
      { id: 12, capacity: 4, students: [] },
      { id: 13, capacity: 4, students: [] },
      { id: 14, capacity: 4, students: [] },
      { id: 15, capacity: 4, students: [] },
    ]
  });

  const [showForm, setShowForm] = useState(false);
  const [draggedStudent, setDraggedStudent] = useState(null);
  const [activeSection, setActiveSection] = useState('filles');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStudent = (newStudent) => {
    const setRooms = activeSection === 'filles' ? setRoomsFilles : setRoomsGarcons;
    setRooms((prevRooms) => ({
      firstFloor: prevRooms.firstFloor.map((room) =>
        room.id === newStudent.roomId
          ? { ...room, students: [...room.students, `${newStudent.name} (${newStudent.filiere})`] }
          : room
      ),
      secondFloor: prevRooms.secondFloor.map((room) =>
        room.id === newStudent.roomId
          ? { ...room, students: [...room.students, `${newStudent.name} (${newStudent.filiere})`] }
          : room
      )
    }));
  };

  const handleDeleteStudent = (roomId, studentIndex) => {
    const setRooms = activeSection === 'filles' ? setRoomsFilles : setRoomsGarcons;
    setRooms((prevRooms) => ({
      firstFloor: prevRooms.firstFloor.map((room) =>
        room.id === roomId
          ? { ...room, students: room.students.filter((_, index) => index !== studentIndex) }
          : room
      ),
      secondFloor: prevRooms.secondFloor.map((room) =>
        room.id === roomId
          ? { ...room, students: room.students.filter((_, index) => index !== studentIndex) }
          : room
      )
    }));
  };

  const handleDragStart = (student, roomId, studentIndex) => {
    setDraggedStudent({ student, roomId, studentIndex });
  };

  const handleDrop = (targetRoomId) => {
    if (!draggedStudent) return;
    const setRooms = activeSection === 'filles' ? setRoomsFilles : setRoomsGarcons;
    const rooms = activeSection === 'filles' ? roomsFilles : roomsGarcons;

    const targetRoom = [...rooms.firstFloor, ...rooms.secondFloor].find(room => room.id === targetRoomId);
    if (targetRoom.students.length >= targetRoom.capacity) {
      alert("La chambre cible est pleine!");
      setDraggedStudent(null);
      return;
    }

    setRooms(prevRooms => {
      return {
        firstFloor: prevRooms.firstFloor.map(room => {
          if (room.id === draggedStudent.roomId) {
            return {
              ...room,
              students: room.students.filter((_, index) => index !== draggedStudent.studentIndex)
            };
          }
          if (room.id === targetRoomId) {
            return {
              ...room,
              students: [...room.students, draggedStudent.student]
            };
          }
          return room;
        }),
        secondFloor: prevRooms.secondFloor.map(room => {
          if (room.id === draggedStudent.roomId) {
            return {
              ...room,
              students: room.students.filter((_, index) => index !== draggedStudent.studentIndex)
            };
          }
          if (room.id === targetRoomId) {
            return {
              ...room,
              students: [...room.students, draggedStudent.student]
            };
          }
          return room;
        })
      };
    });
    setDraggedStudent(null);
  };

  const allRoomsFilles = [...roomsFilles.firstFloor, ...roomsFilles.secondFloor];
  const allRoomsGarcons = [...roomsGarcons.firstFloor, ...roomsGarcons.secondFloor];

  return (
    <div className="App">
      <h1>Gestion des Chambres</h1>
      <nav>
        <Link 
          to="/gestion-chambre/filles" 
          className="btn section-btn"
          onClick={() => setActiveSection('filles')}
        >
          Section Filles
        </Link>
        <Link 
          to="/gestion-chambre/garcons" 
          className="btn section-btn"
          onClick={() => setActiveSection('garcons')}
        >
          Section Garçons
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/gestion-chambre/filles" />} />
        <Route
          path="filles"
          element={
            <RoomList 
              rooms={roomsFilles} 
              onDelete={handleDeleteStudent} 
              onAdd={() => setShowForm(true)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
        />
        <Route
          path="garcons"
          element={
            <RoomList 
              rooms={roomsGarcons} 
              onDelete={handleDeleteStudent} 
              onAdd={() => setShowForm(true)}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          }
        />
      </Routes>

      <AddStudentForm
        show={showForm}
        handleClose={() => setShowForm(false)}
        onAddStudent={handleAddStudent}
        rooms={activeSection === 'filles' ? allRoomsFilles : allRoomsGarcons}
      />
    </div>
  );
};

export default ChambreApp;