import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./LobbyBlock.css";

function LobbyBlock(props) {
    const {lobby, addToLobby} = props;
    const navigate = useNavigate();

    return (
        <div className="LobbyBlock-container">
            <button onClick={() => {
                addToLobby(lobby);
                navigate("/lobby");
            }} className="LobbyBlock-lobby">
                Lobby {lobby.name}: {lobby.users.length}/4
            </button>
        </div>
    );
}

export default LobbyBlock;