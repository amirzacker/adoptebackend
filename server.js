const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./api/users/users.router");
const usersController = require("./api/users/users.controller");
const artcileRouter = require("./api/articles/articles.router");
const authMiddleware = require("./middlewares/auth");
const domainRouter = require("./api/domains/domains.router");
const searchTypeRouter = require("./api/searchTypes/searchTypes.router");
const messagesRouter = require("./api/messages/messages.router");
const conversationsRouter = require("./api/conversations/conversations.router");

const app = express();

const server = http.createServer(app);
//const io = new Server(server);
const io = new Server(server,{ 
  cors: {
    origin: "http://localhost:3000"
  }
}) //in case server and client run on different urls

io.on("connection", (socket) => {
  //console.log("a user connected!!!!!!!");
  socket.on("sendMessage", (data) => {
    console.log(data);
  });
  //io.emit("event_from_server", { test: "foo" });
});

//test socket



let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(user);
    //console.log(users);
    io.emit("getMessage", {
      senderId,
      text,
    });
  });

 /*  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    //console.log(users);
       io.emit("getMessage", {
      senderId,
      text,
    });
  }); */

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

});




//end test socket 

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(cors());
app.use(express.json());
app.use(helmet());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {


    if (file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'  || file.mimetype === 'application/pdf'  ) {
       //console.log(file);
       //in test postman
       cb(null, file.originalname);
        //in dev
        //cb(null, req.body.name);

    } else{
      return cb(new Error('Invalid mime type , try only pdf , jpeg, png , jpg'));
    }

  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/users/:id/articles", usersController.getAllUserArticle);
app.use("/api/articles", authMiddleware, artcileRouter);
app.use("/api/messages", authMiddleware, messagesRouter);
app.use("/api/conversations", authMiddleware, conversationsRouter);
app.use("/api/users", userRouter);
//app.use("/api/users", authMiddleware, userRouter);
app.post("/api/login", usersController.login);

app.use("/api/domains", domainRouter);
app.use("/api/searchTypes", searchTypeRouter);
app.use("/", express.static("public"));

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

module.exports = {
  app,
  server,
};
