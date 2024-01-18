import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";
import TradeModal from "../modules/TradeModal";

import "./GameRound.css";

import { get, post } from "../../utilities";

const GameRound = (props) => {
    const {myState, tradeItem} = props ? props : useLocation().state;
    console.log(useLocation().state);
    const maxRounds = 5;
    const roundDuration = 20;
    const [roundNo, setRoundNo] = useState(1);
    const [itemList, setItemList] = useState([]);
    const [tradeModal, setTradeModal] = useState(false);
    return (<>
        <div className="GameRound-roundNo">Round {roundNo}/{maxRounds}</div>
        <div className="textAlign">
            <button className="GameRound-manual">Point Manual</button>
        </div>
        <div className="GameRound-container">
        {myState ? <>
            <div className="GameRound-column GameRound-profile">
                {myState.avatar}
                <div className="GameRound-username">{myState.name}</div>
            </div>
            <div className="GameRound-column GameRound-items">
                {myState.items ? myState.items.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                ) : "There was a bug -- please restart the game!"}
                <button onClick={() => {
                    post("/api/readyfornext", {state: myState}).then((updatedState) => {
                        // setRoundNo(roundNo + 1);
                    })
                }} className="GameRound-button">KEEP</button>
                <button onClick={() => {
                    setTradeModal(true);
                    // setRoundNo(roundNo + 1);
                }} className="GameRound-button">TRADE</button>
            </div>
            {tradeModal ? <TradeModal
                tradeModal={tradeModal}
                setTradeModal={setTradeModal}
                itemList={itemList}
                myState={myState}
                tradeItem={tradeItem}
            /> : <div/>}
            </> : "Loading..."}
        </div> 
    </>
    );
  };
  
  export default GameRound;
  