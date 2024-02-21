import { Server } from "socket.io";

interface User {
  id: string;
  userId: string;
  isFree: boolean;
}

class SocketService {
  static users: User[] = [];

  private _io: any;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", async (socket: any) => {
      console.log(`New Socket Connected`, {
        id: socket.id,
        userId: socket.handshake.query.userId,
      });

      await new Promise((resolve) => {
        SocketService.users.push({
          id: socket.id,
          userId: socket.handshake.query.userId,
          isFree: true,
        });
        resolve(1);
      });

      socket.on("disconnect", () => {
        console.log("Socket Disconnected", {
          id: socket.id,
          userId: socket.handshake.query.userId,
        });

        const index = SocketService.users.findIndex(
          (user) => user.id === socket.id
        );
        SocketService.users.splice(index, 1);
      });

      socket.on(
        "send-message",
        ({ message, to }: { message: string; to: string }) => {
          const socketId =
            SocketService.users.find((user) => user.userId == to)?.id ||
            undefined;

          if (!socketId) {
            return;
          }

          console.log(
            "Send Message",
            message,
            " to ",
            to,
            " socketId ",
            socketId
          );
          io.to(socketId).emit("message", {
            message,
            from: socket.handshake.query.userId,
          });
        }
      );

      socket.on("set-free", ({ oppositeId }: { oppositeId: string }) => {
        const index = SocketService.users.findIndex(
          (user) => user.id === socket.id
        );
        console.log("oppositeId", oppositeId);
        console.log(SocketService.users);
        const oppositeIndex = SocketService.users.findIndex(
          (user) => user.userId === oppositeId
        );

        if (index != -1) {
          SocketService.users[index].isFree = true;
          console.log("Set Free", SocketService.users[index].userId);
        }
        console.log("oppositeIndex", oppositeIndex);
        if (oppositeIndex != -1) {
          SocketService.users[oppositeIndex].isFree = true;
          io.to(SocketService.users[oppositeIndex].id).emit("skipped");
          console.log("Set Free", SocketService.users[oppositeIndex].userId);
        }
      });
    });

    setInterval(() => {
      const freeUsers = SocketService.users.filter((user) => user.isFree);

      if (freeUsers.length < 2) {
        return;
      }

      const user1 = freeUsers[0];
      const randomIndex =
        Math.floor(Math.random() * (freeUsers.length - 1)) + 1;
      const randomUser2 = freeUsers[randomIndex];

      console.log("Matching", user1.userId, randomUser2.userId);
      io.to(user1.id).emit("opposite-user", {
        userId: randomUser2.userId,
      });

      io.to(randomUser2.id).emit("opposite-user", {
        userId: user1.userId,
      });

      user1.isFree = false;
      randomUser2.isFree = false;

      console.log("Matched", user1.userId, randomUser2.userId);
    }, 2000);
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
