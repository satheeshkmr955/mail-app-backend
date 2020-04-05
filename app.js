const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const http = require("http");
const socketServer = require("socket.io");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const {
  normalizePort,
  onError,
  onListening,
} = require("./utilities/helperUtility");

// Load env vars
if (process.env.NODE_ENV === "production")
  dotenv.config({ path: "./config/.env.production" });
else dotenv.config({ path: "./config/.env.local" });

// Connect to database
connectDB();

// Route files
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");
const uploadRouter = require("./routes/uploads");

const app = express();

const server = http.createServer(app); // server creation
const io = new socketServer(server); // socket instance creation

// conection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// create mongoose connection
newConn = mongoose.createConnection(process.env.MONGO_URI, options);

// init gfs
let gfs;
newConn.once("open", () => {
  console.log("MongoDB File Upload Connected:");
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(newConn.db, {
    bucketName: "uploads",
  });
  app.set("gfs", gfs);
});

newConn.on("error", console.error.bind(console, "MongoDB Connection Error"));

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

app.use(cookieParser()); // Cookie parser
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Set static folder
app.use(logger("dev")); // Dev logging middleware
app.use(mongoSanitize()); // Sanitize data
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
app.use(cors()); // Enable CORS

// Mount routers
app.use("/api/v1/user", usersRouter(io)); // pass io to controllers
app.use("/api/v1/message", messagesRouter(io)); // pass io to controllers
app.use("/api/v1/upload", uploadRouter(io, app)); // pass io to controllers

app.use(errorHandler);

// Listen on provided port, on all network interfaces.
server.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
server.on("error", onError);
server.on("listening", () => {
  onListening(server);
});

module.exports = app;
