import fs from 'fs';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import jwt for token generation
import userModel from '../models/userModel.js';
import dotenv from 'dotenv';
//user controller
dotenv.config();

const APPLICATION_KEY = process.env.APPLICATION_KEY;

export const login = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { UserName, PassWord } = req.body;

        // Verify login credentials with the external API
        const authResponse = await axios.post(
            'https://restapi.tu.ac.th/api/v1/auth/Ad/verify',
            req.body, // Pass req.body directly
            {
                headers: {
                    'Application-Key': APPLICATION_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Auth Response:', authResponse.data);

        // Check if login is successful
        if (authResponse.data && authResponse.data.status === true) {
            console.log('Authentication successful');

            // Check if the user already exists in the database
            let user = await userModel.findOne({ username: UserName });

            if (user) {
                console.log('User already exists in the database');
                const payload = { user: { username: user.username } };

                // Generate JWT token
                const token = jwt.sign(payload, 'jwtsecret', { expiresIn: 86400 }); // Token expires in 1 day
                return res.status(200).json({ message: 'Login successful', token, payload });
            } else {
                // Extract profile data from authResponse
                const profileData = authResponse.data;

                // Create a new user in the database
                const newUser = new userModel({
                    username: UserName,
                    displayname_th: profileData.displayname_th || '',
                    displayname_en: profileData.displayname_en || '',
                    email: profileData.email || '',
                    type: profileData.type || 'student',
                    phone: profileData.phone || null,
                    department: profileData.department || null,
                    faculty: profileData.faculty || null,
                    organization: profileData.organization || null,
                });

                await newUser.save();

                console.log('New user created in the database');
                const payload = { user: { username: newUser.username } };

                // Generate JWT token for the new user
                const token = jwt.sign(payload, 'jwtsecret', { expiresIn: 86400 }); // Token expires in 1 day
                return res.status(201).json({ message: 'First-time login successful', token, payload });
            }
        } else {
            console.log('Authentication failed:', authResponse.data);
            return res.status(400).json({ error: authResponse.data.message || 'Authentication failed' });
        }
    } catch (err) {
        console.error('Error:', err);

        // Handle axios errors
        if (err.response) {
            return res
                .status(err.response.status)
                .json({ error: err.response.data || 'API Error' });
        }

        return res.status(500).json({ error: 'Server Error' });
    }
};

export const updateUserImage = async (req, res) => {
    try {
        const { username } = req.body;

        // Check if the image file is provided
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image' });
        }

        // Find the user by username
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's image field
        user.image = req.file.filename;

        // Save the updated user
        await user.save();

        // Update success
        return res.status(200).json({
            message: 'Profile image updated successfully',
            user: {
                username: user.username,
                image: user.image,
            },
        });
    } catch (err) {
        console.error('Error updating profile image:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
};