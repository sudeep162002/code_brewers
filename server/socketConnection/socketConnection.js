import { Server } from "socket.io";

// import cors from "cors";

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  //   const io = new Server(httpServer);
  return io;
};
