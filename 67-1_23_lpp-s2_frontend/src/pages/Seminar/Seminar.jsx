import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { Link } from 'react-router-dom';
import './Seminar.css'; // สไตล์สำหรับ Seminar

const Seminar = () => {
  const { food_list } = useContext(StoreContext);

  // กรองข้อมูลกิจกรรมที่เป็นหมวด Seminar
  const seminarActivities = food_list.filter(item => item.food_category === "Seminar");

  return (
    <div className="seminar-page">
      <h1>Seminar Activities</h1>
      <div className="seminar-list">
        {seminarActivities.length > 0 ? (
          seminarActivities.map((item) => (
            <div key={item.food_id} className="seminar-item">
              <img src={item.food_image} alt={item.food_name} className="seminar-image" />
              <div className="seminar-info">
                <h3>{item.food_name}</h3>
                <p>{item.food_desc}</p>
                <p><strong>Price: </strong>{item.food_price} THB</p>
                <Link to={`/food/${item.food_id}`} className="view-details-link">View Details</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No seminar activities found.</p>
        )}
      </div>
    </div>
  );
};

export default Seminar;
