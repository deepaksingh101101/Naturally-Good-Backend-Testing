import { Request, Response } from 'express';
import twilio from 'twilio';
import UserModel from '../models/user.model';

const twilioSid = "AC1ae5c481935bcc31dbd93b312558abe6";
const twilioAuthToken = "932a654b3a6c3596aa713764f52f55c8";
const twilioNumber = "+16892102849";

const client = twilio(twilioSid, twilioAuthToken);

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNo } = req.body;
    if (!phoneNo) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await UserModel.findOne({ phoneNo });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioNumber,
      to: phoneNo
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
