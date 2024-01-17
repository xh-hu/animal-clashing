import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./LobbyBlock.css";

function LobbyBlock(props) {
    const {lobby, addToLobby} = props;
    return (
        <Link to="/lobby">
            <button onClick={() => {addToLobby(lobby)}} className="LobbyBlock-container">
                Lobby {lobby.name}: {lobby.users.length}/4
            </button>
        </Link>
    );
}

export default LobbyBlock;