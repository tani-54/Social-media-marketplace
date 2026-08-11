import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => {
  res.send("Server is live!");
});

// Inngest route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});