[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/w8H8oomW)
**<ins>Note</ins>: Students must update this `README.md` file to be an installation manual or a README file for their own CS403 projects.**

**รหัสโครงงาน:** 67-1_23_lpp-s2

**ชื่อโครงงาน (ไทย):** เว็บแอปพลิเคชันลงทะเบียนเข้าร่วมกิจกรรมภายในมหาวิทยาลัยธรรมศาสตร์ 

**Project Title (Eng):** TU EVENT

**อาจารย์ที่ปรึกษาโครงงาน:** ผศ. ดร.ลัมพาพรรณ พันธุ์ชูจิตร 

**ผู้จัดทำโครงงาน:** (โปรดเขียนข้อมูลผู้จัดทำโครงงานตามฟอร์แมตดังแสดงในตัวอย่างด้านล่าง)
1. นางสาว พิมพ์มาดา คนหาญ  6409650055  pimmada.kho@dome.tu.ac.th
2. นางสาว นัฐธภรณ นิตยชัยสิทธิ์  6409650576  Nuttaporn.nitt@dome.tu.ac.th
   
Manual / Instructions for your projects starts here !
# TU EVENT

TU EVENT เป็นแอปพลิเคชันที่ออกแบบมาเพื่อเพิ่มความสะดวกและลดความซับซ้อนในการลงทะเบียนและจัดการกิจกรรมภายในมหาวิทยาลัยธรรมศาสตร์ โดยระบบนี้รองรับทั้งผู้เข้าร่วมกิจกรรมและผู้จัดกิจกรรม มีเป้าหมายเพื่อเป็นแพลตฟอร์มที่ใช้งานง่ายสำหรับการค้นหา แสดงข้อมูล และลงทะเบียนเข้าร่วมกิจกรรมต่างๆ

## Installation

1. โคลน Repository Use the package manager [pip](https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_23_lpp-s2.git) to clone TUEVENT.

```bash
git clone <https://github.com/ComSciThammasatU/2567-2-cs403-final-submission-67-1_23_lpp-s2.git>
cd 67-1_23_lpp-s2_code
```

2. ตั้งค่าและรัน Backend และ .env
- เข้าไปที่โฟลเดอร์ backend
```bash
cd 67-1_23_lpp-s2_backend
```
- ติดตั้ง Dependencies ทั้งหมด
```bash
npm install
```
- สร้างไฟล์ .env ในโฟลเดอร์ backend (ระดับเดียวกับ server.js) และเพิ่มตัวแปรสภาพแวดล้อมดังนี้
```bash
MONGO_URI=mongodb+srv://chongtea:0951696142@cluster0.oawwt.mongodb.net/tu-event 
PORT=4000
APPLICATION_KEY=TU8ee5b1ce1146d640c69d997cb047f317b53d15e0ae077c2fa83d585eb0f6c502ca2e098ef7a2e15d358c8253991edcdb

```
- รันเซิร์ฟเวอร์ Backend
```bash
npm run server
```
3. ตั้งค่าและรัน Frontend
- กลับไปที่โฟลเดอร์หลักของโปรเจกต์และเข้าไปที่โฟลเดอร์ frontend
```bash
cd ../67-1_23_lpp-s2_frontend
```
- ติดตั้ง Dependencies ทั้งหมด
```bash
npm install
```
- รัน Development Server ของ Frontend
```bash
npm run dev
```

