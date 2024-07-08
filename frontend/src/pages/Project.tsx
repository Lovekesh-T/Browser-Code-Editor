import { FormEvent, useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import { useRecoilState } from "recoil";
import ButtonLoading from "../components/ButtonLoading";
import { userAtom } from "../store/user";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as generateUuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { Select, Space } from "antd";
import { Java, Nodejs, Python } from "../components/langIcons/LangIcons";
import Fork from "../components/icons/Fork";

interface Repl {
  _id: string;
  replId: string;
  createdAt: Date;
  updatedAt: Date;
  lang: string;
}

const switchLangIcon = (lang:string):JSX.Element=>{
  switch(lang){
    case "nodejs":
      return <Nodejs/>
    case "java":
      return <Java/>
    case "python":
      return <Python/>
    default:
      return <Nodejs/>;
  }
}

const Project = () => {
  const [{ user }, setUser] = useRecoilState(userAtom);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lang, setLang] = useState("nodejs");
  const [loading, setLoading] = useState(false);
  const [repls, setRepls] = useState<Repl[]>([]);
  const navigate = useNavigate();

  const fetchRepls = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/repl/all`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setRepls(data.data);
      })
      .catch((err) => {
        console.log(`fetch repls error: ${err}`);
      });
  };
  useEffect(() => {
    fetchRepls();
  }, []);

  const handleDeleteRepl = async (replId: string) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/repl/delete/${replId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      fetchRepls();
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const signout = () => {
    localStorage.removeItem("token");
    setUser({ loading: false, user: null });
  };

  const forkRepl = (completeId: string) => {
    const username = completeId.split("-")[0];
    const replId = completeId.split("-").slice(1).join("-");
    console.log(username);
    console.log(replId)
    axios
      .post(`${import.meta.env.VITE_ORCHESTRATER_URL}/start`, {
        username,
        replId,
      })
      .then(({ data }) => {
        toast.success(data.message);
        navigate(`/repl?replId=${username}-${replId}`);
      })
      .catch((err) => {
        throw err;
      });
  };

  const createRepl = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!lang) return;
    const replID = generateUuid();
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/repl/create`,
        { replID, lang },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        axios
          .post(`${import.meta.env.VITE_ORCHESTRATER_URL}/start`, {
            username: user?.username,
            replId: replID,
          })
          .then(({ data }) => {
            toast.success(data.message);
            navigate(`/repl?replId=${user?.username}-${replID}`);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="h-screen bg-slate-950">
      <header className=" bg-slate-900">
        <nav className="py-3 px-6">
          <ul className="flex list-none justify-between">
            <li className="font-bold text-2xl">CodeBlitz</li>
            <li className="">
              <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex justify-center items-center py-2 px-2 text-sm relative bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <HiOutlineUser className={"w-7 h-7 "} />
                </button>
                {dropdownOpen && (
                  <div
                    className="z-50 absolute -translate-x-28 translate-y-24 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                    id="user-dropdown"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        {user?.username}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {user?.email}
                      </span>
                    </div>
                    <ul className="py-2 " aria-labelledby="user-menu-button ">
                      <li onClick={signout}>
                        <button className=" w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex justify-center py-8 px-5 mt-20 max-h-[60vh]">
        <section className=" pl-24 rounded py-5 px-8 w-1/2 h-5/6 flex flex-col gap-5 flex-[0.7]">
          <h1 className="font-bold text-4xl  mb-4">Create New Repl</h1>

          <form className="max-w-sm items-start flex flex-col gap-4">
            <div className="mb-1">
              <Space wrap>
                <Select
                  defaultValue="nodejs"
                  style={{
                    width: 200,
                    height: 40,
                  }}
                  onChange={(value) => {
                    console.log(value);
                    setLang(value);
                  }}
                  options={[
                    {
                      value: "nodejs",
                      label: (
                        <span className="flex gap-3 items-center">
                          <Nodejs />
                          Nodejs
                        </span>
                      ),
                    },
                    {
                      value: "java",
                      label: (
                        <span className="flex gap-3 items-center">
                          <Java />
                          Java
                        </span>
                      ),
                    },
                    {
                      value: "python",
                      label: (
                        <span className="flex gap-3 items-center">
                          <Python />
                          Python
                        </span>
                      ),
                    },
                  ]}
                />
              </Space>
            </div>

            {loading ? (
              <ButtonLoading />
            ) : (
              <button
                onClick={createRepl}
                type="button"
                className="text-white flex justify-center gap-2  items-center bg-blue-900 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded text-sm px-5 py-2 mb-2 dark:bg-blue-800 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                <HiOutlinePlus className="text-base" /> CREATE
              </button>
            )}
          </form>
        </section>

        <div className="w-[0.7px] m-h-full bg-slate-900"></div>

        <article className="py-2 px-8 flex-1 max-h-full ">
          <h2 className="text-xl font-semibold mb-4 ">Recent Repls</h2>
          <div className="flex flex-col overflow-y-auto max-h-[85%]">
            {repls.map((repl) => {
              return (
                <div className="transition py-2 px-4 flex rounded gap-8 items-center hover:bg-slate-800 cursor-pointer">
                  {switchLangIcon(repl.lang)}
                  <div className="ml-5">
                    <p className="text-base">{repl.replId}</p>
                    <span className="text-sm text-slate-400">
                      {new Date(repl.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="ml-auto flex gap-4">
                    <HiOutlineTrash
                      className="text-lg text-red-500 hover:text-red-600"
                      title="delete"
                      onClick={() => {
                        handleDeleteRepl(repl._id);
                      }}
                    />
                    <Fork onClick={()=>forkRepl(repl.replId)} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </main>
    </div>
  );
};

export default Project;
