import { Router } from "express";
import { GroqController } from "../controller/groq/GroqController";

const router = Router();

const groqController = new GroqController();

router.post("/", groqController.handle.bind(groqController));

export default router;