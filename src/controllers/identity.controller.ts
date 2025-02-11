import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const identify = async (req: Request, res: Response) => {
    //TODO: Implement
    console.log(req.body);
    res.status(200).json({});
}