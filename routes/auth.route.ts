import { Router, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.send("Auth Test Route!! 🤓");
});

// register the user
router.post("/register", AuthController.registerUser);

// login the user
router.post("/login", AuthController.loginUser);

// send verification email
router.get(
  "/send-verification-email/:id",
  AuthController.sendVerificationEmail
);

export default router;
