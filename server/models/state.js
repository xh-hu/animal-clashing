const mongoose = require("mongoose");
const ItemModel = require("./item");

const ItemSchema = ItemModel.schema;

const StateSchema = new mongoose.Schema({
    name: String,
    user_id: String,
    googleid: String,
    lobbyName: String,
    avatar: String,
    alive: Boolean,
    items: [ItemSchema],
    trade: ItemSchema,
    readyForNext: Boolean,
})

// compile model from schema
module.exports = mongoose.model("state", StateSchema);