import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
// import Skeleton from "./pages/Skeleton.js";
import StartScreen from "./pages/StartScreen.js";
import Help from "./pages/Help.js";
import LobbyFind from "./pages/LobbyFind.js";
import GameRound from "./pages/GameRound.js";
import LobbyWait from "./pages/LobbyWait.js";

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [user, setUser] = useState(undefined);
  const [lobbies, setLobbies] = useState(null);
  const [myLobby, setMyLobby] = useState(null);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user) {
        // they are registed in the database, and currently logged in.
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      get("/api/alllobbies").then((data) => {
        setLobbies(data.filter((lobby) => (lobby.users.length > 0)));
      });
      get("/api/mylobby", {user: user}).then((data) => {
        setMyLobby(data);
      });
    }
  }, [])

  function createLobby() {
    post("/api/createlobby", {user: user}).then((lobby) => {
      if (lobby) {
        if (lobbies) {
          const newLobbies = [...lobbies, lobby];
          setLobbies(newLobbies);
        } else {
          setLobbies([lobby]);
        }
        setMyLobby(lobby);
      }
    })
  }

  function addToLobby(lobby) {
    post("/api/addtolobby", {user: user, lobbyName: lobby.name}).then((updatedLobby) => {
      if (updatedLobby) {
        setMyLobby(updatedLobby);
      }
    })
  }

  function removeFromLobby(lobby) {
    post("/api/removefromlobby", {user: user, lobbyName: lobby.name}).then((updateLobby) => {
      setMyLobby(null);
    })
  }

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUser(undefined);
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
            userId={user ? user._id : null}
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
          <LobbyFind 
            lobbies={lobbies}
            createLobby={createLobby}
            addToLobby={addToLobby}
          />
        }
      />
      <Route
        path="/lobby"
        element={
          <LobbyWait
            myLobby={myLobby}
            removeFromLobby={removeFromLobby}
          />
        }
      />
      <Route
        path="/gameround"
        element={
          <GameRound />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    </>
  );
};

export default App;
