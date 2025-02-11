import { Router } from "express";
import { identify } from "../controllers/identity.controller";
import { validateRequest } from "../middlewares/requestValidator";
import { identifyRequestSchema } from "../schemas/identifyRequestSchema";

const router = Router();

router.post("/identify", validateRequest(identifyRequestSchema), identify);

export default router;