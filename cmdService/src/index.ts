import { WebSocket } from "ws";
import { IPty, spawn } from "node-pty";

const wss = new WebSocket.Server({ port: 9000 });


wss.on("connection", (socket) => {
  let shell:IPty;
  console.log("connected")
  socket.on("error", () => {
    console.log("socket error");
    process.exit(1);
  });

  socket.on("message", (message: string) => {
    const { type, data } = JSON.parse(message);

    if (type === "terminal") {
      shell.write(`${data}`);
    }

    if (type === "requestTerminal"){
     shell =  spawn("bash", [], {
        name: "xterm-256color",
        rows: 30,
        cols: 80,
        cwd: "/workspace",
      });

      shell.onData((data) => {
        socket.send(JSON.stringify({ type: "terminalData", data }));
      });
    
    }
  });

  socket.on("close", () => {
    console.log("websocket connnection closed!!");
    shell.kill()
  });
});

console.log("websocket is listening on port 9000");
