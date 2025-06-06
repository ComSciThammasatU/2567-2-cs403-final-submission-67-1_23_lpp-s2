import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import RatingPopup from '../RatingPopup/RatingPopup';
import './RegisteredEventCard.css'; // ✅ อย่าลืมสร้าง CSS

const RegisteredEventCard = ({ eventId, registerDate, onShowQRCode }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const { user, token } = useContext(AuthContext);

  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/events/event/${eventId}`);
        setEventDetails(res.data);
      } catch (error) {
        console.error('ไม่สามารถดึงรายละเอียดกิจกรรม:', error);
      }
    };

    const fetchUserRating = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/rates/${eventId}/rating/username/${user.username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data?.rating) setHasRated(true);
      } catch (error) {
        if (error.response?.status === 404) setHasRated(false);
        else console.error("เกิดข้อผิดพลาดในการตรวจสอบเรตติ้ง:", error);
      }
    };

    if (eventId && user?.username) {
      fetchEventDetails();
      fetchUserRating();
    }
  }, [eventId, user, token]);

  if (!eventDetails) return null;

  return (
    <div className={`event-card ${eventDetails.status}`}>
      <div className="event-card-left">
        <img
          src={`${baseURL}/images/${eventDetails.image}`}
          alt={eventDetails.eventName}
          className="event-img"
        />
      </div>
      <div className="event-card-right">
        <h3>{eventDetails.eventName}</h3>
        <p>
          ลงทะเบียนเมื่อ{' '}
          {new Date(registerDate).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p>
          สถานะกิจกรรม:{" "}
          <span className={`status-badge ${eventDetails.status}`}>
            {eventDetails.status === 'active' && 'เปิดรับลงทะเบียน'}
            {eventDetails.status === 'completed' && 'สิ้นสุดแล้ว'}
            {eventDetails.status === 'canceled' && 'ยกเลิก'}
          </span>
        </p>
        <div className="event-card-buttons">
          <Link to={`/event/${eventId}`} className="button button-white">
            ดูรายละเอียด
          </Link>
          <button onClick={() => onShowQRCode(eventId)} className="button button-dark">
            แสดงบัตร
          </button>
          {eventDetails.status === 'completed' && (
            hasRated ? (
              eventDetails.evaluationFormUrl && (
                <a
                  href={eventDetails.evaluationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-orange"
                >
                  ทำแบบสอบถามเพิ่มเติม
                </a>
              )
            ) : (
              <button
                onClick={() => setShowRatingPopup(true)}
                className="button button-orange"
              >
                ให้คะแนนกิจกรรม
              </button>
            )
          )}
        </div>
      </div>

      {showRatingPopup && (
        <RatingPopup
          eventId={eventId}
          username={user.username}
          token={token}
          onClose={() => setShowRatingPopup(false)}
          onSuccess={() => {
            setHasRated(true);
            setShowRatingPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default RegisteredEventCard;