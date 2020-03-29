const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || require("./config/config").ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
  // useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected...");
});

const usersRouter = require("./routes/users");
const teachersRouter = require("./routes/teachers");
const lessonsRouter = require("./routes/lessons");
const paymentsRouter = require("./routes/payments");

app.use("/users", usersRouter);
app.use("/teachers", teachersRouter);
app.use("/lessons", lessonsRouter);
app.use("/payments", paymentsRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
