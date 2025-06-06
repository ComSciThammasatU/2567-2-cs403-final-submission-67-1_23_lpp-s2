import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa'; // ใช้ React Icons สำหรับดาว
import './RatingPopup.css';

const EventRatingPopup = ({ eventId, username, token, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0); // คะแนน
  const [comment, setComment] = useState(''); // ความคิดเห็น
  const [submitted, setSubmitted] = useState(false); // เช็คว่าผู้ใช้ได้ให้คะแนนแล้ว
  const [formUrl, setFormUrl] = useState(''); // ลิงก์สำหรับแบบสอบถาม

  const baseURL = 'http://localhost:4000';

  // ฟังก์ชันสำหรับส่งคะแนน
  const handleSubmit = async () => {
    try {
      console.log("🧾 Sending rating:", { username, rating, comment });

      const res = await axios.post(
        `${baseURL}/api/rates/${eventId}/rate`,
        {
          username, // ต้องเป็น string
          rating,   // ต้องเป็น number (1–5)
          comment,  // optional
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ดึงลิงก์ Google Form จากกิจกรรม
      const eventRes = await axios.get(`http://localhost:4000/api/events/event/${eventId}`);
      const evaluationUrl = eventRes.data.evaluationFormUrl;

      setFormUrl(evaluationUrl);
      setSubmitted(true);
      onSuccess(); // เพื่อให้ parent รับรู้ว่าให้คะแนนแล้ว
    } catch (error) {
      console.error("ให้คะแนนไม่สำเร็จ:", error);
      alert('เกิดข้อผิดพลาดในการให้คะแนน');
    }
  };

  // ฟังก์ชันสำหรับการเลือกดาว
  const handleStarClick = (ratingValue) => {
    setRating(ratingValue); // อัปเดตคะแนนที่ผู้ใช้เลือก
  };

  return (
    <div className="RatingPopup-overlay">
      <div className="RatingPopup-box">
        <h3>ให้คะแนนกิจกรรม</h3>

        {submitted ? (
          <>
            <p>✅ ขอบคุณที่ให้คะแนนกิจกรรมแล้ว!</p>
            {formUrl && (
              <a href={formUrl} target="_blank" rel="noopener noreferrer" className="RatingPopup-button-orange">
                👉 ไปทำแบบสอบถาม
              </a>
            )}
            <button className="popup-close-btn" onClick={onClose}>ปิด</button>
          </>
        ) : (
          <>
            <div className="RatingPopup-star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="star"
                >
                  {rating >= star ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>

            <label>ความคิดเห็นเพิ่มเติม (หากมี)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="RatingPopup-popup-buttons">
              <button onClick={handleSubmit} disabled={rating === 0}>ส่งคะแนน</button>
              <button onClick={onClose}>ยกเลิก</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventRatingPopup;
