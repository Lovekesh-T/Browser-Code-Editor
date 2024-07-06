import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";

const fitaddon = new FitAddon();
const OPTIONS_TERM = {
  useStyle: true,
  screenKeys: true,
  cursorBlink: true,
  cols: 200,
  fontsize:12,
  theme: {
    background: "black",
  },
};
const viewportStyles = `
.xterm .xterm-viewport::-webkit-scrollbar {
  display: none;
}
.xterm .xterm-viewport {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
  .xterm {
   height:100%;
   padding:4px 6px;
  }
`;


const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
  const terminalRef = useRef(null);
  const isRendered = useRef(false);

  useEffect(() => {
    if (!terminalRef || !terminalRef.current || !socket) {
      return;
    }


    if (isRendered.current) return;
    isRendered.current = true;
     
    const term = new Terminal({...OPTIONS_TERM,fontSize:14});
    term.loadAddon(fitaddon);
    term.open(terminalRef.current);
    fitaddon.fit();

    socket.emit("requestTerminal");

    socket.on("terminal", ({ data }) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit("terminalData", { data });
    });
  }, [terminalRef, socket]);

  return <div  ref={terminalRef} >
    <style>
      {viewportStyles}
    </style>
</div>
};

export default TerminalComponent;
