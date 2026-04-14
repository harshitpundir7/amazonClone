import { Response } from 'express';

interface SuccessPayload {
  statusCode: number;
  message: string;
  data?: unknown;
}

interface ErrorPayload {
  statusCode: number;
  message: string;
}

export const sendResponse = (
  res: Response,
  { statusCode, message, data }: SuccessPayload,
): Response => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = (
  res: Response,
  { statusCode, message }: ErrorPayload,
): Response => {
  return res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    message,
  });
};
