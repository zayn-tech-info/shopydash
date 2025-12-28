const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const http = require("http");
const { Server } = require("socket.io");

const validateEnv = require("./utils/validateEnv");
const app = require("./app");

// Validate environment variables before starting the server
validateEnv();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://vendora-app-rho.vercel.app"
        : "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible to our routers/controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // User joins their own room for notifications
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room`);
    }
  });

  // User joins a specific conversation room
  socket.on("join_chat", (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
      console.log(`User joined chat room ${conversationId}`);
    }
  });

  socket.on("typing", ({ conversationId, userId, userName }) => {
    socket.to(conversationId).emit("typing", { userId, userName });
  });

  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("stop_typing", { userId });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
