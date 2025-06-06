import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // ปิด dropdown ถ้าคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <img
        src="/profile-icon.svg" // เปลี่ยนเป็น icon จริงที่คุณมี
        alt="profile"
        className="profile-icon"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="dropdown-menu">
          <Link to="/history">ประวัติการเข้าชม</Link>
          <Link to="/my-events">งานกิจกรรมที่สร้าง</Link>
          <Link to="/registered-events">งานกิจกรรมที่ลงทะเบียน</Link>
          <Link to="/edit-profile">แก้ไขข้อมูลส่วนตัว</Link>
          <button onClick={onLogout}>ออกจากระบบ</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;