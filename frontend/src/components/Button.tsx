import { FormEvent } from "react"


const Button = ({text,onClick}:{text:string,onClick:(e:FormEvent<HTMLButtonElement>)=>void})=> {
    return (
        <button type="submit" className="w-full text-white bg-slate-700 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={onClick}>{text}</button>
    )
}

export default Button
