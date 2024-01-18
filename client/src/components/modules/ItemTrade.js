import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import "./ItemTrade.css";

function ItemTrade(props) {
    const {item, state, tradeItem} = props;
    return (
        <button onClick={() => {
            tradeItem(item, state);
        }} className="ItemTrade-container">
            {item.name}: {item.property}
        </button>
    );
}

export default ItemTrade;