const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const passport = require("passport");
const bodyParser = require("body-parser");

const CONST = require("./src/config/const");
const { DB_URL, DB_NAME, PORT } = CONST;

// CORS fix
const allowedOrigins = [
  "https://ed-frontend-lst3.vercel.app",
  "https://ed-frontend-s8t4.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Config
require("./src/config/passport")(passport);
app.use(passport.initialize());

// routes
app.get("/", (req, res) => {
  res.json({ name: "john" });
});

app.get("/public/:name", (req, res) => {
  const options = {
    root: __dirname + "/public/img/uploads",
  };

  const fileName = req.params.name;

  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

const routes = require("./src/router");
app.use("/api", routes);

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || `${DB_URL}${DB_NAME}`;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
  });

const chatServer = require("./lib/chat_server");
const server = require("http").createServer(app);

chatServer.listen(server);

// Railway needs process.env.PORT
const Port = process.env.PORT || PORT || 5000;

server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});