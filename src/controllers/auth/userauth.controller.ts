import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import UserModel from '../../models/user.model';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const LoginUserByGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ error: 'Token is required' });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || '525557668529-0sv0893s4r5b5gqrh82d3f6ffqgsrg4e.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).json({ error: 'Invalid token' });
            return;
        }

        const { sub: googleId, email, given_name: firstname, family_name: lastname, picture } = payload;

        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = new UserModel({
                userName: `${firstname} ${lastname}`,
                firstname,
                lastname,
                phoneNo: '', // You might want to ask for this info if it's essential
                password: '', // No password for Google-authenticated users
                address: {
                    HouseNumber: '',
                    City: '',
                    State: '',
                    ZipCode: '',
                },
                email,
                accountStatus: true,
                lastLogin: new Date().toISOString(),
                googleId,
                picture,
            });
            await user.save();
        } else {
            user.lastLogin = new Date().toISOString();
            await user.save();
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: email },
            JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(200).json({ jwtToken, message: 'Login successful', user });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
