const chat_routes = require("../src/chat_routes");
const { Server } = require("socket.io");

let io;
let users = {};

module.exports.listen = function (server) {
  io = new Server(server, {
    cors: {
      origin: [
        "https://goal-mindset.vercel.app",
        "https://ed-frontend-elmy.vercel.app",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", function (socket) {
    socket.emit("connected", "hello");

    socket.on("set_userId", ({ userId }) => {
      users[userId] = socket.id;
    });

    chat_routes(socket, io, users);
  });
};