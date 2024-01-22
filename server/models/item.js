const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: String,
    property: String,
})

module.exports = mongoose.model("item", ItemSchema);