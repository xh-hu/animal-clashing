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

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
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
    (lobbies.filter((lobby) => lobby.users.length === 0)).map((lobby) => Lobby.findOneAndDelete({name: lobby.name}));
  });
})

router.get("/mylobby", auth.ensureLoggedIn, (req, res) => {
  Lobby.findOne({users: req.body.user}).then((lobby) => {
    res.send(lobby);
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
    if (lobby.users[i].googleid === req.body.user.googleId) {
      ind = i;
      break;
    }
  }
  if (ind !== -1) {
    const tempList = [...lobby.users.slice(0, ind), ...lobby.users.slice(ind+1)];
    const updatedLobby = await Lobby.findOneAndUpdate(
      { name: req.body.lobbyName},
      { $set: { users: tempList }},
      { new: true}
    );
    res.send(updatedLobby);
  } else {
    res.send({errMsg: "Already removed."});
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
