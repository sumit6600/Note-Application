const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const app = express();
require("dotenv").config({
  path: "./config/config.env",
});
// dotenv.config();
connectDB();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API IS RUNNING..");
});

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on PORT ${PORT}`));

//api end point is used tp fetch the data from the database.
