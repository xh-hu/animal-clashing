/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Lobby = require("./models/lobby");
const User = require("./models/user");
const Item = require("./models/item");
const State = require("./models/state");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (req.user) {
    res.send(req.user);
  }
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// get list of all available lobbies
router.get("/alllobbies", auth.ensureLoggedIn, (req, res) => {
  Lobby.find({}).then((lobbies) => {
    res.send(lobbies);
    // clear empty lobbies
    (lobbies.filter((lobby) => lobby.users.length === 0)).map((lobby) => Lobby.findOneAndRemove({name: lobby.name}));
  });
})

router.get("/mylobby", auth.ensureLoggedIn, (req, res) => {
  Lobby.findOne({users: req.body.user}).then((lobby) => {
    if (lobby) {
      res.send(lobby);
    }
  });
})

// generates random string of capitals length 5
const randomCharString = () => {
  let res = "";
  for (let i = 0; i < 5; i++) {
    res += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  return res;
}

// create a new lobby with user
router.post("/createlobby", auth.ensureLoggedIn, async (req, res) => {
  // generate unique lobby name
  const newName = randomCharString();
  const lobby = await Lobby.findOne({name: newName});
  while (lobby) {
    newName = randomCharString();
    lobby = await Lobby.findOne({name: newName});
  }
  const newLobby = new Lobby({
    name: newName,
    users: [req.body.user]
  });
  await newLobby.save();
  res.send(newLobby);
})

// add user to a lobby
router.post("/addtolobby", auth.ensureLoggedIn, async (req, res) => {
  const lobby = await Lobby.findOne({name: req.body.lobbyName});
  if (lobby) {
    if (!(lobby.users.map((user) => user.googleid)).includes(req.body.user.googleid)) {
      const updatedLobby = await Lobby.findOneAndUpdate(
        { name: req.body.lobbyName},
        { $push: {users: req.body.user}},
        { new: true}
      );
      await socketManager.getIo().emit("addToLobby", updatedLobby);
      res.send(updatedLobby);
    } else {
      res.send({errMsg: "Already in lobby."});
    }
  } else {
    res.status(404).send({ msg: "Lobby not found"});
  }
})

router.post("/removefromlobby", auth.ensureLoggedIn, async (req, res) => {
  const lobby = await Lobby.findOne({name: req.body.lobbyName});
  let ind = -1;
  if (lobby == null) {
    res.send({ errMsg: "Lobby not found" });
    return;
  }
  for (let i = 0; i < lobby.users.length; i++) {
    if (lobby.users[i].googleid === req.body.user.googleid) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    const tempList = [...lobby.users.slice(0, ind), ...lobby.users.slice(ind+1)];
    if (tempList.length > 0) {
      const updatedLobby = await Lobby.findOneAndUpdate(
        { name: req.body.lobbyName},
        { $set: { users: tempList }},
        { new: true },
      );
      await socketManager.getIo().emit("removeFromLobby", {oldLobby: lobby, newLobby: updatedLobby});
      res.send(updatedLobby);
    } else {
      await Lobby.findOneAndRemove({ name: req.body.lobbyName});
      await socketManager.getIo().emit("removeFromLobby", {oldLobby: lobby, newLobby: null});
      res.send({});
    }
  } else {
    res.send({errMsg: "Already removed."});
  }
})

// Ref: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

const shuffleItems = async () => {
  const itemTypes = ["helmet", "sword", "shield", "armor", "boots"];
  let resLists = [];
  for (const itemType of itemTypes) {
    let itemList = await Item.find({ name: itemType });
    // console.log(itemList);
    if (itemList) {
      resLists.push(shuffleArray(itemList));
    }
  }
  // console.log(resLists);
  return resLists;
}

router.post("/startgame", auth.ensureLoggedIn, async (req, res) => {
  const lobby = req.body.lobby;
  await Lobby.findOneAndRemove({ name: lobby.name });
  const oppList = shuffleArray(lobby.users.map((user) => user._id));
  // TO REPLACE WITH ITEM RANDOM ASSIGN LOGIC
  const itemLists = await shuffleItems();
  let stateList = []
  for (let i = 0; i < lobby.users.length; i++) {
    const user = lobby.users[i];
    const opp_index = lobby.users.length - 1 - oppList.findIndex((id) => id === user._id);
    const newState = new State({
      name: user.name,
      user_id: user._id,
      googleid: user.googleid,
      lobbyName: lobby.name,
      avatar: "PICTURE HERE",
      alive: true,
      items: itemLists.map((itemList) => itemList[i]),
      trade: new Item({name: "none", property: "none"}),
      receive: new Item({name: "none", property: "none"}),
      readyForNext: false,
      opp_id: oppList[opp_index],
    });
    await newState.save();
    stateList.push(newState);
  }
  await Promise.all(stateList.map(async (state) => {
    socketManager.getSocketFromUserID(state.user_id).emit("startGame", state, lobby.users.length);
  }));
  res.send({});
})

router.post("/readyfornext", auth.ensureLoggedIn, async (req, res) => {
  const lobbyName = req.body.state.lobbyName;
  const newState = await State.findOneAndUpdate(
    { user_id : req.body.state.user_id, lobbyName : lobbyName },
    { $set: {readyForNext: true} },
    { new: true },
  );
  const friendStates = await State.find({lobbyName: lobbyName, alive: true});
  let allPlayersReady = true
  for (let i = 0; i < friendStates.length; i++) {
    if (friendStates[i].user_id === newState.user_id) {
      continue;
    }
    allPlayersReady = (allPlayersReady && friendStates[i].readyForNext);
  }
  if (allPlayersReady) {
    const itemTypes = ["helmet", "sword", "shield", "armor", "boots"];
    for (const itemType of itemTypes) {
      const tradeStates = await State.find({lobbyName: lobbyName, "trade.name": itemTypes});
      console.log(tradeStates);
      for (let i = 0; i < tradeStates.length; i++) {
        await State.findOneAndUpdate(
          { user_id: tradeStates[i].user_id, lobbyName: lobbyName },
          { $set: {
            trade: new Item({name: "none", property: "none"}),
            receive: tradeStates[(i+1) % tradeStates.length].trade,
          } },
        )
      }
    }
    
    let newStateList = [];
    for (let i = 0; i < friendStates.length; i++) {
      const newFriendState = await State.findOneAndUpdate(
        { user_id: friendStates[i].user_id, lobbyName: lobbyName },
        { $set: { readyForNext: false } },
        { new: true },
      );
      newStateList.push(newFriendState);
    }
    console.log(newStateList)
    await Promise.all(newStateList.map(async (state) => {
      socketManager.getSocketFromUserID(state.user_id).emit("readyForNext", state);
    }));
  } else {
    res.send(newState);
  }
})

router.post("/readyforBattle", auth.ensureLoggedIn, async (req, res) => {
  const lobbyName = req.body.state.lobbyName;
  const newState = await State.findOneAndUpdate(
    { user_id : req.body.state.user_id, lobbyName : lobbyName },
    { $set: {readyForBattle: true} },
    { new: true },
  );
  const friendStates = await State.find({lobbyName: lobbyName, alive: true});
  let allPlayersReady = true
  for (let i = 0; i < friendStates.length; i++) {
    if (friendStates[i].user_id === newState.user_id) {
      continue;
    }
    allPlayersReady = (allPlayersReady && friendStates[i].readyForBattle);
  }
  if (allPlayersReady) {
    let newStateList = [];
    const oppList = shuffleArray(friendStates.map((state) => state.user_id));
    for (let i = 0; i < friendStates.length; i++) {
      const opp_index = friendStates.length - 1 - oppList.findIndex((id) => id === friendStates[i].user_id);
      const newFriendState = await State.findOneAndUpdate(
        { user_id: friendStates[i].user_id, lobbyName: lobbyName },
        { $set: { opp_id: oppList[opp_index], readyForBattle: false } },
        { new: true },
      );
      newStateList.push(newFriendState);
    }
    console.log(newStateList)

    await Promise.all(newStateList.map(async (state) => {
      socketManager.getSocketFromUserID(state.user_id).emit("readyForBattle", state);
    }));
  } else {
    res.send(newState);
  }
})

router.post("/tradeitem", auth.ensureLoggedIn, async (req, res) => {
  const tradedItem = req.body.item;
  const newState = await State.findOneAndUpdate(
    { user_id : req.body.state.user_id, lobbyName: req.body.state.lobbyName},
    { $set: {trade: tradedItem} },
    { new: true },
  );
  res.send(newState);
})

router.post("/receiveitem", auth.ensureLoggedIn, async (req, res) => {
  const blankItem = new Item({name: "none", property: "none"});
  const oldItems = req.body.state.items;
  let ind = -1;
  for (let i = 0; i < oldItems.length; i++) {
    if (oldItems[i].name === req.body.state.receive.name) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    const tempList = [...oldItems.slice(0, ind), req.body.state.receive, ...oldItems.slice(ind+1)];
    const newState = await State.findOneAndUpdate(
      { user_id : req.body.state.user_id, lobbyName: req.body.state.lobbyName},
      { $set: {receive: blankItem, items: tempList} },
      { new: true },
    );
    res.send(newState);
  }
})

router.post("/getopponent", auth.ensureLoggedIn, async (req, res) => {
  const oppState = await State.findOne({lobbyName: req.body.state.lobbyName, user_id: req.body.state.opp_id});
  res.send(oppState);
})

router.post("/reportfight", auth.ensureLoggedIn, async (req, res) => {
  const newState = await State.findOneAndUpdate(
    { lobbyName: req.body.state.lobbyName, user_id: req.body.state.user_id },
    { $set: {alive: req.body.win} },
    { new: true }
  );

  const friendStates = await State.find({lobbyName: req.body.state.lobbyName});
  await Promise.all(friendStates.map(async (state) => {
    socketManager.getSocketFromUserID(state.user_id).emit("reportFight", req.body.win);
  }));
  res.send(newState);
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
