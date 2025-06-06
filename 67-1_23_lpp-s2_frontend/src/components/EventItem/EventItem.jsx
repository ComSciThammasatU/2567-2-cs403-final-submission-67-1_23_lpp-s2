
import { useState, useEffect } from 'react'; 
import axios from 'axios';                   
import React, { useContext } from 'react';
import './EventItem.css'; 
import { assets } from '../../assets/assets'; 
import { StoreContext } from '../../Context/StoreContext';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from "react-router-dom";



const EventItem = ({ id, image, name, desc, date, location }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/event/${id}`);
  };

  return (
    <div className='food-item'>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={image} alt="" />
      </div>

      <div className="food-item-info">
        <p>{name}</p>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-desc"><b>📍</b> {location}</p>
        <p className="food-item-desc"><b>🗓️</b> {new Date(date).toLocaleDateString()}</p>


        <button
          className="register-button"
          onClick={handleViewDetail}
        >
          แสดงรายละเอียด
        </button>
      </div>
    </div>
  );
};

export default EventItem;