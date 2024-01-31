import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LobbyBlock from "../modules/LobbyBlock";

import "../../utilities.css";
import "./LobbyFind.css";

const LobbyFind = (props) => {
    const {lobbies, createLobby, addToLobby} = props;
    const navigate = useNavigate();
    // console.log(lobbies);
    return (
        <>
            <div className="textAlign">
                <button onClick={() => {
                    navigate("/")
                }} className="LobbyFind-back">BACK</button>
            </div>
            <div className="LobbyFind-container">
                <h1 className="LobbyFind-heading">LOBBY SELECT</h1>
                <div className="LobbyFind-box">
                    {(lobbies && lobbies.length > 0) ? lobbies.map((lobby) => 
                        <LobbyBlock 
                            lobby={lobby}
                            addToLobby={addToLobby}
                        />
                    ) : "No lobbies available yet!"}
                </div>
                {/* <button onClick={() => {window.location.reload()}} className="LobbyFind-button">REFRESH</button> */}
                <button onClick={() => {
                    createLobby();
                    navigate("/lobby");
                }} className="LobbyFind-button">CREATE</button>
            </div>
        </>
    );
  };
  
  export default LobbyFind;
  