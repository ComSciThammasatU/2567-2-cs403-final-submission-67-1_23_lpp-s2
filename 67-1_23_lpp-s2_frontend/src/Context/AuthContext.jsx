import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUsername) {
      setUser({ username: storedUsername });
      setToken(storedToken);
    }
  }, []);

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setUser({ username });
    setToken(token);
    Swal.fire({
      icon: 'success',
      title: 'เข้าสู่ระบบสำเร็จ',
      text: `ยินดีต้อนรับ ${username} 🎉`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setToken(null);
    Swal.fire({
      icon: 'info',
      title: 'ออกจากระบบเรียบร้อย',
      text: 'หวังว่าจะได้เจอกันอีกนะ 👋',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => {
      window.location.reload(); // ถ้าต้องการ reload หลัง logout
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
