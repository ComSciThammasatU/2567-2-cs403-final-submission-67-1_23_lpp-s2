import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: 'Token is required' });
        }

        const token = authHeader.split(" ")[1]; // ดึงเฉพาะ token

        const decoded = jwt.verify(token, 'jwtsecret'); // 🔑 ใช้ secret ตรงกัน
        req.user = decoded.user;

        next();
    } catch (err) {
        console.error("Token error:", err);
        return res.status(401).json({ error: 'Token Invalid' }); // เปลี่ยนเป็น 401 เพื่อความถูกต้อง
    }
};
