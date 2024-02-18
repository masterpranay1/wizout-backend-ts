import express, { Request, Response } from "express";
import AuthRouter from "./auth.route";

const router = express.Router();

router.get("/api/test", (req: Request, res: Response) => {
  res.send("API Test Route!! 🤓");
});

router.use("/api/auth", AuthRouter);

export default router;
