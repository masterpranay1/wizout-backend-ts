import { Request, Response } from "express";
import { z } from "zod";

import UserService from "../services/user.service";

class AuthController {
  async registerUser(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = schema.parse(req.body);

    try {
      const user = await UserService.createUser(email, password);

      return res.status(201).send({
        success: true,
        user: user,
      });
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        error: error?.message || "Error creating user",
      });
    }
  }

  async loginUser(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = schema.parse(req.body);

    try {
      const result = (await UserService.getUserByEmailAndPassword(
        email,
        password
      )) as any;

      console.log(result);

      if (result?.token) {
        return res.status(200).send({
          success: true,
          token: result.token,
          user: result.user,
        });
      }
    } catch (error: any) {
      return res.status(401).send({
        success: false,
        error: error?.message || "Invalid email or password",
      });
    }
  }

  async sendVerificationEmail(req: Request, res: Response) {
    const schema = z.object({
      id: z.string(),
    });

    const { id } = schema.parse(req.params);

    let user: any = null;

    try {
      user = await UserService.getUserById(id);
    } catch (error: any) {
      return res.status(404).send({
        success: false,
        error: error?.message || "User not found",
      });
    }

    try {
      const email = user?.email;
      console.log(user);
      const result = await UserService.sendVerificationEmail(email);

      if (result != null) {
        throw result;
      }
    } catch (error: any) {
      return res.status(400).send({
        success: false,
        error: error?.message || "Error sending email",
      });
    }
  }
}

export default new AuthController();
