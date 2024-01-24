import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import "./ItemTrade.css";

function ItemTrade(props) {
    const {item, state, tradeItem, untradeItem} = props;
    const [traded, setTraded] = useState(false);
    return ( 
        <div className="ItemTrade-container">
            {item ? (traded ? <button onClick={() => {
                setTraded(false);
                untradeItem(item, state);
            }} className="ItemTrade-untradeButton">
                {item.name}: {item.property}
            </button> : <button onClick={() => {
                setTraded(true);
                tradeItem(item, state);
            }} className="ItemTrade-tradeButton">
                {item.name}: {item.property}
            </button>) : <div/>}
        </div>
    );
}

export default ItemTrade;