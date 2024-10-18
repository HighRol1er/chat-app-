import express from "express";
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// socket.io
io.on('connection', (socket) => {
  // 유저 연결
  console.log(`User Connected: ${socket.id}`);
  socket.emit("user_id", socket.id);

  // client로 부터 send_message를 받았을 때
  socket.on("send_message", (messageFromClient) => {
    console.log(messageFromClient);
    // client로 부터 받은 메세지 다시 전달.
    io.emit('chat_message', {message :messageFromClient})
  });
});

// exmaple of cookie-parser
/** TODO: 쿠키에 어떤 데이터를 저장할래?
 * 1. 지금 socket.io의 id가 페이지를 새로고침하거나, 재접속을하면 id가 바뀌는 문제를 해결하기 위해서 쿠키를 사용하고싶은건데..
 * 2. 
*/
app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies); // 서명되지 않은 쿠키
  console.log('Signed Cookies: ', req.signedCookies); // 서명된 쿠키
  res.send({
    cookies: req.cookies,
    signedCookies: req.signedCookies
  });
});

const port = 3010;

server.listen(port, () => {
  console.log(`Server Listening on Port: ${port}`);
});