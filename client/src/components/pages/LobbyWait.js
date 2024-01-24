import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserBlock from "../modules/UserBlock";

import "./LobbyWait.css";

import { get, post } from "../../utilities";

const LobbyWait = (props) => {
    const {myLobby, removeFromLobby, myState} = props;
    const navigate = useNavigate();
    return (
        <>
            
            <div className="textAlign">
                <button onClick={() => {
                    removeFromLobby(myLobby);
                    navigate("/lobbyfind");
                }} className="LobbyWait-back">BACK</button>
            </div>
            <div className="LobbyWait-container">
                {myLobby ? <>
                    <h1>LOBBY {myLobby.name}</h1>
                    <div className="LobbyWait-box">
                        {myLobby.users ? myLobby.users.map((user) => 
                            <UserBlock
                                username={user.name}
                            />
                        ) : "No users in lobby"}
                    </div>
                    {myLobby.users.length > 1 ? <button onClick={() => {
                        post("/api/startgame", {lobby: myLobby});
                    }} className="LobbyWait-button">START</button> : <div/>}
                </> : "You are not in a lobby yet! Please return to the main page"}
            </div>
        </>
    );
  };
  
  export default LobbyWait;
  