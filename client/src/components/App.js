import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
  const [lobbies, setLobbies] = useState([]);
  const [myLobby, setMyLobby] = useState(null);
  const [myState, setMyState] = useState(null);

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

  useEffect(() => {
    socket.once("createLobby", (lobby) => {
      console.log("Create lobby " + lobby.name);
      setLobbies([...lobbies, lobby])
      return () => {
        socket.off("createLobby");
      }
    })
  })

  useEffect(() => {
    socket.once("addToLobby", (lobby) => {
      console.log("Add to lobby " + lobby.name);
      let ind = -1;
      for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].name === lobby.name) {
          ind = i;
          break;
        }
      }
      if (ind !== -1) {
        const tempList = [...lobbies.slice(0, ind), lobby, ...lobbies.slice(ind+1)];
        setLobbies(tempList);
      }
      if (myLobby) {
        if (myLobby.name === lobby.name) {
          setMyLobby(lobby);
        }
      }
      return () => {
        socket.off("addToLobby");
      }
    })
  })

  useEffect(() => {
    socket.once("removeFromLobby", (lobby) => {
      if (lobby) {
        console.log("Remove from lobby " + lobby.name);
        let ind = -1;
        for (let i = 0; i < lobbies.length; i++) {
          if (lobbies[i].name === lobby.name) {
            ind = i;
            break;
          }
        }
        if (ind !== -1) {
          const tempList = [...lobbies.slice(0, ind), lobby, ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        }
        if (myLobby) {
          if (myLobby.name === lobby.name) {
            setMyLobby(lobby);
          }
        }
        return () => {
          socket.off("removeFromLobby");
        }
      }
    })
  })

  useEffect(() => {
    socket.once("startGame", (state) => {
      console.log("Starting game!");
      setMyState(state);
      return () => {
        socket.off("startGame");
      }
    })
  })

  useEffect(() => {
    socket.once("readyForNext", (state) => {
      console.log("Ready for next round");
      setMyState(state);
      return () => {
        socket.off("readyForNext");
      }
    })
  })

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
        let ind = -1;
        for (let i = 0; i < lobbies.length; i++) {
          if (lobbies[i].name === lobby.name) {
            ind = i;
            break;
          }
        }
        if (ind !== -1) {
          const tempList = [...lobbies.slice(0, ind), updatedLobby, ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        }
      }
    })
  }

  function removeFromLobby(lobby) {
    post("/api/removefromlobby", {user: user, lobbyName: lobby.name}).then((updatedLobby) => {
      setMyLobby(null);
      let ind = -1;
      for (let i = 0; i < lobbies.length; i++) {
        if (lobbies[i].name === lobby.name) {
          ind = i;
          break;
        }
      }
      if (ind !== -1) {
        if (lobby.users.length <= 1) {
          const tempList = [...lobbies.slice(0, ind), ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        } else {
          const tempList = [...lobbies.slice(0, ind), updatedLobby, ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        }
      }
    })
  }

  function tradeItem(item, state) {
    post("/api/tradeitem", {state: state, item: item}).then((updatedState) => {
      setMyState(updatedState);
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
        element={ myState ? <Navigate to="/gameround" state={{myState: myState}} /> :
          <LobbyWait
            myLobby={myLobby}
            removeFromLobby={removeFromLobby}
            myState={myState}
          />
        }
      />
      <Route
        path="/gameround"
        element={
          <GameRound
            myState={myState}
            tradeItem={tradeItem}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    </>
  );
};

export default App;
