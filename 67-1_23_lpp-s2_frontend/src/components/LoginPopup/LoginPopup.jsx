import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../Context/AuthContext';
import Swal from 'sweetalert2'; // ✅ เพิ่มตรงนี้

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [UserName, setUserName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [accepted, setAccepted] = useState(false);
  const baseURL = 'http://localhost:4000';

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!accepted) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาตรวจสอบข้อมูลหรือยอมรับข้อตกลงก่อนเข้าสู่ระบบ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/users/login`, {
        UserName,
        PassWord,
      });

      console.log("✅ Login success:", response.data);
      login(response.data.token, response.data.payload.user.username);
      setShowLogin(false);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className='login-popup'>
      <div className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        <div className="login-popup-inputs">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้ (TU Reg account)"
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน (TU Reg account) "
            value={PassWord}
            onChange={(e) => setPassWord(e.target.value)}
          />
        </div>

        <div className="login-popup-condition">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            id="acceptTerms"
          />
          <label htmlFor="acceptTerms">
            ยอมรับข้อกำหนดการใช้งานและนโยบาย<br />ความเป็นส่วนตัว
          </label>
        </div>

        <button onClick={handleLogin}>
          {currState === "Login" ? "Login" : "Create account"}
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
