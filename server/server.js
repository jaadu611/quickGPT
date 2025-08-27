import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDb } from "./configs/db.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import messageRoute from "./routes/message.routes.js";

const app = express();

await connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("started");
});

app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
