import { atom } from "recoil";

export const contextMenuAtom = atom<{
    open:boolean;
    fileId:string
}>({
    default:{
        open:false,
        fileId:""
    },
    key:"contextMenu"
})