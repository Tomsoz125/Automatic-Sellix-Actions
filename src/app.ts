import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import { errorHandler } from "./api/middlewares/errorMiddleware";
import routes from "./api/routes";

const app: Application = express();

// Middleware
app.use(errorHandler);
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

export default app;
