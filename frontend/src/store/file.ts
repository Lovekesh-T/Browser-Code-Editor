import { atom } from "recoil";

export const elementAtom = atom<HTMLDivElement | null>({
  default: null,
  key: "elementRef",
});

export const renameAtom = atom({
  default: {
    rename: false,
    fileId: "",
  },
  key: "rename",
});

export const fileTypeAtom = atom<"dir" | "file" | null>({
  default: null,
  key: "fileType",
});

export const createFileDirectoryAtom = atom<string>({
  default: "",
  key: "createFileDirectory",
});

export const openDirectoryAtom = atom<{ open: boolean; id: string }>({
  default: {
    open: false,
    id: "",
  },
  key: "openDirectoryAtom",
});
