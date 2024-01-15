import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
// import Skeleton from "./pages/Skeleton.js";
import StartScreen from "./pages/StartScreen.js";
import Help from "./pages/Help.js";
import LobbyFind from "./pages/LobbyFind.js";

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
    <div className="appContainer">
    <Routes>
      <Route
        path="/"
        element={
          <StartScreen
            path="/"
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            userId={userId}
          />
        }
      />
      <Route
        path="/help"
        element={
          <Help />
        }
      />
      <Route
        path="/lobbyfind"
        element={
          <LobbyFind />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    </>
  );
};

export default App;
