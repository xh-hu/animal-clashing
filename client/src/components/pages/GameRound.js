import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";
import TradeModal from "../modules/TradeModal";
import ReceiveModal from "../modules/ReceiveModal";

import "./GameRound.css";

import { get, post } from "../../utilities";

const GameRound = (props) => {
    const {myState, tradeItem, receiveItem, readyForNext, readyForBattle, roundNo, receiveModal, setReceiveModal} = props ? props : useLocation().state;
    console.log(myState);
    const [tradeModal, setTradeModal] = useState(false);

    const maxRounds = 1;
    const roundDuration = 20;
    
    return (<>
        <div className="GameRound-roundNo">{roundNo > maxRounds ? "Preparing for battle" : <>Round {roundNo}/{maxRounds}</>}</div>
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
                {roundNo > maxRounds ? <button onClick={() => {
                    readyForBattle(myState);
                }} className="GameRound-button"> FIGHT! </button> : <>
                    <button onClick={() => {
                        readyForNext(myState, false);
                    }} className="GameRound-button">KEEP</button>
                    <button onClick={() => {
                        setTradeModal(true);
                    }} className="GameRound-button">TRADE</button>
                </>}
            </div>
            {tradeModal ? <TradeModal
                setTradeModal={setTradeModal}
                myState={myState}
                tradeItem={tradeItem}
                readyForNext={readyForNext}
            /> : <div/>}
            {receiveModal ? <ReceiveModal
                setReceiveModal={setReceiveModal}
                myState={myState}
                roundNo={roundNo}
                receiveItem={receiveItem}
            /> : <div/>}
            </> : "Loading..."}
        </div> 
    </>
    );
  };
  
  export default GameRound;
  