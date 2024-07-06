import { Socket } from "socket.io-client";
import CreateFileOrFolder from "./code_editor/components/CreateFile";
import { FileTree } from "./code_editor/components/file-tree";
import { Directory, File, RemoteFile } from "./code_editor/utils/file-manager";

interface FileStructureProps {
  socket: Socket | null;
  selectedFile: File | undefined;
  rootDir: Directory;
  onSelect: (file: File) => void;
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
}

const FileStructure = ({
  socket,
  selectedFile,
  rootDir,
  onSelect,
  setFileStructure,
}: FileStructureProps) => {
  return (
    <>
      <CreateFileOrFolder
        selectedFile={selectedFile}
        setFileStructure={setFileStructure}
        socket={socket}
      />

      <FileTree
        socket={socket}
        rootDir={rootDir}
        selectedFile={selectedFile}
        onSelect={onSelect}
        setFileStructure={setFileStructure}
      />
    </>
  );
};

export default FileStructure;
