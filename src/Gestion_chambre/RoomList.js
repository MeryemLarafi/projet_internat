// RoomList.js
import React from "react";
import RoomCard from "./RoomCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const RoomList = ({ rooms, onDelete, onAdd, onDragStart, onDrop, searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container" style={{ color: '#4a5568', padding: '20px' }}>
      <div className="text-center my-3">
        <div 
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '350px',
            marginBottom: '20px'
          }}
        >
          <input
            type="text"
            placeholder="Rechercher un stagiaire..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '12px 40px 12px 15px',
              borderRadius: '25px',
              border: 'none',
              backgroundColor: '#F3F4F6',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.05)',
              fontSize: '1rem',
              color: '#4a5568',
              transition: 'all 0.3s ease',
              outline: 'none',
              ':focus': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                backgroundColor: 'white'
              }
            }}
          />
          <FontAwesomeIcon 
            icon={faSearch}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#4a5568',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <button 
            className="btn" 
            onClick={onAdd}
            style={{ 
              backgroundColor: '#4a5568', 
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px'
            }}
          >
            + Ajouter un Stagiaire
          </button>
        </div>
      </div>
      
      <h3 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
        Premier Étage
      </h3>
      <div className="row" style={{ perspective: '1000px' }}>
        {rooms.firstFloor.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <RoomCard 
              room={room} 
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
              searchQuery={searchQuery}
            />
          </div>
        ))}
      </div>

      <h3 className="text-center mb-4" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
        Deuxième Étage
      </h3>
      <div className="row" style={{ perspective: '1000px' }}>
        {rooms.secondFloor.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <RoomCard 
              room={room} 
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
              searchQuery={searchQuery}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;