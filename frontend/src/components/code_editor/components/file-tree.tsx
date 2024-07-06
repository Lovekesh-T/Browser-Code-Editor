import styled from "@emotion/styled";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Socket } from "socket.io-client";
import { contextMenuAtom } from "../../../store/contextMenu";
import {
  createFileDirectoryAtom,
  fileTypeAtom,
  openDirectoryAtom,
  renameAtom,
} from "../../../store/file";
import {
  Directory,
  File,
  RemoteFile,
  Type,
  sortDir,
  sortFile,
} from "../utils/file-manager";
import { getIcon } from "./icon";
import { elementAtom } from "../../../store/file";
import { CreateFileInput } from "./CreateFile";

interface FileTreeProps {
  rootDir: Directory; // 根目录
  selectedFile: File | undefined; // 当前选中文件
  onSelect: (file: File) => void;
  socket: Socket | null; // // 更改选中时触发事件
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
}

export const FileTree = (props: FileTreeProps) => {
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuAtom);
  const divRenameRef = useRecoilValue(elementAtom);
  const setRename = useSetRecoilState(renameAtom);
  const treeRef = useRef<HTMLDivElement | null>(null);
  const setFileType = useSetRecoilState(fileTypeAtom);

  useEffect(() => {
    if (!treeRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickHandler = (e: any) => {
      setContextMenu({ open: false, fileId: "" });
      if (
        e.target.closest(".createFileInput") ||
        e.target.closest(".contextMenu") ||
        e.target.closest(".createFileOptions")
      ) {
        setFileType((prev) => prev);
      } else {
        setFileType(null);
      }
      if (e.target?.closest(".contextMenu") || divRenameRef?.contains(e.target))
        return;
      setRename({ rename: false, fileId: "" });
    };
    window.addEventListener("click", clickHandler);

    return () => window.removeEventListener("click", clickHandler);
  }, [treeRef, setContextMenu, setRename, divRenameRef, setFileType]);

  return (
    <div
      ref={treeRef}
      className={`${contextMenu.open ? "pointer-events-none" : ""}`}
    >
      <SubTree directory={props.rootDir} {...props} />
    </div>
  );
};

interface SubTreeProps {
  directory: Directory; // 根目录
  selectedFile: File | undefined; // 当前选中文件
  onSelect: (file: File) => void;
  socket: Socket | null;
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
}

