import express, { Request, Response } from "express";
import AuthRouter from "./auth.route";
import PostRouter from "./post.route";

const router = express.Router();

router.get("/api/test", (req: Request, res: Response) => {
  res.send("API Test Route!! 🤓");
});

router.use("/api/auth", AuthRouter);
router.use("/api/post", PostRouter);

export default router;
