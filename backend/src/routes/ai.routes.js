import express from "express";
import getResponse from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/get-response", getResponse);

export default router;
