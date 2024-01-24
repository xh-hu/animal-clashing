import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ItemTrade from "./ItemTrade";

import "./TradeModal.css";

import { get, post } from "../../utilities";

function TradeModal(props) {
    const {setTradeModal, myState, tradeItem, readyForNext, tradeHelmet, tradeSword, tradeShield, tradeArmor, tradeBoots, setTradeHelmet, setTradeSword, setTradeShield, setTradeArmor, setTradeBoots} = props;
    let propMap = {
        "helmet": tradeHelmet,
        "sword": tradeSword,
        "shield": tradeShield,
        "armor": tradeArmor,
        "boots": tradeBoots,
    }
    let funcMap = {
        "helmet": setTradeHelmet,
        "sword": setTradeSword,
        "shield": setTradeShield,
        "armor": setTradeArmor,
        "boots": setTradeBoots,
    }
    return (
        <div className="TradeModal-container">
            <button onClick={() => {setTradeModal(false);}} className="TradeModal-back">X</button>
            <div className="TradeModal-text">Which of the items would you like to trade?</div>
            <div className="TradeModal-items">
                {myState.items ? myState.items.map((item) => 
                    <ItemTrade 
                        item={item}
                        state={myState}
                        tradeItem={tradeItem}
                        traded={propMap[item.name]}
                        setTraded={funcMap[item.name]}
                    /> 
                ) : "No items registered -- there may have been a bug."}
            </div>
            <button onClick={() => {
                setTradeModal(false);
                readyForNext(myState);
            }} className="TradeModal-tradeButton">TRADE</button>
        </div>
    );
}

export default TradeModal;