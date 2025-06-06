import express from 'express';
import multer from 'multer';
import { login } from '../controller/userController.js';
import { updateUserImage } from '../controller/userController.js'; // Import the new update function
//user route
const userRouter = express.Router();

// Multer storage engine for uploading the user image
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Route for login (getting token for auth)
userRouter.post('/login', login);

// Route to update user profile image
userRouter.patch('/update/image', upload.single('image'), updateUserImage);

export default userRouter;