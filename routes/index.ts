import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/test", (req: Request, res: Response) => {
  res.send("API Test Route!! 🤓");
});

export default router;
