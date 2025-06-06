import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './EventRatingsPage.css'; // ใช้ CSS ที่ปรับปรุงแล้ว

const EventRatingsPage = () => {
  const { eventId } = useParams();
  const { token } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [eventName, setEventName] = useState('');

  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [eventRes, ratingsRes] = await Promise.all([
          axios.get(`${baseURL}/api/events/event/${eventId}`),
          axios.get(`${baseURL}/api/rates/${eventId}/ratings`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
        ]);
        setEventName(eventRes.data.eventName);
        setRatings(ratingsRes.data.ratings);
      } catch (err) {
        console.error('Error loading event ratings:', err);
      }
    };

    if (token) fetchRatings();
  }, [eventId, token]);

  // ✅ คำนวณคะแนนเฉลี่ย
  const averageRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="event-ratings-page">
      <h2>รีวิวและคะแนนกิจกรรม</h2>
      <h3>กิจกรรม: {eventName}</h3>

      {/* ✅ แสดงคะแนนเฉลี่ย */}
      {averageRating && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
        <p className="average-rating">
          ⭐ คะแนนเฉลี่ย: <strong>{averageRating} / 5.0 </strong> ({ratings.length} คนให้คะแนน)
        </p>
      </div>
      )}

      {ratings.length === 0 ? (
        <p className="no-ratings">ยังไม่มีผู้ให้คะแนนกิจกรรมนี้</p>
      ) : (
        <ul className="rating-list">
          {ratings.map((rate) => (
            <li key={rate._id} className="rating-item">
              <strong>ผู้ใช้:</strong> {rate.username}<br />
              <div className="rating">
                <strong>คะแนน:</strong> {rate.rating} / 5
              </div>
              {rate.comment && (
                <div className="comment">
                  <strong>ความคิดเห็น:</strong> {rate.comment}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventRatingsPage;
