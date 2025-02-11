import { Request, Response } from "express";
export const identify = (req: Request, res: Response) => {
    //TODO: Implement
    console.log(req.body);
    res.status(200).json({});
}