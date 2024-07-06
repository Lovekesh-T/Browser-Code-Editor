import { atom } from "recoil";
interface User{
    id:string;
    username:string,
    email:string;
}
export const userAtom = atom<{loading:boolean,user:User | null}>({
    key:"user",
    default:{loading:true,user:null},
})