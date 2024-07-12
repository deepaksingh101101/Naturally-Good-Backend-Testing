import { Request, Response } from 'express';
import { client, twilioNumber } from '../../twilio';

export const sendOTP = async (req: Request, res: Response) => {
  try {
    let { phoneNo } = req.body;
    if (!phoneNo) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    phoneNo = phoneNo.replace(/^\+91/, '');

    const otp = Math.floor(100000 + Math.random() * 900000);


    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: twilioNumber,
      to: `+91${phoneNo}`
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

