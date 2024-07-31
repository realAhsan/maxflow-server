require("dotenv").config();
const express = require("express");
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
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
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
