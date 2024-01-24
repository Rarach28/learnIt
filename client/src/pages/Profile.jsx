import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axios, axi_url } from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get(axi_url + "api/user", { withCredentials: true })
      .then((response) => {
        setUser(response.user);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUser({
      username: user.username,
      email: user.email,
      password: "", // You might want to include the current password for validation
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform the axios request to update the user with editedUser data
    axios
      .put(axi_url + "api/user", editedUser, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.user);
        setEditMode(false);
      })
      .catch((error) => console.error(error));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full font-semibold text-4xl text-start">
            Profile
          </div>
          {editMode ? (
            <p className="pb-2">Editing your profile</p>
          ) : (
            <p className="pb-2">Viewing your profile</p>
          )}
        </div>
        <div className="card-body">
          <div className="max-w-md mx-auto">
            {" "}
            {/* Centered container */}
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="">
                  <label className="flex justify-between align-center items-center mb-2">
                    Username:
                    <input
                      className="input text-black !bg-slate-400 ml-2"
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label className="flex justify-between align-center items-center mb-2">
                    Email:
                    <input
                      className="input text-black !bg-slate-400 ml-2"
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label className="flex justify-between align-center items-center mb-2">
                    Password:
                    <input
                      className="input text-black !bg-slate-400 ml-2"
                      type="password"
                      name="password"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="btn btn-secondary !text-black ml-2"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="card-title">{user.username}</h2>
                <p className="card-subtitle">{user.email}</p>
              </>
            )}
          </div>
        </div>
        <div className="card-actions">
          {!editMode && (
            <button className="btn btn-primary" onClick={handleEditClick}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
