import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import StartScreen from "./pages/StartScreen.js";
import Help from "./pages/Help.js";
import LobbyFind from "./pages/LobbyFind.js";
import GameRound from "./pages/GameRound.js";
import LobbyWait from "./pages/LobbyWait.js";
import FightScene from "./pages/FightScene.js";
import ResultScene from "./pages/ResultScene.js";

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
  const [turnsLeft, setTurnsLeft] = useState(1);
  const [roundNo, setRoundNo] = useState(1);
  const [receiveModal, setReceiveModal] = useState(false);
  const [opponentState, setOpponentState] = useState(null);
  const [battle, setBattle] = useState(false);
  
  const maxRounds = 1;
  const roundDuration = 20;

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user) {
        // they are registed in the database, and currently logged in.
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    async function getData() {
      get("/api/alllobbies").then((data) => {
        console.log("lobbies")
          setLobbies(data.filter((lobby) => (lobby.users.length > 0)));
      });
      get("/api/mylobby", {user: user}).then((data) => {
        console.log("mylobby");
          setMyLobby(data);
      });
    }
    
    if (user) {
      getData();
    }
  }, [user])

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
    socket.once("removeFromLobby", ({oldLobby, newLobby}) => {
      if (newLobby) {
        console.log("Remove from lobby " + newLobby.name);
        let ind = -1;
        for (let i = 0; i < lobbies.length; i++) {
          if (lobbies[i].name === newLobby.name) {
            ind = i;
            break;
          }
        }
        if (ind !== -1) {
          const tempList = [...lobbies.slice(0, ind), newLobby, ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        }
        if (myLobby) {
          if (myLobby.name === newLobby.name) {
            setMyLobby(newLobby);
          }
        }
      } else {
        console.log("Remove lobby " + oldLobby.name);
        let ind = -1;
        for (let i = 0; i < lobbies.length; i++) {
          if (lobbies[i].name === oldLobby.name) {
            ind = i;
            break;
          }
        }
        if (ind !== -1) {
          const tempList = [...lobbies.slice(0, ind), ...lobbies.slice(ind+1)];
          setLobbies(tempList);
        }
        if (myLobby) {
          if (myLobby.name === oldLobby.name) {
            setMyLobby(null);
          }
        }
      }
      return () => {
        socket.off("removeFromLobby");
      }
    })
  })

  useEffect(() => {
    socket.once("startGame", (state, playerNo) => {
      console.log("Starting game!");
      setMyLobby(null);
      setMyState(state);
      setTurnsLeft(Math.ceil(Math.log2(playerNo)));
      return () => {
        socket.off("startGame");
      }
    })
  })

  useEffect(() => {
    socket.once("readyForNext", (state) => {
      console.log("Ready for next round");
      setMyState(state);
      setRoundNo(roundNo+1);
      setReceiveModal(true);
      return () => {
        socket.off("readyForNext");
      }
    })
  })

  useEffect(() => {
    socket.once("readyForBattle", (state) => {
      console.log("Ready to fight");
      setMyState(state);
      setTurnsLeft(turnsLeft - 1);
      setRoundNo(1);
      post("/api/getopponent", {state: state}).then((oppState) => {
        console.log("Opponent get?");
        console.log(oppState);
        setOpponentState(oppState);
        setBattle(true);
      })
      return () => {
        socket.off("readyForNext");
      }
    })
  })

  useEffect(() => {
    socket.once("reportFight", (win) => {
      console.log("fight win reported: " + win);
      return () => {
        socket.off("reportFight");
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
        // let ind = -1;
        // for (let i = 0; i < lobbies.length; i++) {
        //   if (lobbies[i].name === lobby.name) {
        //     ind = i;
        //     break;
        //   }
        // }
        // if (ind !== -1) {
        //   const tempList = [...lobbies.slice(0, ind), updatedLobby, ...lobbies.slice(ind+1)];
        //   setLobbies(tempList);
        // }
      }
    })
  }

  function removeFromLobby(lobby) {
    post("/api/removefromlobby", {user: user, lobbyName: lobby.name}).then((updatedLobby) => {
      setMyLobby(null);
      // let ind = -1;
      // for (let i = 0; i < lobbies.length; i++) {
      //   if (lobbies[i].name === lobby.name) {
      //     ind = i;
      //     break;
      //   }
      // }
      // if (ind !== -1) {
      //   if (lobby.users.length <= 1) {
      //     const tempList = [...lobbies.slice(0, ind), ...lobbies.slice(ind+1)];
      //     setLobbies(tempList);
      //   } else {
      //     const tempList = [...lobbies.slice(0, ind), updatedLobby, ...lobbies.slice(ind+1)];
      //     setLobbies(tempList);
      //   }
      // }
    })
  }

  function tradeItem(item, state) {
    post("/api/tradeitem", {state: state, item: item}).then((updatedState) => {
      console.log("traded!");
      setMyState(updatedState);
    })
  }

  function receiveItem(state) {
    post("/api/receiveitem", {state: state}).then((updatedState) => {
      console.log("received!");
      setMyState(updatedState);
    })
  }

  function readyForNext(state) {
    post("/api/readyfornext", {state: state}).then((updatedState) => {
      console.log("readyyyyy");
      console.log(updatedState);
      if (updatedState) {
        setMyState(updatedState);
      }
    })
  }

  function readyForBattle(state) {
    post("/api/readyforbattle", {state: state}).then((updatedState) => {
      console.log("fightfightfight");
      console.log(updatedState);
      if (updatedState) {
        setMyState(updatedState);
      }
    })
  }

  function reportFight(state, win) {
    post("/api/reportfight", {win: win, state: state}).then((updatedState) => {
      setMyState(updatedState);
    });
  }

  function deleteState(state) {
    post("/api/deletestate", state).then(() => {
      console.log("clearing game state...");
      setMyState(null);
    })
  }

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUser(user);
      post("/api/initsocket", { socketid: socket.id });
    }, () => {console.error();});
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
        element={ battle ? <Navigate to="/fightscene" state={{myState: myState, opponentState: opponentState}} /> : 
          <GameRound
            myState={myState}
            tradeItem={tradeItem}
            receiveItem={receiveItem}
            readyForNext={readyForNext}
            readyForBattle={readyForBattle}
            roundNo={roundNo}
            receiveModal={receiveModal}
            setReceiveModal={setReceiveModal}
          />
        }
      />
      <Route
        path="/fightscene"
        element={
          <FightScene
            myState={myState}
            opponentState={opponentState}
            turnsLeft={turnsLeft}
            reportFight={reportFight}
            setBattle={setBattle}
          />
        }
      />
      <Route
        path="/resultscene"
        element={
          <ResultScene
            myState={myState}
            turnsLeft={turnsLeft}
            readyForNext={readyForNext}
            deleteState={deleteState}
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
