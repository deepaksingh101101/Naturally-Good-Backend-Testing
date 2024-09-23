"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = void 0;
exports.responseHandler = {
    out: (request, response, data) => {
        if (typeof data === 'string') {
            response.status(200).json({ message: data || 'success' });
            return;
        }
        switch (data.statusCode) {
            case 401:
                response.status(401).json({ message: 'Unauthorized user' });
                break;
            case 500:
                response.status(500).json({ message: 'Token has expired' });
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
                }
                else {
                    response.status(data.statusCode).json({ data: data });
                }
                break;
        }
    },
};
