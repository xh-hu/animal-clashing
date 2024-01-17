const mongoose = require("mongoose");
const UserModel = require('./user');

const UserSchema = UserModel.schema;

const LobbySchema = new mongoose.Schema({
  name: String,
  users: [UserSchema],
});

// compile model from schema
module.exports = mongoose.model("lobby", LobbySchema);