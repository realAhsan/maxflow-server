const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://apervaiz622:03013006456@cluster0.5azfptk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Database Connected"))
  .catch((e) => {
    console.log(console.log(e));
  });
