const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const helmet = require("helmet");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

const uri = process.env.MONGODB_URI || require("./config/config").ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  // useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected...");
});

const usersRouter = require("./routes/api/users");
const authRouter = require("./routes/api/auth");
const staffRouter = require("./routes/api/staff");
const teachersRouter = require("./routes/api/teachers");
const studentsRouter = require("./routes/api/students");
const eventsRouter = require("./routes/api/events");
const paymentsRouter = require("./routes/api/payments");

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/staff", staffRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/students", studentsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/payments", paymentsRouter);

const forceSsl = function (req, res, next) {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(["https://", req.get("Host"), req.url].join(""));
  }
  return next();
};

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(forceSsl);
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
