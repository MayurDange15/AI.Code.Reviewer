import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./src/routes/ai.routes.js";

const app = express();

// Define allowed frontends (Local Vite dev + Vercel prod)
const allowedOrigins = [
  "http://localhost:5173", // Replace 5173 with your Vite port if different
  "https://ai-code-reviewer-kappa-six.vercel.app",
];

app.use(express.json());

// Dynamic CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      // or if the origin is in our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ai", router);

// Use the environment port provided by the host, fallback to 3000 locally
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
