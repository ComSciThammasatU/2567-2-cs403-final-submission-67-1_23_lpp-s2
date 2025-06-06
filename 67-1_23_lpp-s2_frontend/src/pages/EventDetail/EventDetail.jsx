import './EventDetail.css';
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../../Context/AuthContext';
import PopupConfirm from '../../components/PopupConfirm/PopupConfirm';
import PopupQuestion from '../../components/PopupQuestion/PopupQuestion';

const EventDetail = () => {
  const { eventId } = useParams(); // รับ eventId จาก URL
  const { user } = useContext(AuthContext); // ดึงข้อมูลผู้ใช้จาก context
  const [event, setEvent] = useState(null); // สถานะของข้อมูลกิจกรรม
  const [showConfirm, setShowConfirm] = useState(false); // สถานะของ PopupConfirm
  const [showQuestion, setShowQuestion] = useState(false); // สถานะของ PopupQuestion

  const baseURL = 'http://localhost:4000';

  // ดึงข้อมูลกิจกรรมจาก backend
  useEffect(() => {
    axios.get(`${baseURL}/api/events/event/${eventId}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [eventId]);

  const handleRegisterClick = () => {
    // หากกิจกรรมมีคำถามในฟอร์ม (formQuestions), แสดง PopupQuestion
    if (event.formQuestions && event.formQuestions.length > 0) {
      setShowQuestion(true);
    } else {
      // หากไม่มีคำถาม, แสดง PopupConfirm
      setShowConfirm(true);
    }
  };

  if (!event) return <p>กำลังโหลดกิจกรรม...</p>;

  return (
    <div className="event-detail-page">
      <div className="event-card">
        <img src={`${baseURL}/images/${event.image}`} alt={event.eventName} className="event-detail-img" />
        <div className="event-details">
          <h2>{event.eventName}</h2>
          <p><b>วันที่:</b> {new Date(event.eventDate).toLocaleDateString()}</p>
          <p><b>สถานที่:</b> {event.location}</p>
          <p><b>จัดโดย:</b> {event.organizer}</p>
          <p><b>หมวดหมู่:</b> {event.category}</p>
          <p><b>คำอธิบาย:</b> {event.eventDescription}</p>
          <p><b>เปิดรับคณะ:</b> {event.facultyAccepted?.join(", ") || "ทุกคณะ"}</p>

          {/* ปุ่มลงทะเบียน */}
          {user && (
            <button className="register-button" onClick={handleRegisterClick}>
              ลงทะเบียนเข้าร่วมกิจกรรม
            </button>
          )}

          {/* Popup สำหรับกรอกคำถาม */}
          {showQuestion && (
            <PopupQuestion eventId={eventId} formQuestions={event.formQuestions} onClose={() => setShowQuestion(false)} />
          )}

          {/* Popup ยืนยันแบบไม่มีคำถาม */}
          {showConfirm && (
            <PopupConfirm eventId={eventId} onClose={() => setShowConfirm(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
