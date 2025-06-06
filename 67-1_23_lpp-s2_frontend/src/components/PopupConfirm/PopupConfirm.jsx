import React, { useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../Context/AuthContext';
import './PopupConfirm.css';

const PopupConfirm = ({ eventId, onClose }) => {
  const { user, token } = useContext(AuthContext); // เพิ่ม token ด้วย
  const baseURL = 'http://localhost:4000';

  const handleConfirm = async () => {
    try {
      await axios.post(
        `${baseURL}/api/registers/register`,
        {
          username: user.username,
          eventId,
          answers: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน headers
          },
        }
      );

      alert("ลงทะเบียนสำเร็จแล้ว!");
      onClose();
    } catch (err) {
      console.error("Error registering:", err);
      alert("เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>ยืนยันการลงทะเบียน?</h3>
        <button onClick={handleConfirm}>ยืนยัน</button>
        <button onClick={onClose}>ยกเลิก</button>
      </div>
    </div>
  );
};

export default PopupConfirm;
