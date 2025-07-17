import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './src/models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/user_administration');

        await User.deleteMany();

        const users = [
            {
                username: 'aibek',
                password: 'test123',
                first_name: 'Aibek',
                last_name: 'Nurbekov',
                gender: 'male',
                birthdate: new Date('1990-01-15'),
            },
            {
                username: 'aigul',
                password: 'test456',
                first_name: 'Aigul',
                last_name: 'Muratova',
                gender: 'female',
                birthdate: new Date('1993-06-22'),
            },
            {
                username: 'arsen',
                password: 'test789',
                first_name: 'Arsen',
                last_name: 'Japarov',
                gender: 'male',
                birthdate: new Date('1992-09-10'),
            },
            {
                username: 'janara',
                password: 'test123',
                first_name: 'Janara',
                last_name: 'Maratova',
                gender: 'female',
                birthdate: new Date('1988-03-05'),
            },
            {
                username: 'daniel',
                password: 'test456',
                first_name: 'Daniel',
                last_name: 'Asanov',
                gender: 'male',
                birthdate: new Date('1995-12-01'),
            },
        ];

        for (const userData of users) {
            const user = new User(userData);

            user.token = jwt.sign(
                {id: user._id, username: user.username},
                JWT_SECRET,
                {expiresIn: '7d'}
            );
            await user.save();
        }

        process.exit();
    } catch (error) {
        console.error('Error creating fixtures:', error);
        process.exit(1);
    }
})();
