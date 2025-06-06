import React from "react";
import "./Header.css";
import { assets } from "../../assets/assets"; // ✅ ดึงรูปจาก assets.js

const Header = () => {
  return (
    <div
      className="header"
      style={{
        backgroundImage: `url(${assets.header_img})`, // ✅ ใช้ assets.headerBg
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="header-overlay" />
      <div className="header-contents">
        <h1>✨Enjoy Your Life at Thammasat✨</h1>
        <p>
            เข้าร่วมกิจกรรมที่น่าทึ่งและสร้างประสบการณ์ที่ไม่ลืมกับเพื่อน ๆ ได้ที่มหาวิทยาลัยธรรมศาสตร์
        </p>
        <a href="#food-display" className="header-button">
          ดูกิจกรรม!
        </a>
      </div>
    </div>
  );
};

export default Header;