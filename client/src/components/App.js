import React, { useState, useEffect, useRef } from "react";
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
import {LoadScreen, WaitScreen} from "./modules/Loading.js";
import Achievements from "./pages/Achievements.js";
import PointPage from "./pages/PointPage.js";
import GameTutorial from "./pages/GameTutorial.js";
import BackgroundMusic from "../public/general_bgm.mp3"

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [user, setUser] = useState(undefined);
  const [myAchievements, setMyAchievements] = useState(null);
  const [lobbies, setLobbies] = useState([]);
  const [myLobby, setMyLobby] = useState(null);
  const [myState, setMyState] = useState(null);
  const [roundNo, setRoundNo] = useState(1);
  const [receiveModal, setReceiveModal] = useState(false);
  const [allStates, setAllStates] = useState(null);
  const [winState, setWinState] = useState(null);
  const [battle, setBattle] = useState(false);
  const [makingChanges, setMakingChanges] = useState(false);
  const [maxRounds, setMaxRounds] = useState(3);
  const [waiting, setWaiting] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [pause, setPause] = useState(false);
  const [bgm, setBgm] = useState(new Audio(BackgroundMusic));
  const roundDuration = 20;

  const timer = useRef(null);


  useEffect(() => {
    if (!pause) {
      // useRef value stored in .current property
      console.log("AWAWAWAWAWAWA");
      setSeconds(30);
      timer.current = setInterval(() => setSeconds((v) => v - 1), 1000);
    } else {
      clearInterval(timer.current);
    }
    // clear on component unmount
    return () => {
      clearInterval(timer.current);
    };
  }, [pause]);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user) {
        // they are registed in the database, and currently logged in.
        setUser(user);
      }
    });
  }, []);

  useEffect(() => {
    // console.log(bgm.muted);
    bgm.loop = true;
    bgm.muted = false;
    // console.log(bgm.muted);
  }, []);

  useEffect(() => {
    async function getData() {
      get("/api/alllobbies").then((data) => {
        console.log("lobbies");
        setLobbies(data.filter((lobby) => (lobby.users.length > 0)));
      });
      get("/api/mylobby", {user: user}).then((data) => {
        console.log("mylobby");
        setMyLobby(data);
      });
      post("/api/achievements", {user: user}).then((achievement) => {
        console.log(achievement);
        setMyAchievements(achievement);
      })
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
    socket.once("loading", () => {
      console.log("loading...");
      setMakingChanges(true);
      return () => {
        socket.off("loading");
      }
    })
  })

  useEffect(() => {
    socket.once("startGame", (state, playerNo) => {
      console.log("Starting game!");
      setMyLobby(null);
      setMyState(state);
      setRoundNo(1);
      setSeconds(30);
      setMaxRounds(Math.min(playerNo, 5));
      setMakingChanges(false);
      return () => {
        socket.off("startGame");
      }
    })
  })

  useEffect(() => {
    socket.once("readyForNext", (state) => {
      console.log("Ready for next round");
      setMyState(state);
      if (roundNo > 0) {
        setReceiveModal(true);
      } else {
        setPause(false);
      }
      setRoundNo(roundNo+1);
      setMakingChanges(false);
      setWaiting(false);
      return () => {
        socket.off("readyForNext");
      }
    })
  })

  useEffect(() => {
    socket.once("readyForBattle", (state) => {
      console.log("Ready to fight");
      setMyState(state);
      post("/api/getopponent", {state: state}).then((allStates) => {
        console.log("States get?");
        console.log(allStates);
        if (allStates) {
          setAllStates(allStates);
        }
        setBattle(true);
        setWaiting(false);
      })
      return () => {
        socket.off("readyForNext");
      }
    })
  })

  function createLobby() {
    setMakingChanges(true);
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
      setMakingChanges(false);
    })
  }

  function addToLobby(lobby) {
    setMakingChanges(true)
    post("/api/addtolobby", {user: user, lobbyName: lobby.name}).then((updatedLobby) => {
      if (updatedLobby) {
        setMyLobby(updatedLobby);
        setMakingChanges(false);
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
    setMakingChanges(true);
    post("/api/removefromlobby", {user: user, lobbyName: lobby.name}).then((updatedLobby) => {
      setMyLobby(null);
      setMakingChanges(false);
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

  function untradeItem(item, state) {
    post("/api/untradeitem", {state: state, item: item}).then((updatedState) => {
      console.log("untraded!");
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
    setWaiting(true);
    post("/api/readyfornext", {state: state}).then((updatedState) => {
      console.log("readyyyyy");
      console.log(updatedState);
      if (updatedState) {
        setMyState(updatedState);
      }
    })
  }

  function readyForBattle(state) {
    setWaiting(true);
    post("/api/readyforbattle", {state: state}).then((updatedState) => {
      console.log("fightfightfight");
      console.log(updatedState);
      if (updatedState) {
        setMyState(updatedState);
      }
    })
  }

  function deleteState(state) {
    post("/api/addgamestat", {state: state, win: (state.user_id === winState.user_id)}).then((achievement) => {
      setMyAchievements(achievement);
    post("/api/deletestate", {state: state}).then(() => {
      console.log("clearing game state...");
      setMyState(null);
      setBattle(false);
      setRoundNo(1);
      setSeconds(30);
      setAllStates(null);
      setWinState(null);
    })
    })
  }

  function completeTutorial(user) {
    post("/api/tutorialcomplete", {user: user}).then((achievement) => {
      setMyAchievements(achievement);
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
    <div>
    {makingChanges ? <LoadScreen /> : <div/>}
    {waiting ? <WaitScreen /> : <div/>}
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
            tutorial={myAchievements ? myAchievements.tutorial : false}
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
        path="/pointpage"
        element={
          <PointPage />
        }
      />
      <Route
        path="/achievements"
        element={
          <Achievements
            myAchievements={myAchievements}
          />
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
        element={ battle ? <Navigate to="/fightscene" state={{myState: myState, allStates: allStates}} /> : 
          <GameRound
            myState={myState}
            tradeItem={tradeItem}
            untradeItem={untradeItem}
            receiveItem={receiveItem}
            readyForNext={readyForNext}
            readyForBattle={readyForBattle}
            roundNo={roundNo}
            maxRounds={maxRounds}
            receiveModal={receiveModal}
            setReceiveModal={setReceiveModal}
            setMyAchievements={setMyAchievements}
            seconds={seconds}
            setSeconds={setSeconds}
            pause={pause}
            setPause={setPause}
            currentTimer={timer.current}
            bgm={bgm}
          />
        }
      />
      <Route
        path="/fightscene"
        element={
          <FightScene
            myState={myState}
            allStates={allStates}
            setBattle={setBattle}
            setWinState={setWinState}
          />
        }
      />
      <Route
        path="/resultscene"
        element={
          <ResultScene
            myState={myState}
            winState={winState}
            deleteState={deleteState}
            setMyAchievements={setMyAchievements}
          />
        }
      />
      <Route
        path="/gametutorial"
        element={
          <GameTutorial
            user={user}
            completeTutorial={completeTutorial}
            bgm={bgm}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </div>
    </div>
  );
};

export default App;
