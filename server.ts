import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import http from "http";

import SocketService from "./services/socket.service";

import router from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const socketService = new SocketService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!! 🚀");
});

const server = http.createServer(app);
socketService.io.attach(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

socketService.initListeners();
