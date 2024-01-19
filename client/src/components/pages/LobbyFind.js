import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LobbyBlock from "../modules/LobbyBlock";

import "../../utilities.css";
import "./LobbyFind.css";

const LobbyFind = (props) => {
    const {lobbies, createLobby, addToLobby} = props;
    console.log(lobbies);
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
                    {(lobbies && lobbies.length > 0) ? lobbies.map((lobby) => 
                        <LobbyBlock 
                            lobby={lobby}
                            addToLobby={addToLobby}
                        />
                    ) : "No lobbies available yet!"}
                </div>
                {/* <button onClick={() => {window.location.reload()}} className="LobbyFind-button">REFRESH</button> */}
                <Link to="/lobby">
                    <button onClick={() => {createLobby()}} className="LobbyFind-button">CREATE</button>
                </Link>
            </div>
        </>
    );
  };
  
  export default LobbyFind;
  