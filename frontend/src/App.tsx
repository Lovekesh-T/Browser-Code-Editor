import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Repl from "./pages/Repl";
import Project from "./pages/Project";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userAtom } from "./store/user";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const [{loading,user}, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      setUser({loading:false,user:null})
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(({ data: { data: user } }) => {
        setUser({ loading: false, user });
      })
      .catch(() => {
        setUser({loading:false,user:null});
      });
  }, [setUser]);

  if (loading) return <div>...loading</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute
              isAuthenticated={user !== null ? false : true}
              redirect="/project"
            >
             <Home/>
            </ProtectedRoute>} />
        <Route
          path="/login"
          element={
            <ProtectedRoute
              isAuthenticated={user !== null ? false : true}
              redirect="/project"
            >
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute
              isAuthenticated={user !== null ? false : true}
              redirect="/project"
            >
              <SignUp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/repl"
          element={
            <ProtectedRoute
              isAuthenticated={user !== null ? true : false}
              redirect="/login"
            >
              <Repl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project"
          element={
            <ProtectedRoute
              isAuthenticated={user !== null ? true : false}
              redirect="/login"
            >
              <Project />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  );
};

export default App;
