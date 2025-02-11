import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction
) => {
    console.error(err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
};

export default errorHandler;