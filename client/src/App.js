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
import { axios, axi_url } from "./api/axios";
import Logout from "./pages/Logout";
import Sets, { SetAdd } from "./pages/Sets";
import Test, { CreateTest, FinishTest, ResultTest } from "./pages/Test";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
        return;
      }

      try {
        const data = await axios.post(
          axi_url + "api",
          {},
          { withCredentials: true }
        );

        const { status } = data;

        if (status) {
          setIsAuthenticated(true);
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

  // Render children only if authenticated
  return isAuthenticated ? children : null;
}

function Layout({ children }) {
  return (
    <>
      <AuthWrapper>
        <>
          <Sidebar />
          <div className="w-full h-screen p-2 overflow-x-auto">{children}</div>
        </>
      </AuthWrapper>
    </>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/sets" />} />
        <Route
          path="/sets"
          element={
            <Layout>
              <Sets />
            </Layout>
          }
        />
        {/* LEARN */}
        <Route
          path="/sets/add/:id"
          element={
            <Layout>
              <SetAdd />
            </Layout>
          }
        />
        <Route
          path="/sets/add/"
          element={
            <Layout>
              <SetAdd />
            </Layout>
          }
        />
        <Route
          path="/sets/learn/:id/:randomOrder"
          element={
            <Layout>
              <Learn />
            </Layout>
          }
        />

        {/* TEST */}
        <Route
          path="/sets/test/create/:setNumber"
          element={
            <Layout>
              <CreateTest />
            </Layout>
          }
        />
        <Route
          path="/sets/test/finish/:runId"
          element={
            <Layout>
              <FinishTest />
            </Layout>
          }
        />
        <Route
          path="/sets/test/result/:runId"
          element={
            <Layout>
              <ResultTest />
            </Layout>
          }
        />
        <Route
          path="/sets/test/:setNumber"
          element={
            <Layout>
              <Test />
            </Layout>
          }
        />
        <Route
          path="/sets/stats/:id"
          element={
            <Layout>
              <Stats />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
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
