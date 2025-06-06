import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // ชื่อเต็มของผู้ใช้งาน
    username: { 
        type: String, 
        required: true 
    }, 
    // ชื่อภาษาไทย
    displayname_th : { 
        type: String, 
        required: true 
    },
    // ชื่อภาษาอังกฤษ
    displayname_en : { 
        type: String, 
        required: true 
    }, 
    //รูปภาพ
    image : { 
        type: String, 
        default: null
    },
    // อีเมลผู้ใช้งาน
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    // บทบาทผู้ใช้งาน เช่น นักศึกษา, ผู้จัด, ผู้ดูแลระบบ
    type: { 
        type: String, 
        enum: ['student', 'employee'], 
    }, // บทบาทผู้ใช้งาน เช่น นักศึกษา, ผู้จัด, ผู้ดูแลระบบ
    phone: { 
        type: String, 
        required: false 
    }, // เบอร์โทรศัพท์ (ไม่จำเป็น)
    department: { 
        type: String, 
        required: false 
    }, // คณะ (กรณีเป็นนักศึกษา)
    faculty: { 
        type: String, 
        required: false 
    }, // สาขา (กรณีเป็นนักศึกษา)
    organization: { 
        type: String, 
        required: false 
    }, // ส่วนที่ดูแล (กรณีเป็นพนักงาน)
} , {timestamps: true})

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;