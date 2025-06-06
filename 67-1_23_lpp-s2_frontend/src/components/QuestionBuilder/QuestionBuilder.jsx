// components/QuestionBuilder.jsx
import React, { useState } from "react";
import './QuestionBuilder.css'

const QuestionBuilder = ({ formQuestions, setFormQuestions }) => {
  const [question, setQuestion] = useState({
    questionText: "",
    questionType: "text",
    options: [],
    required: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestion({ ...question, [name]: type === "checkbox" ? checked : value });
  };

  const handleOptionChange = (i, value) => {
    const updated = [...question.options];
    updated[i] = value;
    setQuestion({ ...question, options: updated });
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ""] });
  };

  const addQuestion = () => {
    if (!question.questionText) return alert("กรุณากรอกคำถาม");
    setFormQuestions([...formQuestions, { ...question, _id: Date.now().toString() }]);
    setQuestion({
      questionText: "",
      questionType: "text",
      options: [],
      required: false,
    });
  };

  return (
    <div className="question-builder">
        <label style={{ fontWeight: 'bold' }}>เพิ่มคำถามสำหรับผู้ลงทะเบียน</label>
        <input
        type="text"
        placeholder="คำถาม"
        name="questionText"
        value={question.questionText}
        onChange={handleChange}
      />
      
      <label>กรุณาประเภทของคำตอบ</label>
      <select name="questionType" value={question.questionType} onChange={handleChange}>
        <option value="text">Text</option>
        <option value="multipleChoice">Multiple Choice</option>
        <option value="checkbox">Checkbox</option>
        <option value="dropdown">Dropdown</option>
      </select>
      {(question.questionType !== "text") &&
        question.options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`ตัวเลือกที่ ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
          />
        ))}
      {(question.questionType !== "text") && (
        <button type="button" onClick={addOption}>+ เพิ่มตัวเลือก</button>
      )}
      
      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input type="checkbox"
          name="required"
          checked={question.required}
          onChange={handleChange}
          style={{ width: '18px', height: '18px', margin: 0 }}  // ลดขนาด checkbox และ margin
        />
        <span style={{ fontSize: '16px', color: '#333', margin: 0 }}>จำเป็นต้องตอบ</span>  {/* ลด margin ของข้อความ */}
      </label>


      <button type="button" onClick={addQuestion} className="add-question-button">
  ➕ เพิ่มคำถามนี้
</button>



      <ul>
        {formQuestions.map((q, idx) => (
          <li key={idx}>{q.questionText} ({q.questionType})</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionBuilder;
