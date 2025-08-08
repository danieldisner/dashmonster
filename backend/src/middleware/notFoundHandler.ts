import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.url} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
    },
  });
};
