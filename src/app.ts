import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";
import connectDB from "./config/db";
import errorMiddleware from "./middlewares/globalError";
import { notFound } from "./middlewares/notFound";
import routes from "./routes";
import Stripe from "stripe";
import path from "path";

const app = express();

export const stripe = new Stripe(process.env.STRIPE_KEY as string);

app.use(express.static("public"));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Connect to Database
connectDB();

// Define API routes
app.use("/api/v1", routes);
app.get("/", (req, res) => {
  res.send("hello server");
});
app.get("/test", (req, res) => res.send("hello tester 2.0"));

app.use(notFound);
app.use(errorMiddleware);

const server = http.createServer(app);

const port = process.env.PORT || 5000;

// run the server
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
