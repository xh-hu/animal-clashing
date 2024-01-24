import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./LobbyBlock.css";

function LobbyBlock(props) {
    const {lobby, addToLobby} = props;
    const navigate = useNavigate();

    return (
        <div className="LobbyBlock-container">
            <button onClick={() => {
                if (lobby.users.length < 8) {
                    addToLobby(lobby);
                    navigate("/lobby");
                } else {
                    alert("Lobby is full! Please choose a different one.");
                }
            }} className="LobbyBlock-lobby">
                Lobby {lobby.name}: {lobby.users.length}/8
            </button>
        </div>
    );
}

export default LobbyBlock;