import React from 'react';
import './QRCodePopup.css'; // ใช้ CSS สำหรับการจัดการสไตล์

const QRCodePopup = ({ ticketId, qrCodeUrl, eventName, onClose }) => {
  return (
    <div className="qr-popup-overlay">
      <div className="qr-popup-box">
        {qrCodeUrl && (
          <>
            <div className="qr-image-container">
              <img src={qrCodeUrl} alt="QR Code" className="qr-image" />
            </div>
            <div className="popup-event-info">
              <h3>{eventName}</h3>
              <p className="pass-id">PASS ID: {ticketId}</p>
            </div>
          </>
        )}
        <button className="popup-close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default QRCodePopup;
