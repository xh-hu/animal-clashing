import React from "react";
import { Link } from "react-router-dom";
import LobbyBlock from "../modules/LobbyBlock";

import "../../utilities.css";
import "./LobbyFind.css";

const LobbyFind = () => {
    return (
        <>
            <div className="textAlign">
            <Link to="/">
                <button className="LobbyFind-back">BACK</button>
            </Link>
            </div>
            <div className="LobbyFind-container">
                <h1>LOBBY SELECT</h1>
                <div className="LobbyFind-box">
                    <LobbyBlock />
                </div>
                <button onClick={() => window.location.reload()} className="LobbyFind-button">REFRESH</button>
                <button className="LobbyFind-button">CREATE</button>
            </div>
        </>
    );
  };
  
  export default LobbyFind;
  