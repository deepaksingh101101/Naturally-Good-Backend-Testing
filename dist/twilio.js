"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioNumber = exports.client = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = 'AC1ae5c481935bcc31dbd93b312558abe6';
const authToken = '932a654b3a6c3596aa713764f52f55c8';
const twilioNumber = '+16892102849';
exports.twilioNumber = twilioNumber;
const client = (0, twilio_1.default)(accountSid, authToken);
exports.client = client;
