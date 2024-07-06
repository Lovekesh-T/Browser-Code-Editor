import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import toast from "react-hot-toast";
import axios from "axios";
import { FormEvent, useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || !username) return;

    try {
      const {
        data: { message },
      } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/create`,
        { email, password, username },
        {
          baseURL: "http://localhost:3000",
          withCredentials: true,
        }
      );

      toast.success(message);
      navigate("/login");
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
              Create Account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <Input
                type="email"
                label="Your email"
                placeholder="name@email.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Input
                type="text"
                label="Your username"
                placeholder="name123"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <Button text="Sign up" onClick={submitHandler} />

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
