import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import './EventRegistrationsPage.css';

const EventRegistrationsPage = () => {
  const { eventId } = useParams();
  const { token } = useContext(AuthContext);
  const [eventInfo, setEventInfo] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [eventRes, regisRes] = await Promise.all([
          axios.get(`${baseURL}/api/events/event/${eventId}`),
          axios.get(`${baseURL}/api/registers/by-event/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setEventInfo(eventRes.data);
        setRegistrations(regisRes.data);
      } catch (err) {
        console.error("❌ Error loading registrations:", err);
      }
    };

    fetchData();
  }, [eventId, token]);

  const exportTableToCSV = () => {
    const table = document.querySelector('.registration-table');
    if (!table) return;
  
    const rows = Array.from(table.querySelectorAll('tr'));
    const csv = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const filteredCells = cells.filter((_, index) => index !== 1); // ตัดรูปภาพ
      return filteredCells.map(cell => `"${cell.innerText.replace(/"/g, '""')}"`).join(',');
    }).join('\n');
  
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
  
    const filename = eventInfo?.eventName
      ? `รายชื่อผู้เข้าร่วม_${eventInfo.eventName.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}.csv`
      : 'registrations.csv';
  
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  return (
    <div className="registrations-page">
      <h2>ข้อมูลผู้เข้าร่วมกิจกรรม</h2>
      {eventInfo && <h3>ชื่อกิจกรรม: {eventInfo.eventName}</h3>}

      {registrations.length > 0 && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <button onClick={exportTableToCSV} className="btn btn-outline-success">
            📤 ดาวน์โหลดรายชื่อ (CSV)
          </button>
        </div>
      )}

      {registrations.length === 0 ? (
        <p className="no-data">ยังไม่มีผู้เข้าร่วมกิจกรรม</p>
      ) : (
        <table className="registration-table">
          <thead>
            <tr>
              <th>#</th>
              <th>รูปภาพ</th>
              <th>ชื่อผู้ใช้</th>
              <th>คณะ</th>
              <th>สาขา</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
              <th>สถานะบัตร</th>
              <th>คำตอบแบบฟอร์ม</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((regis, index) => {
              const user = regis.user || {};
              return (
                <tr key={regis._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`${baseURL}/images/${user.image || 'default-avatar.png'}`}
                      alt="avatar"
                    />
                  </td>
                  <td>{user.displayname_th || regis.username}</td>
                  <td>{user.faculty || '-'}</td>
                  <td>{user.department || '-'}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`status-column ${regis.ticketStatus.toLowerCase()}`}>
                      {regis.ticketStatus}
                    </span>
                  </td>
                  <td>
                    <ul>
                      {regis.answers.map((ans, idx) => (
                        <li key={idx}>
                          <strong>Q{idx + 1}:</strong> {ans.answer}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventRegistrationsPage;
