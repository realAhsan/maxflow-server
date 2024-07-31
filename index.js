require("dotenv").config();
const express = require("express");
const path = require("path");
require("./database");
const app = express();
const { userRouter } = require("./routes/user-routes");
const { taskRouter } = require("./routes/task-routes");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://maxflow-server-production.up.railway.app",
      "https://max-flow.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server started at port " + PORT);
});
