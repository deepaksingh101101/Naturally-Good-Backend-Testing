import { Request, Response } from 'express';

interface Data {
    statusCode: number;
    status: boolean;
    message: string;
    data?: any;
}

export const responseHandler = {
    out: (request: Request, response: Response, data: Data | string) => {
        if (typeof data === 'string') {
            response.status(200).json({ message: data || 'success' });
            return;
        }

        switch (data.statusCode) {
            case 401:
                response.status(401).json({ message: 'Unauthorized user' });
                break;
            case 500:
                response.status(500).json({ message: 'Internal server error Or Invalid data' });
                break;
            case 400:
                response.status(400).json({ message: 'Bad request', fields: data });
                break;
            case 300:
                response.status(300).json({ message: data });
                break;
            case 404:
                response.status(404).json({ message: data.message });
                break;
            default:
                if (data.message || data.data) {
                    response.status(data.statusCode).json(data);
                } else {
                    response.status(data.statusCode).json({ data: data });
                }
                break;
        }
    },
};
