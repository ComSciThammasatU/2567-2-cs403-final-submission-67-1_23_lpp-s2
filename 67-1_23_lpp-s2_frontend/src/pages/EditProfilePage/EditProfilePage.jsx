import React, { useState, useEffect } from 'react';
import './EditProfilePage.css';

const EditProfilePage = () => {
  // กำหนด state สำหรับข้อมูลส่วนตัว
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    birthDate: "",
    nationality: "",
    email: "",
    phoneNumber: "",
    foodPreference: "",
    gender: "",
  });

  // เมื่อโหลดหน้าให้เช็คและดึงข้อมูลจาก localStorage หากมี
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("profileData"));
    if (savedData) {
      setProfileData(savedData); // โหลดข้อมูลจาก localStorage
    }
  }, []);

  // ฟังก์ชันสำหรับการอัปเดตข้อมูลใน state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  // ฟังก์ชันสำหรับบันทึกข้อมูลลงใน localStorage
  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
    alert("ข้อมูลถูกบันทึกเรียบร้อย!");
  };

  return (
    <div className="edit-profile">
      <h2>แก้ไขข้อมูลส่วนตัว</h2>

      <div className="profile-form">
        <label>ชื่อจริง</label>
        <input
          type="text"
          name="firstName"
          value={profileData.firstName}
          onChange={handleChange}
        />

        <label>นามสกุล</label>
        <input
          type="text"
          name="lastName"
          value={profileData.lastName}
          onChange={handleChange}
        />

        <label>รหัสนักศึกษา</label>
        <input
          type="text"
          name="studentId"
          value={profileData.studentId}
          onChange={handleChange}
        />

        <label>วันเกิด</label>
        <input
          type="date"
          name="birthDate"
          value={profileData.birthDate}
          onChange={handleChange}
        />

        <label>สัญชาติ</label>
        <input
          type="text"
          name="nationality"
          value={profileData.nationality}
          onChange={handleChange}
        />

        <label>อีเมล์</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
        />

        <label>เบอร์โทร</label>
        <input
          type="text"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={handleChange}
        />

        <label>อาหารที่แพ้</label>
        <input
          type="text"
          name="foodPreference"
          value={profileData.foodPreference}
          onChange={handleChange}
        />

        <label>เพศ</label>
        <div>
          <input
            type="radio"
            name="gender"
            value="ชาย"
            checked={profileData.gender === "ชาย"}
            onChange={handleChange}
          />
          <label>ชาย</label>
          <input
            type="radio"
            name="gender"
            value="หญิง"
            checked={profileData.gender === "หญิง"}
            onChange={handleChange}
          />
          <label>หญิง</label>
          <input
            type="radio"
            name="gender"
            value="ไม่ระบุ"
            checked={profileData.gender === "ไม่ระบุ"}
            onChange={handleChange}
          />
          <label>ไม่ระบุ</label>
        </div>

        <button onClick={handleSave}>บันทึกข้อมูล</button>
      </div>
    </div>
  );
};

export default EditProfilePage;
