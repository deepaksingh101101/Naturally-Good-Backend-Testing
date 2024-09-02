import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import UserModel from '../../models/user.model';
import jwt from 'jsonwebtoken';
import { responseHandler } from '../../utils/send-response';

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

        const { email, given_name, family_name, picture } = payload;

        
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = new UserModel({
                FirstName:given_name,
                LastName:family_name,
                Email:email,
                LastLogin: new Date().toISOString(),
                Profile:picture,
            });
         const newUser= await user.save();
        req['userId'] = newUser._id;
        } else {
            user.LastLogin = new Date().toISOString();
            req['userId']=user._id;
            await user.save();
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: email },
            JWT_SECRET,
            { expiresIn: '5h' }
        );

        responseHandler.out(req, res, {
            status: true,
            statusCode: 200,
            message: 'Login successful',
            data: {
                jwtToken,
                userInfo: {
                    FirstName: given_name,  
                    LastName: family_name,    
                    Email: email,          
                    Profile: picture       
                }
            }
        });
        
    } catch (error) {
        responseHandler.out(req, res, {
            status: false,
            statusCode: 500,
            message: 'Internal server error'
        });}
};


