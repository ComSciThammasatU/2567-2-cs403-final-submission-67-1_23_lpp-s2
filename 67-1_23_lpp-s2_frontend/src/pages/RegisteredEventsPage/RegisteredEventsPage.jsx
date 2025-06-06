import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { AuthContext } from '../../Context/AuthContext';
import QRCodePopup from '../../components/QRCodePopup/QRCodePopup';
import RegisteredEventCard from '../../components/RegisteredEventCard/RegisteredEventCard';
import './RegisteredEventsPage.css'; // เพิ่มไฟล์ CSS

const RegisteredEventsPage = () => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

  const baseURL = 'http://localhost:4000'; 

  // โหลดกิจกรรมที่ลงทะเบียน
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/registers/registered-events/${user.username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching registered events:', err);
      }
    };

    if (user?.username) {
      fetchRegisteredEvents();
    }
  }, [user, token]);

  // 👉 แสดง QR Code และเปิดใช้งาน ticket
  const handleShowQRCode = async (eventId) => {
    try {
      setSelectedEventId(eventId);
      const res = await axios.get(`${baseURL}/api/registers/get-ticket-id/${user.username}/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ticketId = res.data.ticketId;
      setSelectedTicketId(ticketId);

      // 🔔 ทำให้ ticket active
      await axios.put(`${baseURL}/api/registers/activate-ticket`, { ticketID: ticketId });

      // สร้าง QR
      const url = await QRCode.toDataURL(ticketId);
      setQrCodeUrl(url);
      setShowQRCode(true);
    } catch (err) {
      console.error('ไม่สามารถแสดง QR Code ได้:', err);
    }
  };

  // ❌ ปิด QR popup และเปลี่ยนสถานะ ticket เป็น inactive
  const handleCloseQRCode = async () => {
    try {
      if (selectedTicketId) {
        await axios.put(`${baseURL}/api/registers/deactivate-ticket`, { ticketID: selectedTicketId });
      }
    } catch (error) {
      console.error('ไม่สามารถเปลี่ยนสถานะบัตรเป็น inactive:', error);
    } finally {
      setShowQRCode(false);
      setSelectedTicketId(null);
      setQrCodeUrl('');
    }
  };

  return (
    <div className="registered-events-page">
      <h2 className="events-heading">งานกิจกรรมที่คุณลงทะเบียน</h2>
      {events.length === 0 ? (
        <p className="no-events-text">คุณยังไม่ได้ลงทะเบียนกิจกรรมใด ๆ</p>
      ) : (
        events.map((event) => (
          <RegisteredEventCard
            key={event._id}
            eventId={event.eventId}
            registerDate={event.createdAt}
            onShowQRCode={handleShowQRCode}
          />
        ))
      )}

      {showQRCode && selectedTicketId && (
        <QRCodePopup
          ticketId={selectedTicketId}
          qrCodeUrl={qrCodeUrl}
          eventName={events.find(e => e.eventId === selectedEventId)?.eventName}
          onClose={handleCloseQRCode}
        />
      )}
    </div>
  );
};

export default RegisteredEventsPage;
