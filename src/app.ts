import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import identityRoutes from "./routes/identity.routes"
import { config } from "dotenv";

config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/", identityRoutes);


// Error Handling Middleware
app.use(errorHandler);

export default app;