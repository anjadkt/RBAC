import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {

    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" && err.stack
    });
};

export default globalErrorHandler