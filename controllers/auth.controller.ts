import { Request, Response } from "express";
import { z } from "zod";

import UserService from "../services/user.service";

class AuthController {
  async registerUser(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().email().endsWith("@cuchd.in"),
      password: z.string().min(6),
      name: z.string().min(3),
      uid: z.string(),
    });

    const { email, password, name, uid } = schema.parse(req.body);
    console.log(email, password, name, uid);
    const result = await UserService.createUser(email, password, name, uid);
    console.log(result);
    if (result instanceof Error) {
      return res.status(400).send({
        success: false,
        error: result.message,
      });
    }

    return res.status(201).send({
      success: true,
      user: result,
    });
  }

  async loginUser(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = schema.parse(req.body);

    const result = await UserService.getUserByEmailAndPassword(email, password);

    if (result instanceof Error) {
      return res.status(400).send({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).send({
      success: true,
      token: result.token,
      user: result.user,
    });
  }

  async sendVerificationEmail(req: Request, res: Response) {
    const schema = z.object({
      id: z.string(),
    });

    const { id } = schema.parse(req.params);

    const user = await UserService.getUserById(id);

    if (user instanceof Error) {
      return res.status(400).send({
        success: false,
        error: user.message,
      });
    }

    const result = await UserService.sendVerificationEmail(user.email);

    if (result instanceof Error) {
      return res.status(400).send({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).send({
      success: true,
    });
  }
}

export default new AuthController();
