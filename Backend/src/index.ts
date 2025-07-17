import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import path from "path";
import { io, server, app } from "./Libs/socketServer";
import { startReservationCleanup, startSalesFactsRefresh } from "./Utils/cleanReservations";

import auth from "./Routes/auth.routes";
import product from "./Routes/product.routes";
import rating from "./Routes/rating.routes";
import comment from "./Routes/comment.routes";
import order from "./Routes/order.routes";
import bots from "./Routes/bot.routes";
import payment from "./Routes/payment.routes";
import users from "./Routes/user.routes";
import workers from "./Routes/workers.routes";
import analytics from "./Routes/analytics.routes";
import paymentMethod from "./Routes/paymentMethod.routes";
import currencyExchange from "./Routes/currencyExchange.routes";
import notification from "./Routes/notification.routes";
import neworder from "./Routes/neworder.routes";
import sedes from "./Routes/sedes.routes"
import investments from "./Routes/investments.routes"

import resetSalaryMouth from "./Utils/resetSalaryMouth";



dotenv.config();
const port = 4000;

app.use(
  cors({
    origin: [
      "http://localhost:4173",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:8000",
      "http://192.168.12.1:5173",
      "http://192.168.12.1:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api", product);
app.use("/api", rating);
app.use("/api", comment);
app.use("/api", order);
app.use("/api", bots);
app.use("/api", payment);
app.use("/api", sedes);
app.use("/api", users);
app.use("/api", workers);
app.use("/api", paymentMethod);
app.use("/api", currencyExchange);
app.use("/api/analytics", analytics);
app.use("/api", notification);
app.use("/api", neworder);
app.use("/api", investments);


app.use("/public", express.static(path.join(__dirname, "/Upload")));

server.listen(port, () => {
  console.log(`Server on port ${port}`);
  // Iniciar el programador de limpieza de reservas
  startReservationCleanup();
  resetSalaryMouth()
  startSalesFactsRefresh()
});
