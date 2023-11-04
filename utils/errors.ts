import { ApiMessage } from "../models/api_message";

export function createApiError(code: number, message?: string): ApiMessage {
    if (!message) {
        if (code === 500) {
            message = 'API error';
        } else if (code === 404) {
            message = 'Not found';
        } else {
            message = 'No information available';
        }
    }

    return {
        isError: true,
        message: message,
        code: code
    }
}