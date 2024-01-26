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
const Achievement = require("./models/achievement");

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
  socketManager.getIo().emit("createLobby", newLobby);
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
  await Promise.all(lobby.users.map((user) => {
    socketManager.getSocketFromUserID(user._id).emit("loading");
  }))
  await Lobby.findOneAndRemove({ name: lobby.name });
  const oppList = shuffleArray(lobby.users.map((user) => user._id));
  // TO REPLACE WITH ITEM RANDOM ASSIGN LOGIC
  const itemLists = await shuffleItems();
  const avatarList = shuffleArray(["bunny", "otter", "cat", "fox", "wolf", "tiger", "deer", "dog"]);
  let stateList = []
  for (let i = 0; i < lobby.users.length; i++) {
    const user = lobby.users[i];
    const opp_index = lobby.users.length - 1 - oppList.findIndex((id) => id === user._id);
    const newState = new State({
      name: user.name,
      user_id: user._id,
      googleid: user.googleid,
      lobbyName: lobby.name,
      avatar: avatarList[i],
      alive: true,
      items: itemLists.map((itemList) => itemList[i]),
      trade: [],
      receive: [],
      readyForNext: false,
      readyForBattle: false,
      opp_id: oppList[opp_index],
    });
    await newState.save();
    stateList.push(newState);
  }
  await Promise.all(stateList.map(async (state) => {
    socketManager.getSocketFromUserID(state.user_id).emit("startGame", state, lobby.users.length);
  }));
  await socketManager.getIo().emit("removeFromLobby", {oldLobby: lobby, newLobby: null});
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
    for (let k = 0; k < itemTypes.length; k++) {
      const itemType = itemTypes[k];
      const tradeStates = await State.find({lobbyName: lobbyName, "trade.name": itemType});
      // let unusedItems = await Item.find({name: itemType, property: {$nin: friendStates.map((state) => state.items[k].property)}});
      // console.log(unusedItems);
      let unusedItems = [];

      for (const state of tradeStates) {
        unusedItems.push(state.items[k]);
      }

      // console.log(unusedItems);

      // console.log(tradeStates);
      for (let i = 0; i < tradeStates.length; i++) {
        console.log(unusedItems);
        let ind = Math.floor(Math.random() * unusedItems.length);
        // jank method so they don't get their own if more than one person
        if (tradeStates[i].items[k].property === unusedItems[ind].property) ind = (ind + 1) % unusedItems.length;
        await State.findOneAndUpdate(
          { user_id: tradeStates[i].user_id, lobbyName: lobbyName },
          { $push: {
            receive: unusedItems[ind],
          } },
        )
        unusedItems.splice(ind, 1);
      }
    }
    
    let newStateList = [];
    for (let i = 0; i < friendStates.length; i++) {
      const newFriendState = await State.findOneAndUpdate(
        { user_id: friendStates[i].user_id, lobbyName: lobbyName },
        { $set: { readyForNext: false, trade: [] } },
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
  const currentTrade = req.body.state.trade
  let ind = -1;
  for (let i = 0; i < currentTrade.length; i++) {
    if (currentTrade[i].name === tradedItem.name) {
      ind = i;
    }
  }
  if (ind !== -1) {
    console.log("already in trade list");
    res.send(req.body.state);
  } else {
    const newState = await State.findOneAndUpdate(
      { user_id : req.body.state.user_id, lobbyName: req.body.state.lobbyName},
      { $push: {trade: tradedItem} },
      { new: true },
    );
    res.send(newState);
  }
})

router.post("/untradeitem", auth.ensureLoggedIn, async (req, res) => {
  const tradedItem = req.body.item;
  const currentTrade = req.body.state.trade
  let ind = -1;
  for (let i = 0; i < currentTrade.length; i++) {
    if (currentTrade[i].name === tradedItem.name) {
      ind = i;
    }
  }
  if (ind !== -1) {
    console.log("untrading");
    const tempList = [...req.body.state.trade.slice(0, ind), ...req.body.state.trade.slice(ind+1)];
    const newState = await State.findOneAndUpdate(
      { user_id : req.body.state.user_id, lobbyName: req.body.state.lobbyName},
      { $set: {trade: tempList} },
      { new: true },
    );
    res.send(newState);
  }
})

router.post("/receiveitem", auth.ensureLoggedIn, async (req, res) => {
  const oldItems = req.body.state.items;
  const receiveItems = req.body.state.receive;
  let tempList = []
  for (let i = 0; i < oldItems.length; i++) {
    let ind = -1;
    for (let j = 0; j < receiveItems.length; j++) {
      if (receiveItems[j].name === oldItems[i].name) {
        ind = j;
      }
    }
    if (ind !== -1) {
      tempList.push(receiveItems[ind]);
    } else {
      tempList.push(oldItems[i]);
    }
  }
  const newState = await State.findOneAndUpdate(
    { user_id : req.body.state.user_id, lobbyName: req.body.state.lobbyName},
    { $set: {receive: [], items: tempList} },
    { new: true },
  );
  res.send(newState);
})

router.post("/getopponent", auth.ensureLoggedIn, async (req, res) => {
  const oppState = await State.findOne({lobbyName: req.body.state.lobbyName, user_id: req.body.state.opp_id});
  if (oppState) {
    res.send(oppState);
  } else {
    res.send({});
  }
})

router.post("/reportfight", auth.ensureLoggedIn, async (req, res) => {
  if (req.body.state) {
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
  }
})

router.post("/deletestate", auth.ensureLoggedIn, async (req, res) => {
  await State.findOneAndRemove({user_id: req.body.state.user_id, lobbyName: req.body.state.lobbyName});
  res.send({});
})

router.post("/achievements", auth.ensureLoggedIn, async (req, res) => {
  console.log(req.body.user);
  const achievements = await Achievement.findOne({user: req.body.user});
  if (achievements) {
    console.log(achievements);
    res.send(achievements);
  } else {
    const newAchievement = new Achievement({
      user: req.body.user,
      tutorial: false,
      gameNo: 0,
      fullSet: [],
      wonGames: 0,
    });
    await newAchievement.save();
    console.log(newAchievement);
    res.send(newAchievement);
  }
})

router.post("/addfullset", auth.ensureLoggedIn, async (req, res) => {
  const newAchievement = await Achievement.findOneAndUpdate(
    { "user._id": req.body.user_id },
    { $push: { fullSet: req.body.property}},
    { new: true },
  );
  res.send(newAchievement);
})

router.post("/addgamestat", auth.ensureLoggedIn, async (req, res) => {
  const oldAchievement = await Achievement.findOne({ "user._id": req.body.state.user_id });
  // console.log(oldAchievement);
  // console.log(await Achievement.find({}));
  if (oldAchievement) {
    const newAchievement = await Achievement.findOneAndUpdate(
      { "user._id": req.body.state.user_id },
      { $set: { gameNo: oldAchievement.gameNo + 1, wonGames: oldAchievement.wonGames + (req.body.state.alive ? 1 : 0) } },
      { new: true },
    );
    res.send(newAchievement);
  }
})

router.post("/tutorialcomplete", auth.ensureLoggedIn, async (req, res) => {
  const oldAchievement = await Achievement.findOne({ "user._id": req.body.user._id });
  if (oldAchievement) {
    const newAchievement = await Achievement.findOneAndUpdate(
      { "user._id": req.body.user._id },
      { $set: { tutorial: true } },
      { new: true },
    );
    res.send(newAchievement);
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
