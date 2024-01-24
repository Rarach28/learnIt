import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axios, axi_url } from "../api/axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });
  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(
        axi_url + "api/signup",
        { ...inputValue },
        { withCredentials: true }
      );
      const { success, message } = data.data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="bg-primary rounded-md mb-32 md:mb-0  shadow-md max-w-md mx-auto p-6  h-1/2 min-h-[420px]">
        <h2 className="text-2xl font-bold mb-4">Signup Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold ">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold ">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold ">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              className="w-full p-2 border rounded-md mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-accent p-2 rounded-md mt-2"
          >
            Submit
          </button>
          <span className="block mt-2">
            Already have an account?{" "}
            <Link to="/login" className="badge p-3">
              Login
            </Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
