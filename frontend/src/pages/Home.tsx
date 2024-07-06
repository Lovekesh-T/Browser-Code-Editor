import { Link } from "react-router-dom"

const Home = ()=> {
    return (
        <div className="h-screen bg-slate-950">

        <header className=" bg-slate-900">
            <nav className="py-3 px-6">
             <ul className="flex list-none justify-between">
                <li className="font-bold text-2xl">CodeBlitz</li>
                <li className="cursor-pointer px-6 py-2 bg-slate-900 transition text-sm rounded hover:bg-slate-800"><Link to={"/login"}>Log in</Link></li>
             </ul>
            </nav>
        </header>

        <main className="flex items-center justify-center flex-col gap-5 py-8 px-15 mt-20">
            <h1 className="font-bold text-8xl ">Build software faster</h1>
            <p className="text-2xl text-center py-2 px-36 text-slate-500 mx-24">CodeBlitz is an software development & deployment platform for building, sharing, and shipping software fast.</p>
            
            <button className="cursor-pointer mt-4 flex items-center justify-center bg-blue-950 rounded transition-all px-6 py-3 text-xl hover:bg-blue-900 "><Link to={"/signup"}>Sign up for free</Link></button>
        </main>
        </div>
    )
}

export default Home
