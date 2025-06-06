import React, { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header/Header';
import EventDisplay from '../../components/EventDisplay/EventDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import { AuthContext } from '../../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const Home = () => {
  const [category, setCategory] = useState("All");
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchSoonEvents = async () => {
      if (!user || !token) return;

      try {
        const res = await axios.get(`http://localhost:4000/api/registers/registered-events/${user.username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const now = dayjs();
        
        const eventsWithNames = await Promise.all(
          res.data.map(async (reg) => {
            try {
              const eventRes = await axios.get(`http://localhost:4000/api/events/event/${reg.eventId}`);
              console.log("event detail fetched:", eventRes.data); // ✅ ตรวจสอบว่ามีค่า eventName, eventDate
        
              return {
                ...reg,
                eventName: eventRes.data.eventName,
                eventDate: eventRes.data.eventDate,
              };
            } catch (error) {
              console.warn("❌ ไม่พบกิจกรรม", reg.eventId, error);
              return {
                ...reg,
                eventName: 'ไม่พบกิจกรรม',
                eventDate: null,
              };
            }
          })
        );
        
        
        console.log("🔍 eventsWithNames:", eventsWithNames);

        
        const soonEvents = eventsWithNames.filter(ev => {
          const diff = dayjs(ev.eventDate).diff(now, 'hour');
          console.log(`📆 checking ${ev.eventName}: diff = ${diff}`);
          return diff <= 24 && diff >= 0;
        });
        
        

        if (soonEvents.length > 0) {
          Swal.fire({
            icon: 'info',
            title: '🔔 กิจกรรมใกล้เริ่ม!',
            html: `
              <div style="text-align: center;">
                ${soonEvents.map(ev => `
                  <div style="margin-bottom: 10px;">
                    <strong>${ev.eventName}</strong><br/>
                    <span style="color: gray;">${dayjs(ev.eventDate).format('DD/MM/YYYY HH:mm')} น.</span>
                  </div>
                `).join('')}
              </div>
            `,
            confirmButtonText: 'ไปยังกิจกรรมของฉัน',
            showCancelButton: true,
            cancelButtonText: 'ปิด',
            allowOutsideClick: false,
          }).then(result => {
            if (result.isConfirmed) {
              window.location.href = "/registered-events";
            }
          });
        }
      } catch (err) {
        console.error("⚠️ ไม่สามารถโหลดกิจกรรม:", err);
      }
    };

    fetchSoonEvents();
  }, [user, token]);

  return (
    <>
      <Header />
      <ExploreMenu setCategory={setCategory} category={category} />
      <EventDisplay category={category} />
      <AppDownload />
    </>
  );
};

export default Home;
