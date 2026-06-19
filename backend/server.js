import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./src/routes/ai.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/ai", router);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
