import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
    (schema: ZodSchema<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next();
            } catch (error: any) {
                console.log("Invalid Request: ", req.body);
                console.log("Error: ", error.errors);
                res.status(400).json({ error: error.errors });
            }
        };