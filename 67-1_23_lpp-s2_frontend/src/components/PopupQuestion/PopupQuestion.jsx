import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from '../../Context/AuthContext';
import './PopupQuestion.css';  // ใช้ CSS เฉพาะของ PopupQuestion
import Swal from 'sweetalert2';

const PopupQuestion = ({ eventId, formQuestions, onClose }) => {
  const { user, token } = useContext(AuthContext);
  const [answers, setAnswers] = useState({});
  const baseURL = 'http://localhost:4000';

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, option) => {
    const current = answers[questionId] || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    handleChange(questionId, updated);
  };

  const handleSubmit = async () => {
    if (!user?.username || !token) {
      Swal.fire({
        icon: 'warning',
        title: 'ยังไม่ได้เข้าสู่ระบบ',
        text: 'กรุณาเข้าสู่ระบบก่อนลงทะเบียน',
      });
      return;
    }
  
    console.log('📥 Registering:', {
      username: user.username,
      eventId,
      answers,
    });
  
    try {
      const formattedAnswers = formQuestions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id] || (q.questionType === "checkbox" ? [] : ""),
      }));
  
      await axios.post(`${baseURL}/api/registers/register`, {
        username: user.username,
        eventId,
        answers: formattedAnswers,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จแล้ว!',
        showConfirmButton: false,
        timer: 1500
      });
  
      onClose();
  
    } catch (err) {
      console.error("❌ Error submitting answers:", err);
  
      const errorMessage =
        err?.response?.data?.error || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง';
  
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
      });
    }
  };
  

  const renderQuestion = (q) => {
    switch (q.questionType) {
      case "text":
        return (
          <input
            type="text"
            required={q.required}
            onChange={(e) => handleChange(q._id, e.target.value)}
          />
        );

      case "multipleChoice":
        return q.options.map((option) => (
          <label key={option}>
            <input
              type="radio"
              name={q._id}
              value={option}
              checked={answers[q._id] === option}
              onChange={(e) => handleChange(q._id, e.target.value)}
              required={q.required}
            />
            {option}
          </label>
        ));

      case "checkbox":
        return q.options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              name={q._id}
              value={option}
              checked={(answers[q._id] || []).includes(option)}
              onChange={() => handleCheckboxChange(q._id, option)}
            />
            {option}
          </label>
        ));

      case "dropdown":
        return (
          <select
            value={answers[q._id] || ""}
            onChange={(e) => handleChange(q._id, e.target.value)}
            required={q.required}
          >
            <option value="">-- กรุณาเลือก --</option>
            {q.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      default:
        return <p>❌ ไม่รองรับประเภท: {q.questionType}</p>;
    }
  };

  return (
    <div className="PopupQuestion-overlay">
      <div className="PopupQuestion-box">
        <h3>กรุณาตอบคำถามก่อนลงทะเบียน</h3>

        {formQuestions.map((q) => (
          <div key={q._id} className="PopupQuestion-form">
            <p><b>{q.questionText}</b> {q.required && "*"}</p>
            {renderQuestion(q)}
          </div>
        ))}

        <div className="PopupQuestion-buttons">
          <button className="PopupQuestion-button" onClick={handleSubmit}>ส่งคำตอบ</button>
          <button className="PopupQuestion-cancel-button" onClick={onClose}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
};

export default PopupQuestion;
