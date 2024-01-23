const mongoose = require("mongoose");
const UserModel = require('./user');

const UserSchema = UserModel.schema;

const AchievementSchema = new mongoose.Schema({
  user: UserSchema,
  gameNo: Number,
  fullSet: [String],
  wonGames: Number,
});

// compile model from schema
module.exports = mongoose.model("achievement", AchievementSchema);