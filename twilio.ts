import Twilio from 'twilio';

const accountSid = 'AC1ae5c481935bcc31dbd93b312558abe6';
const authToken = '932a654b3a6c3596aa713764f52f55c8';
const twilioNumber = '+16892102849';

const client = Twilio(accountSid, authToken);

export { client, twilioNumber };
