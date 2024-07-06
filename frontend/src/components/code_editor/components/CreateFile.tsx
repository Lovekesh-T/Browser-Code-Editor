import { useEffect, useRef, useState } from "react";
import { Directory, File, RemoteFile, Type } from "../utils/file-manager";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { Socket } from "socket.io-client";
import { CgFile, CgFolder } from "react-icons/cg";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  createFileDirectoryAtom,
  fileTypeAtom,
  openDirectoryAtom,
} from "../../../store/file";

export const CreateFileInput = ({
  selectedFile,
  setFileStructure,
  socket,
  directory,
}: {
  selectedFile: File | undefined;
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
  socket: Socket | null;
  directory: Directory;
}) => {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [fileType, setFileType] = useRecoilState(fileTypeAtom);

  useEffect(() => {
    if (!inputRef) return;
    const fileChangeHandler = (e: KeyboardEvent) => {
      const path =
        selectedFile?.type === Type.DIRECTORY
          ? `${selectedFile?.path}/${inputRef.current?.value}`
          : selectedFile?.parentId === "0"
          ? `/${inputRef.current?.value as string}`
          : `${selectedFile?.parentId}/${inputRef.current?.value as string}`;

      if (e.key === "Enter") {
        if (!inputRef.current?.value) return;
        setFileStructure((prev) => [
          ...prev,
          {
            name: inputRef.current?.value as string,
            type: fileType!,
            path,
          },
        ]);

        socket?.emit("createFile", { type: fileType, path });

        setFileType(null);
      }
    };
    inputRef.current?.addEventListener("keypress", fileChangeHandler);
    return () =>
      // eslint-disable-next-line react-hooks/exhaustive-deps
      inputRef.current?.removeEventListener("keypress", fileChangeHandler);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, selectedFile, fileType]);

  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus();
    }
  }, [fileType, inputRef]);
  return (
    <div
      style={{
        paddingLeft: `${
          directory?.depth === 0 ? 1 * 16 : (directory?.depth + 1) * 16
        }px`,
      }}
      className="flex items-center createFileInput"
    >
      <span className="min-w-[32px] min-h-[32px] flex items-center justify-center">
        {fileType === "file" ? (
          <CgFile className="w-[18px] h-[18px] " />
        ) : (
          <CgFolder className="w-[18px] h-[18px] " />
        )}
      </span>
      <input
        ref={inputRef}
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="border-slate-300 border-[1px] outline-none text-2 text-white bg-[#080808]  px-2 w-full"
      />
    </div>
  );
};

const CreateFileOrFolder = ({
  selectedFile,
}: {
  selectedFile: File | undefined;
  setFileStructure: React.Dispatch<React.SetStateAction<RemoteFile[]>>;
  socket: Socket | null;
}) => {
  const setFileType = useSetRecoilState(fileTypeAtom);
  const setCreateFileDirectory = useSetRecoilState(createFileDirectoryAtom);
  const setOpen = useSetRecoilState(openDirectoryAtom);
  return (
    <div className="flex flex-col gap-1 createFileOptions">
      <div className="flex justify-end gap-2 py-1 px-2 items-center">
        <p className="mr-auto text-xs font-bold">CREATE</p>
        <button
          className="hover:bg-slate-800 transition py-[2px] px-[2px] rounded"
          title="New File"
          onClick={() => {
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
          }}
        >
          <VscNewFile className="text-[17px]" />
        </button>
        <button
          className="hover:bg-slate-800 transition py-[2px] px-[2px] rounded"
          title="New Folder"
          onClick={() => {
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
          }}
        >
          <VscNewFolder className="text-[17px]" />
        </button>
      </div>
    </div>
  );
};

export default CreateFileOrFolder;
