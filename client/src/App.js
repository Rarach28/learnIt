import {
  Route,
  Routes,
  BrowserRouter as Router, // Change this line to BrowserRouter
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Logout from "./pages/Logout";
import Sets from "./pages/Sets";
import Test, { CreateTest, FinishTest, ResultTest } from "./pages/Test";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.post(
          "http://localhost:4050",
          {},
          { withCredentials: true }
        );

        const { status, user } = data;

        setUsername(user);

        if (status) {
          // toast(`Hello ${user}`, {
          //   position: "top-right",
          // });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying cookie:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Logout = () => {
    navigate("/logout");
  };

  return children({ username, Logout });
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/sets" />} />
        <Route
          path="/sets"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <Sets username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        {/* LEARN */}
        <Route
          path="/sets/learn/:id"
          element={
            <AuthWrapper>
              {({ username }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <Learn username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        {/* TEST */}
        <Route
          path="/sets/test/create/:setNumber"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <CreateTest username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        <Route
          path="/sets/test/finish/:runId"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <FinishTest username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        <Route
          path="/sets/test/result/:runId"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <ResultTest username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        <Route
          path="/sets/test/:setNumber"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <Test username={username} />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        <Route
          path="/sets/stats/:id"
          element={
            <AuthWrapper>
              {({ username }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <Stats />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthWrapper>
              {({ username, Logout }) => (
                <>
                  <Sidebar username={username} />
                  <div className="w-full h-screen p-2 overflow-x-auto">
                    <Profile />
                  </div>
                </>
              )}
            </AuthWrapper>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
