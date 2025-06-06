import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import './MyEventsPage.css';

const MyEventsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState([]);

  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/events/user/${user.username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyEvents(res.data);
      } catch (err) {
        console.error('Error fetching my events:', err);
      }
    };

    if (user?.username) {
      fetchEvents();
    }
  }, [user]);

  const markEventAsCompleted = async (eventId) => {
    const evaluationFormUrl = prompt('กรุณาใส่ลิงก์แบบประเมินกิจกรรม (Google Form) ถ้ามี หรือปล่อยว่างไว้ได้');

    try {
      const res = await axios.put(
        `http://localhost:4000/api/events/update/${eventId}`,
        { status: 'completed', evaluationFormUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('เปลี่ยนสถานะกิจกรรมเป็นสิ้นสุดเรียบร้อย');
      setMyEvents((prev) =>
        prev.map((event) => (event._id === eventId ? res.data.event : event))
      );
    } catch (err) {
      console.error('Error marking event as completed:', err);
      alert('ไม่สามารถเปลี่ยนสถานะกิจกรรมได้');
    }
  };

  const statusOrder = { active: 0, completed: 1, canceled: 2 };
  const sortedEvents = [...myEvents].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  return (
    <div className="my-events-page">
      <h2>กิจกรรมที่สร้าง</h2>
      {sortedEvents.map((event) => (
        <div key={event._id} className={`event-card ${event.status}`}>
          <div className="event-card-left">
            <img src={`http://localhost:4000/images/${event.image}`} alt={event.eventName} className="event-img" />
          </div>
          <div className="event-card-right">
            <h3>{event.eventName}</h3>
            <p>สร้างกิจกรรมเมื่อ {new Date(event.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} เวลา {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>
              จำนวนผู้ลงทะเบียนเข้าร่วมกิจกรรม{' '}
              <span className="badge-green">
                {event.maxParticipants} คน
              </span>
            </p>
            <p>
              สถานะกิจกรรม: 
              <span className={`status-badge ${event.status}`}>
                {event.status === 'active' && 'กำลังเปิดลงทะเบียน'}
                {event.status === 'completed' && 'สิ้นสุดกิจกรรม'}
                {event.status === 'canceled' && 'กิจกรรมถูกยกเลิก'}
              </span>
            </p>
            <div className="event-card-buttons">
              <Link to={`/event/${event._id}`} className="button button-white">ดูรายละเอียด</Link>
              <Link to={`/scan-ticket/${event._id}`} className="button button-dark">ตรวจสอบบัตร</Link>
              <Link to={`/event-registrations/${event._id}`} className="button button-orange">ดูรายชื่อผู้เข้าร่วม</Link>

              {event.status === 'completed' ? (
                <Link to={`/event/${event._id}/ratings`} className="button button-green">
                  ดูคะแนนกิจกรรม
                </Link>
              ) : (
                <button
                  className="button button-red"
                  onClick={() => markEventAsCompleted(event._id)}
                >
                  สิ้นสุดกิจกรรม
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyEventsPage;