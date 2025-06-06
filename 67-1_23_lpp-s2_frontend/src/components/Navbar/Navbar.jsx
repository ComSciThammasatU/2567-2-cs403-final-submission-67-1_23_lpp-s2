import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext.jsx';
import { AuthContext } from '../../Context/AuthContext.jsx';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { getTotalCartAmount } = useContext(StoreContext);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="Logo" /></Link>

      <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
            หน้าหลัก
          </Link>
        </li>
        
        <li>
          <Link to="/create-activity" onClick={() => setMenu("create-activity")} className={menu === "create-activity" ? "active" : ""}>
            สร้างกิจกรรม
          </Link>
        </li>
      </ul>

      <div className="navbar-right">

        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="ค้นหากิจกรรม" 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />

          <Link to={`/search?query=${searchTerm}`}>
            <img src={assets.search_icon} alt="Search" className="search-icon" /> 
          </Link>
        </div>

        
        {user ? (
          <div className="profile-container">
            <div className="profile-icon" onClick={() => setShowProfileMenu(!showProfileMenu)}>
    👤
              {showProfileMenu && (
                <div className="profile-menu">
                  <Link to="/my-events">งานกิจกรรมที่สร้าง</Link>
                  <Link to="/registered-events">งานกิจกรรมที่ลงทะเบียน</Link>
                  <button className="mobile-only" onClick={logout}>ออกจากระบบ</button>
                </div>
              )}
            </div>
            <span className="username-label">{user.username}</span>
            <button className="logout-button" onClick={logout}>ออกจากระบบ</button>
            </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>เข้าสู่ระบบ</button>
        )}



      </div>
    </div>
  );
};

export default Navbar;