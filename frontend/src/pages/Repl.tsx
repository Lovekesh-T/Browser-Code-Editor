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
    <div className="flex flex-col">
      <div className="flex h-[8vh] justify-end py-2 px-4">
        <button
          className="outline-none ml-5 py-1 px-4 font-bold text-black transition rounded text-sm bg-slate-100 hover:bg-slate-200"
          onClick={() => setShowOuput((prev) => !prev)}
        >
          See output
        </button>
      </div>

      <div className="grid grid-cols-10 h-[92vh] max-h-[92vh]">
        <main className="col-span-6">
          <CodeEditor socket={socket} />
        </main>
        <aside className="col-span-4 grid grid-cols-1 gap-1 grid-rows-2 h-[92vh] overflow-hidden">
          {showOuput && <Output replId={replId}/>}
          <TerminalComponent socket={socket} />
        </aside>
      </div>
    </div>
  );
};

export default Repl;
