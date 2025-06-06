import React, { useState, useEffect } from 'react'; 
import QRCode from 'qrcode';
import axios from 'axios';

const ShowQRCodePage = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [ticketId, setTicketId] = useState('');  // เก็บ ticketId ที่จะใช้สร้าง QR Code
  const [errorMessage, setErrorMessage] = useState(''); // เก็บข้อความข้อผิดพลาด

  const baseURL = 'http://localhost:4000';

  // ฟังก์ชันสำหรับสร้าง QR Code
  const generateQRCode = (data) => {
    QRCode.toDataURL(data, { width: 256, margin: 2 })
      .then((url) => {
        setQrCodeData(url); // เก็บ URL ของ QR Code ที่สร้างได้
        setErrorMessage(''); // ลบข้อความผิดพลาดหากสร้าง QR Code สำเร็จ
      })
      .catch((err) => {
        console.error('เกิดข้อผิดพลาดในการสร้าง QR Code:', err);
        setErrorMessage('ไม่สามารถสร้าง QR Code ได้');  // แสดงข้อความข้อผิดพลาด
      });
  };

  // ฟังก์ชันนี้จะใช้ดึงข้อมูล ticketId จาก backend
  const fetchTicketIdFromBackend = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/registers/${username}/${eventId}`
      );
      const fetchedTicketId = response.data.ticketId;  // รับ ticketId จาก backend
      setTicketId(fetchedTicketId);  // ตั้งค่า ticketId ที่ได้รับ
    } catch (error) {
      console.error('ไม่สามารถดึงข้อมูลจาก backend:', error);
      setErrorMessage('ไม่สามารถดึงข้อมูลจาก server');  // แสดงข้อความข้อผิดพลาด
    }
  };
  

  // เรียกใช้เมื่อ component โหลด
  useEffect(() => {
    fetchTicketIdFromBackend();  // ดึง ticketId จาก backend
  }, []);

  // สร้าง QR Code เมื่อ ticketId ถูกตั้งค่า
  useEffect(() => {
    if (ticketId) {
      generateQRCode(ticketId);  // เมื่อมี ticketId ให้สร้าง QR Code
    }
  }, [ticketId]);

  return (
    <div>
      <h3>บัตรเข้ากิจกรรม</h3>
      {qrCodeData ? (
        <div>
          <img src={qrCodeData} alt="QR Code" />
          <p>รหัส {ticketId}</p>
        </div>
      ) : (
        errorMessage ? <p>{errorMessage}</p> : <p>กำลังสร้าง QR Code...</p>  // แสดงข้อความข้อผิดพลาด
      )}
    </div>
  );
};

export default ShowQRCodePage;
