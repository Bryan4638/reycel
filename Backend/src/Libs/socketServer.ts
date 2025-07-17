import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:4173",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8000",
      "http://192.168.227.249:8000",
      "https://q55z9fw0-5173.usw2.devtunnels.ms",
      "http://192.168.12.1:5173",
      "http://192.168.12.1:5174",
    ],
    credentials: true,
  },
});

// Mapa para asociar transactionID con socket IDs
const userSockets = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("registerTransaction", (transactionID) => {
    userSockets.set(transactionID, socket.id);
    console.log(
      `Transacción ${transactionID} registrada con socket ID ${socket.id}`
    );
  });

  socket.on("usuario-conectado", (id) => {
    console.log(id);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);

    // Eliminar asociaciones del socket desconectado
    for (const [transactionID, id] of userSockets.entries()) {
      if (id === socket.id) {
        userSockets.delete(transactionID);
      }
    }
  });
});

export { io, server, app, userSockets };
