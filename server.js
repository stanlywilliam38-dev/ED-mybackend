const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");

const app = express();

const CONST = require("./src/config/const");
const { DB_URL, DB_NAME, PORT } = CONST;

// Upload folder path
const uploadPath = path.join(process.cwd(), "public", "img", "uploads");

// Make sure upload folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// CORS fix
const allowedOrigins = [
  "https://ed-frontend-elmy.vercel.app",
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

// Static image routes
app.use("/uploads", express.static(uploadPath));

// Optional: keep old route support
app.use("/public", express.static(uploadPath));

// Passport Config
require("./src/config/passport")(passport);
app.use(passport.initialize());

// Test route
app.get("/", (req, res) => {
  res.json({ name: "john" });
});

// API routes
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

// Chat server
const chatServer = require("./lib/chat_server");
const server = require("http").createServer(app);

chatServer.listen(server);

// Railway needs process.env.PORT
const Port = process.env.PORT || PORT || 5000;

server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});