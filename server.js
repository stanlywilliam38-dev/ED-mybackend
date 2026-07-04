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
  "https://goal-mindset.vercel.app",
  "https://ed-frontend-elmy.vercel.app",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Body parser (raised limit to allow base64-encoded avatar uploads)
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

// Static image routes
app.use("/uploads", express.static(uploadPath));

// Optional old support
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