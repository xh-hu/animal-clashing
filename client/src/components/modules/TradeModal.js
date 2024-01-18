import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ItemTrade from "./ItemTrade";

import "./TradeModal.css";

import { get, post } from "../../utilities";

function TradeModal(props) {
    const {tradeModal, setTradeModal, itemList, myState, tradeItem} = props;
    return (
        <div className="TradeModal-container">
            <div className="TradeModal-text">Which of the items would you like to trade?</div>
            {itemList ? itemList.map((item) => {
                <ItemTrade 
                    item={item}
                    state={myState}
                    tradeItem={tradeItem}
                />
            }) : "No items registered -- there may have been a bug."}
            <button onClick={() => {
                setTradeModal(false);
                post("/api/readyfornext", {state: myState});
            }} className="TradeModal-tradeButton">TRADE</button>
        </div>
    );
}

export default TradeModal;