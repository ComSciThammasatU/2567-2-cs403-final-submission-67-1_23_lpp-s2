import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import './ScanTicket.css'; // ✅ CSS แยกต่างหาก

const ScanTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [ticketId, setTicketId] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [hasScanned, setHasScanned] = useState(false);
  const baseURL = 'http://localhost:4000';

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const scanner = scannerRef.current;
        if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
          await scanner.stop();
        }
        await scanner.clear();
      } catch (e) {
        console.warn("⚠️ Error stopping scanner:", e);
      }
    }
  };

  const qrCodeSuccessCallback = async (decodedText) => {
    if (hasScanned) return;
    setHasScanned(true);

    try {
      const response = await axios.post(`${baseURL}/api/registers/verify-ticket`, {
        ticketID: decodedText,
      });

      const ticket = response.data.ticket;
      const ticketEventId = ticket.eventId;
      const status = ticket.ticketStatus;

      setTicketId(decodedText);
      setTicketStatus(status);

      if (ticketEventId !== eventId) {
        Swal.fire({
          icon: 'error',
          title: 'บัตรไม่ตรงกับกิจกรรมนี้',
          text: 'กรุณาตรวจสอบบัตรอีกครั้ง',
        });
        resetState();
        return;
      }

      await stopScanner();

      if (status === 'inactive') {
        Swal.fire({
          icon: 'warning',
          title: 'บัตรยังไม่เปิดใช้งาน',
          text: 'กรุณาเปิดใช้งานบัตรก่อน',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'ตรวจสอบบัตรสำเร็จ!',
          text: `สถานะ: ${status}`,
        });
      }

    } catch (error) {
      console.error("❌ Error verifying ticket:", error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.error || 'ไม่สามารถตรวจสอบบัตรได้',
      });
    }
  };

  const resetState = () => {
    setTicketId(null);
    setTicketStatus(null);
    setHasScanned(false);
  };

  const handleMarkAsUsed = async () => {
    try {
      await axios.put(`${baseURL}/api/registers/mark-ticket-used`, {
        ticketID: ticketId,
      });

      Swal.fire({
        icon: 'success',
        title: 'บัตรถูกใช้งานแล้ว',
        text: 'ขอบคุณที่เข้าร่วมกิจกรรม',
        confirmButtonText: 'ตกลง',
        allowOutsideClick: false,
      }).then(() => {
        navigate('/my-events');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเปลี่ยนสถานะบัตรได้',
      });
    }
  };

  const handleCancel = () => {
    resetState();
    navigate('/my-events');
  };

  useEffect(() => {
    let isMounted = true;

    const checkCameraPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        return true;
      } catch {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเข้าถึงกล้องได้', 'error');
        return false;
      }
    };

    const startScanner = async () => {
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) return;

      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 540, height: 470 } },
          qrCodeSuccessCallback
        );
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเริ่มกล้องได้',
          text: 'ตรวจสอบอุปกรณ์หรือเบราว์เซอร์อีกครั้ง',
        });
      }
    };

    startScanner();
    return () => {
      isMounted = false;
      stopScanner();
    };
  }, []);

  return (
    <div className="scan-container">
      <h2 className="scan-title">สแกนบัตรเข้างาน</h2>

      {!ticketId && (
        <div id="reader" className="ScanTicket-qr-reader" />
      )}

      {ticketId && (
        <div className="ticket-info-box">
          <p>🎟️ Ticket ID: <strong>{ticketId}</strong></p>
          <p>🔐 สถานะบัตร: 
            <span className={`badge ${ticketStatus}`}> {ticketStatus}</span>
          </p>

          <div className="button-group">
            {ticketStatus === 'active' && (
              <button onClick={handleMarkAsUsed} className="btn btn-green">
                ✅ ใช้บัตร
              </button>
            )}
            <button onClick={handleCancel} className="btn btn-gray">
              ❌ ออก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanTicket;
