import { useEffect, useState } from "react";
import Sidebar from "./code_editor/components/sidebar";
import { useFilesFromSandbox } from "./code_editor/utils";

import { Code } from "./code_editor/editor/code";
import styled from "@emotion/styled";
import {
  Type,
  File,
  Directory,
  findFileByName,
  RemoteFile,
} from "./code_editor/utils/file-manager";
// import { FileTree } from "./code_editor/components/file-tree";
// import CreateFileOrFolder from "./code_editor/components/CreateFile";
import { Socket } from "socket.io-client";
import FileContentLoader from "./FileContentLoader";
import FileTreeLoader from "./code_editor/components/FileTreeLoader";
import FileStructure from "./FileStructure";

const dummyDir: Directory = {
  id: "1",
  name: "loading...",
  type: Type.DUMMY,
  parentId: undefined,
  path: "",
  depth: 0,
  dirs: [],
  files: [],
};

type FileEvent = "add" | "addDir" | "change" | "unlink" | "unlinkDir";

// const filestructure:RemoteFile[] = [{
//   name:"src",
//   path:"/src",
//   type:"dir"
// },{
//   name:"index.html",
//   path:"/index.html",
//   type:"file"
// },{
//   name:"app.js",
//   path:"/src/app.js",
//   type:"file"
// }]

const CodeEditor = ({ socket }: { socket: Socket | null }) => {
  const [rootDir, setRootDir] = useState(dummyDir);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [fileContentLoading, setFileContentLoading] = useState(false);
  useFilesFromSandbox(fileStructure, (root) => {
    if (!socket) return;
    if (!selectedFile) {
      setSelectedFile(findFileByName(root, "index.js"));
    }

    setRootDir(root);
    setLoaded(true);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = async (file: any) => {
    if (
      file.type === Type.DIRECTORY &&
      file?.files.length === 0 &&
      file?.dirs.length === 0
    ) {
      socket?.emit("fetchDir", { dir: file.path }, (files: RemoteFile[]) => {
        setFileStructure((prev) => [...prev, ...files]);
      });
    }
    if (file.type === Type.FILE && !file.content) {
      setFileContentLoading(true);
      socket?.emit("fetchContent", { path: file.path }, (content: string) => {
        file.content = content;
        setSelectedFile({ ...file, content });
        setFileContentLoading(false);
      });
    }
    setSelectedFile(file);
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("loadContent");
    socket.on("loaded", ({ rootContent }: { rootContent: RemoteFile[] }) => {
      setFileStructure(rootContent);
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on(
      "directory-changed",
      ({ path, event }: { path: string; event: FileEvent }) => {
        switch (event) {
          case "add":
            setFileStructure((prev) => [
              ...prev,
              { path, name: path.split("/").slice(-1)[0], type: "file" },
            ]);
            break;
          case "addDir":
            setFileStructure((prev) => [
              ...prev,
              { path, name: path.split("/").slice(-1)[0], type: "dir" },
            ]);
            break;
          case "change":
            socket?.emit("fetchContent", { path }, (content: string) => {
              console.log("fetched content");
              setRootDir((root) => {
                const setContent = (dir: Directory) => {
                  dir.files.forEach((file) => {
                    if (file.path === path) {
                      file.content = content;
                    }
                    dir.dirs.forEach((dir) => {
                      setContent(dir);
                    });
                  });
                };
                setContent(root);
                return root;
              });

              setSelectedFile((prev) => {
                if (prev && prev.path === path) {
                  return { ...prev, content };
                }
                return prev;
              });
            });
            break;
          case "unlink":
            setFileStructure((prev) =>
              prev.filter((file) => file.path !== path)
            );
            break;
          case "unlinkDir":
            setFileStructure((prev) =>
              prev.filter((file) => !file.path.startsWith(path))
            );
            break;
          default:
            console.log("invalid event");
        }
      }
    );
  }, [socket]);

  const updateContent = (data: string | undefined) => {
    socket?.emit("updateContent", { path: selectedFile?.path, content: data });
  };

  const debouncer = (updateHandler: (data: string | undefined) => void) => {
    const waitTimer = 5000;
    let timeout: NodeJS.Timeout ;

    return (data: string | undefined) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        updateHandler(data);
      }, waitTimer);
    };
  };

  return (
    <div>
      <Main className="gap-2 ">
        <Sidebar >
          {!loaded ? (
            <FileTreeLoader />
          ) : (
            <>
              <FileStructure socket={socket} setFileStructure={setFileStructure} selectedFile={selectedFile} rootDir={rootDir} onSelect={onSelect}/>
            </>
          )}
        </Sidebar>
        {fileContentLoading ? (
          <FileContentLoader />
        ) : (
          <Code
            selectedFile={selectedFile}
            onChange={debouncer(updateContent)}
          />
        )}
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
`;

export default CodeEditor;
