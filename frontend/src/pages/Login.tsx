import { FormEvent, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/user";
import toast from "react-hot-toast";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate()

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) return;

    try {
      const {
        data: { data: token },
      } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        { identifier, password },
        {
          baseURL: "http://localhost:3000",
          withCredentials: true,
        }
      );

      localStorage.setItem("token", token);

      const {
        data: { data: user },
      } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setUser({loading:false,user});

      toast.success("User logged in Successfully");
      navigate("/project")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-slate-950">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          CodeBlitz
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <Input
                type="email"
                label="Your email"
                placeholder="email or username"
                onChange={(e) => setIdentifier(e.target.value)}
                value={identifier}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <Button text="Sign in" onClick={submitHandler} />

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
