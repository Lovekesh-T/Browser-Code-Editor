import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import TerminalComponent from "../components/Terminal";
import { useSocket } from "../hooks/useSocket";
import Output from "../components/Output";

const Repl = () => {
  const [searchParams] = useSearchParams();
  const replId = searchParams.get("replId");
  const [showOuput, setShowOuput] = useState(false);

  const socket = useSocket(replId!);

  return (
    <div className="flex flex-col px-1 bg-[#161616] h-screen">
      <div className="flex h-[8vh] justify-end py-2 px-4">
        <button
          className="outline-none ml-5 px-4 uppercase font-semibold text-black transition rounded text-xm bg-slate-100 hover:bg-slate-200"
          onClick={() => setShowOuput((prev) => !prev)}
        >
         output
        </button>
      </div>

      <div className="grid grid-cols-10 h-[90vh] max-h-[90vh] gap-2 ">
        <main className="col-span-6 rounded-sm shadow-md">
          <CodeEditor socket={socket} />
        </main>
        <aside className="col-span-4 grid grid-cols-1 gap-1 grid-rows-2 h-[90vh] overflow-hidden shadow-md rounded-sm">
          {showOuput && <Output replId={replId}/>}
          <TerminalComponent socket={socket} />
        </aside>
      </div>
    </div>
  );
};

export default Repl;
