import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';
import QuestionBuilder from '../../components/QuestionBuilder/QuestionBuilder';
import './CreateActivity.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CreateActivity = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseURL = 'http://localhost:4000';

  useEffect(() => {
    if (!token || !user?.username) {
      Swal.fire({
        icon: 'warning',
        title: 'ยังไม่ได้เข้าสู่ระบบ',
        text: 'กรุณาเข้าสู่ระบบก่อนใช้งานหน้านี้',
      }).then(() => {
        navigate('/');
      });
    }
  }, [token, user, navigate]);

  const [form, setForm] = useState({
    eventName: '',
    category: 'concert',
    eventDescription: '',
    eventDate: '',
    location: '',
    organizer: '',
    maxRegistrants: 100,
    facultyAccepted: [],
    formQuestions: [],
    image: null,
  });

  const facultyOptions = [
    { value: 'ทั้งหมด', label: '🔘 เลือกทุกคณะ' },
    { value: 'คณะนิติศาสตร์', label: 'คณะนิติศาสตร์' },
    { value: 'คณะพาณิชยศาสตร์และการบัญชี', label: 'คณะพาณิชยศาสตร์และการบัญชี' },
    { value: 'คณะรัฐศาสตร์', label: 'คณะรัฐศาสตร์' },
    { value: 'คณะเศรษฐศาสตร์', label: 'คณะเศรษฐศาสตร์' },
    { value: 'คณะสังคมสงเคราะห์ศาสตร์', label: 'คณะสังคมสงเคราะห์ศาสตร์' },
    { value: 'คณะศิลปศาสตร์', label: 'คณะศิลปศาสตร์' },
    { value: 'คณะวารสารศาสตร์และสื่อสารมวลชน', label: 'คณะวารสารศาสตร์และสื่อสารมวลชน' },
    { value: 'คณะสังคมวิทยาและมานุษยวิทยา', label: 'คณะสังคมวิทยาและมานุษยวิทยา' },
    { value: 'คณะศิลปกรรมศาสตร์', label: 'คณะศิลปกรรมศาสตร์' },
    { value: 'วิทยาลัยนวัตกรรม', label: 'วิทยาลัยนวัตกรรม' },
    { value: 'วิทยาลัยสหวิทยาการ', label: 'วิทยาลัยสหวิทยาการ' },
    { value: 'วิทยาลัยนานาชาติปรีดี พนมยงค์', label: 'วิทยาลัยนานาชาติปรีดี พนมยงค์' },
    { value: 'วิทยาลัยพัฒนศาสตร์ ป๋วย อึ๊งภากรณ์', label: 'วิทยาลัยพัฒนศาสตร์ ป๋วย อึ๊งภากรณ์' },
    { value: 'คณะวิทยาการเรียนรู้และศึกษาศาสตร์', label: 'คณะวิทยาการเรียนรู้และศึกษาศาสตร์' },
    { value: 'คณะวิทยาศาสตร์และเทคโนโลยี', label: 'คณะวิทยาศาสตร์และเทคโนโลยี' },
    { value: 'สถาบันเทคโนโลยีนานาชาติสิรินธร', label: 'สถาบันเทคโนโลยีนานาชาติสิรินธร' },
    { value: 'คณะวิศวกรรมศาสตร์', label: 'คณะวิศวกรรมศาสตร์' },
    { value: 'คณะสถาปัตยกรรมศาสตร์และการผังเมือง', label: 'คณะสถาปัตยกรรมศาสตร์และการผังเมือง' },
    { value: 'คณะแพทยศาสตร์', label: 'คณะแพทยศาสตร์' },
    { value: 'คณะเภสัชศาสตร์', label: 'คณะเภสัชศาสตร์' },
    { value: 'คณะสหเวชศาสตร์', label: 'คณะสหเวชศาสตร์' },
    { value: 'คณะทันตแพทยศาสตร์', label: 'คณะทันตแพทยศาสตร์' },
    { value: 'คณะพยาบาลศาสตร์', label: 'คณะพยาบาลศาสตร์' },
    { value: 'คณะสาธารณสุขศาสตร์', label: 'คณะสาธารณสุขศาสตร์' },
    { value: 'วิทยาลัยแพทยศาสตร์นานาชาติจุฬาภรณ์', label: 'วิทยาลัยแพทยศาสตร์นานาชาติจุฬาภรณ์' },
    { value: 'วิทยาลัยโลกคดีศึกษา', label: 'วิทยาลัยโลกคดีศึกษา' },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'คุณยังไม่ได้เข้าสู่ระบบ',
        text: 'กรุณาเข้าสู่ระบบก่อนที่จะสร้างกิจกรรม',
      });
      return;
    }

    try {
      const formData = new FormData();
      const cleanQuestions = form.formQuestions.map(q => {
        const { _id, ...rest } = q;
        return rest;
      });

      formData.append('eventName', form.eventName);
      formData.append('category', form.category);
      formData.append('eventDescription', form.eventDescription);
      formData.append('eventDate', form.eventDate);
      formData.append('location', form.location);
      formData.append('organizer', form.organizer);
      formData.append('maxRegistrants', form.maxRegistrants);
      formData.append('facultyAccepted', JSON.stringify(form.facultyAccepted));
      formData.append('creatorUsername', user?.username || '');
      formData.append('formQuestions', JSON.stringify(cleanQuestions));
      formData.append('status', 'active');
      if (form.image) formData.append('image', form.image);

      await axios.post(`${baseURL}/api/events/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'สร้างกิจกรรมสำเร็จ!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        navigate('/home');
      });
    } catch (error) {
      console.error('❌ สร้างกิจกรรมไม่สำเร็จ:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างกิจกรรมได้',
      });
    }
  };

  return (
    <div className="create-activity">
      <h1>สร้างกิจกรรมของคุณ</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="eventName" placeholder="ชื่อกิจกรรม" value={form.eventName} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Concert">คอนเสิร์ต</option>
          <option value="Seminar">สัมนา</option>
          <option value="Exhibition">นิทรรศการ</option>
          <option value="Sport">กีฬา</option>
          <option value="Party">ปาร์ตี้</option>
          <option value="Charity">การกุศล</option>
          <option value="Workshop">เวิร์กชอป</option>
        </select>
        <textarea name="eventDescription" placeholder="รายละเอียดกิจกรรม" value={form.eventDescription} onChange={handleChange}></textarea>
        <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
        <input type="text" name="location" placeholder="สถานที่จัดกิจกรรม" value={form.location} onChange={handleChange} required />
        <input type="text" name="organizer" placeholder="ผู้จัดกิจกรรม" value={form.organizer} onChange={handleChange} required />
        <input type="number" name="maxRegistrants" value={form.maxRegistrants} onChange={handleChange} />
        <label style={{ fontWeight: 'bold' }}>กรุณาระบุคณะที่สามารถเข้าร่วมกิจกรรมได้</label>
        <Select
          isMulti
          options={facultyOptions}
          value={facultyOptions.filter(opt => form.facultyAccepted.includes(opt.value))}
          onChange={(selected) => {
            const selectedValues = selected.map(s => s.value);
            if (selectedValues.includes('ทั้งหมด')) {
              setForm({ ...form, facultyAccepted: facultyOptions.filter(opt => opt.value !== 'ทั้งหมด').map(opt => opt.value) });
            } else {
              setForm({ ...form, facultyAccepted: selectedValues });
            }
          }}
        />
        <input type="file" name="image" onChange={handleFileChange} />
        <QuestionBuilder formQuestions={form.formQuestions} setFormQuestions={(q) => setForm({ ...form, formQuestions: q })} />
        <button type="submit">สร้างกิจกรรม</button>
      </form>
    </div>
  );
};

export default CreateActivity;
