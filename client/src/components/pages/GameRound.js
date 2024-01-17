import React from "react";
import { Link } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";

import "../../utilities.css";
import "./GameRound.css";

const GameRound = () => {
    return (
        <>
            <div className="GameRound-roundNo">Round 1/2</div>
            <div className="textAlign">
            <Link to="/">
                <button className="GameRound-manual">Point Manual</button>
            </Link>
            </div>
            <div className="GameRound-container">
                <div className="GameRound-column GameRound-profile">
                    IMAGE HERE
                </div>
                <div className="GameRound-column GameRound-items">
                    <ItemDisplay />
                    <button className="GameRound-button">KEEP</button>
                    <button className="GameRound-button">TRADE</button>
                </div>
            </div>
        </>
    );
  };
  
  export default GameRound;
  