const SubTree = (props: SubTreeProps) => {
  const fileType = useRecoilValue(fileTypeAtom);
  const createFileDirectory = useRecoilValue(createFileDirectoryAtom);
  return (
    <div>
      {fileType !== null &&
      createFileDirectory === "0" &&
      !props.directory.parentId ? (
        <CreateFileInput
          selectedFile={props.selectedFile}
          setFileStructure={props.setFileStructure}
          socket={props.socket}
          directory={props.directory}
        />
      ) : (
        fileType !== null &&
        createFileDirectory === props.directory.path && (
          <CreateFileInput
            selectedFile={props.selectedFile}
            setFileStructure={props.setFileStructure}
            socket={props.socket}
            directory={props.directory}
          />
        )
      )}

      {props.directory.dirs.sort(sortDir).map((dir) => (
        <React.Fragment key={dir.id}>
          <DirDiv
            setFileStructure={props.setFileStructure}
            directory={dir}
            selectedFile={props.selectedFile}
            onSelect={props.onSelect}
            socket={props.socket}
          />
        </React.Fragment>
      ))}

      {props.directory.files.sort(sortFile).map((file) => (
        <React.Fragment key={file.id}>
          <FileDiv
            file={file}
            selectedFile={props.selectedFile}
            onClick={() => props.onSelect(file)}
            socket={props.socket}
            setFileStructure={props.setFileStructure}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

const FileDiv = ({
  file,
  icon,
  selectedFile,
  onClick,
  socket,
  setFileStructure,
}: {
  file: File | Directory; // 当前文件
  icon?: string; // 图标名称
  selectedFile: File | undefined; // 选中的文件
  socket: Socket | null;
  onClick: () => void; // 点击事件
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
}) => {
  const fileRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setFileElement = useSetRecoilState(elementAtom);
  const [contextMenu, setContextMenu] = useRecoilState(contextMenuAtom);
  const [{ rename, fileId }, setRename] = useRecoilState(renameAtom);
  const [renameFileInput, setRenameFileInput] = useState(file.name);
  const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
  const depth = file.depth;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileRename = (e: ChangeEvent<HTMLInputElement>) => {
    setRenameFileInput(e.target.value);
  };

  useEffect(() => {
    if (inputRef.current && rename && file.id === fileId) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [rename, file.id, fileId]);

  useEffect(() => {
    if (!inputRef.current) return;
    const currentRef = inputRef.current;

    const keyPressHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        let oldpath: string = "";
        let newpath: string = "";
        setFileStructure((prev) => {
          const filemap = new Map<string, RemoteFile>([]);

          prev.forEach((f) => {
            if (file.path === f.path) {
              oldpath = f.path;
              newpath = f.path.split("/").slice(0,-1).join("/")+ "/"+renameFileInput
              filemap.set(`${f.type}:${newpath}`, {
                ...f,
                name: renameFileInput,
                path: newpath,
              });
            } else if (f.path.startsWith(file.path)) {
              const lastfile = f.path.split(file.path)[1];
              const path = file.path.split("/").slice(0, -1);
              path?.push(renameFileInput);
              const fullPath = path.join("/") + lastfile;
              filemap.set(`${f.type}:${fullPath}`, {
                ...f,
                name: renameFileInput,
                path: fullPath,
              });
            } else filemap.set(`${f.type}:${f.path}`, f);
          });

          const allFiles: RemoteFile[] = [];
          filemap.forEach((file) => allFiles.push(file));
          return allFiles;
        });
        setRename({ rename: false, fileId: "" });
        socket?.emit("renameFile", { oldpath, newpath });
      }
    };
    currentRef.addEventListener("keypress", keyPressHandler);

    return () => currentRef?.removeEventListener("keypress", keyPressHandler);
  }, [setRename, setFileStructure, file, renameFileInput, socket]);

  return (
    <Div
      open={contextMenu.open}
      ref={fileRef}
      depth={depth}
      isSelected={isSelected}
      className={`relative`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu((prev) => ({ open: !prev.open, fileId: file.id }));
      }}
    >
      {contextMenu.open && contextMenu.fileId === file.id && (
        <ContextMenu
          selectedFile={selectedFile}
          type={file.type}
          socket={socket}
          file={file}
          setRename={setRename}
          contextMenu={contextMenu}
          element={fileRef.current}
          setFileElement={setFileElement}
        />
      )}
      <FileIcon name={icon} extension={file.name.split(".").pop() || ""} />

      {rename && file.id === fileId ? (
        <input
          ref={inputRef}
          value={renameFileInput}
          onChange={handleFileRename}
          className="outline-none ml-[1px] text-white bg-[#242424]"
        />
      ) : (
        <span style={{ marginLeft: 1 }}>{file.name}</span>
      )}
    </Div>
  );
};

const Div = styled.div<{
  depth: number;
  isSelected: boolean;
  open: boolean;
}>`
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.depth * 16}px;
  background-color: ${(props) =>
    props.isSelected ? "#242424" : "transparent"};

  :hover {
    cursor: pointer;
    background-color: ${(props) => (props.open ? "transparent" : "#242424")};
  }
`;

const DirDiv = ({
  directory,
  selectedFile,
  onSelect,
  socket,
  setFileStructure,
}: {
  directory: Directory; // 当前目录
  selectedFile: File | undefined; // 选中的文件
  onSelect: (file: File) => void; // 点击事件
  socket: Socket | null;
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
}) => {
  // let defaultOpen = false;
  // if (selectedFile) defaultOpen = isChildSelected(directory, selectedFile);
  // const [open, setOpen] = useState(defaultOpen);
  const [{ open, id }, setOpen] = useRecoilState(openDirectoryAtom);
  return (
    <>
      <FileDiv
        setFileStructure={setFileStructure}
        file={directory}
        icon={(open && (directory.id === id || isChildSelected(directory, selectedFile!))) ? "openDirectory" : "closedDirectory"}
        selectedFile={selectedFile}
        socket={socket}
        onClick={() => {
          onSelect(directory);
          setOpen({ open: true, id: (directory.id === id || isChildSelected(directory, selectedFile!))? "" : directory.id });
        }}
      />
      {open &&
      (id === directory.id || isChildSelected(directory, selectedFile!)) ? (
        <SubTree
          setFileStructure={setFileStructure}
          directory={directory}
          selectedFile={selectedFile}
          onSelect={onSelect}
          socket={socket}
        />
      ) : null}
    </>
  );
};

const isChildSelected = (directory: Directory, selectedFile: File) => {
  let res: boolean = false;

  function isChild(dir: Directory, file: File) {
    if (selectedFile?.parentId === dir.id) {
      res = true;
      return;
    }
    if (selectedFile?.parentId === "0") {
      res = false;
      return;
    }
    dir.dirs.forEach((item) => {
      isChild(item, file);
    });
  }

  isChild(directory, selectedFile);
  return res;
};

const FileIcon = ({
  extension,
  name,
}: {
  name?: string;
  extension?: string;
}) => {
  const icon = getIcon(extension || "", name || "");
  return <Span>{icon}</Span>;
};

const Span = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const ContextMenu = ({
  type,
  socket,
  file,
  setRename,
  contextMenu,
  element,
  setFileElement,
  selectedFile,
}: {
  type: Type;
  socket: Socket | null;
  file: File | Directory;
  setRename: SetterOrUpdater<{
    rename: boolean;
    fileId: string;
  }>;
  contextMenu: { open: boolean; fileId: string };
  element: HTMLDivElement | null;
  setFileElement: SetterOrUpdater<HTMLDivElement | null>;
  selectedFile: File | undefined;
}) => {
  const setCreateFileDirectory = useSetRecoilState(createFileDirectoryAtom);
  const setFileType = useSetRecoilState(fileTypeAtom);
  const setOpen = useSetRecoilState(openDirectoryAtom);
  const setContextMenu = useSetRecoilState(contextMenuAtom)
  return (
    <div
      className={`${
        contextMenu.open ? "pointer-events-auto" : ""
      } w-9/12 bg-stone-900 absolute translate-x-10 translate-y-11 z-50 flex flex-col contextMenu`}
    >
      {type === Type.DIRECTORY ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                !selectedFile ||
                (selectedFile &&
                  selectedFile.type === Type.FILE &&
                  selectedFile.parentId === "0")
              ) {
                setCreateFileDirectory("0");
              } else if (selectedFile.type === Type.FILE) {
                setCreateFileDirectory(selectedFile.parentId!);
              } else {
                setCreateFileDirectory(selectedFile.path);
                setOpen(prev=>({...prev, id: selectedFile.id }));
              }

              setFileType("file");
              setContextMenu({open:false,fileId:""})
            
            }}
            className=" text-start text-sm px-2 py-1 transition rounded hover:bg-stone-800"
          >
            New File
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                !selectedFile ||
                (selectedFile &&
                  selectedFile.type === Type.FILE &&
                  selectedFile.parentId === "0")
              ) {
                setCreateFileDirectory("0");
              } else if (selectedFile.type === Type.FILE) {
                setCreateFileDirectory(selectedFile.parentId!);
              } else {
                setCreateFileDirectory(selectedFile.path);
                setOpen({ open: true, id: selectedFile.id });
              }

              setFileType("dir");
              setContextMenu({open:false,fileId:""})
            }}
            className=" text-start text-sm px-2 py-1 transition rounded hover:bg-stone-800"
          >
            New Folder
          </button>
        </>
      ) : null}
      <button
        className=" text-start text-sm px-2 py-1 transition rounded hover:bg-stone-800"
        onClick={() => {
          setRename({ fileId: file.id, rename: true });
          setFileElement(element);
        }}
      >
        Rename
      </button>
      <button
        onClick={() => {
          socket?.emit("deleteFile", {
            path: file.path,
            type: file.type === Type.DIRECTORY ? "dir" : "file",
          });
        }}
        className=" text-start text-sm px-2 py-1 transition rounded hover:bg-stone-800"
      >
        Delete
      </button>
    </div>
  );
};
