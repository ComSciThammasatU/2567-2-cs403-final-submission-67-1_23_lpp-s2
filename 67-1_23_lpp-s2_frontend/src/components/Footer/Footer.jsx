import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>มหาวิทยาลัยธรรมศาสตร์ ศูนย์รังสิต ตำบลคลองหนึ่ง อำเภอคลองหลวง จังหวัดปทุมธานี 12120</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
          
            <ul>
                <li></li>
                <li></li>
                
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>ช่องทางการติดต่อ</h2>
            <ul>
                <li>0834567890</li>
                <li>TuEvent@dome.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">@TuEvent 2024 Version 1.0.0</p>
    </div>
  )
}

export default Footer
