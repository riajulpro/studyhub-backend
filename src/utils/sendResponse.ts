import { Response } from "express";

interface IResponse<T> {
  statusCode?: number;
  success: boolean;
  message?: string;
  data: T;
  error?: any;
  [key: string]: any;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error,
  });
};

export default sendResponse;
