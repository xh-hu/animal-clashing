import React, { useState, useEffect } from "react";
import { Link, redirect } from "react-router-dom";
import UserBlock from "../modules/UserBlock";

import "./LobbyWait.css";

import { get, post } from "../../utilities";

const LobbyWait = (props) => {
    const {myLobby, removeFromLobby, myState} = props;
    return (
        <>
            
            <div className="textAlign">
            <Link to="/lobbyfind">
                <button onClick={() => {removeFromLobby(myLobby)}} className="LobbyWait-back">BACK</button>
            </Link>
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
                    <Link to="/gameround">
                        <button onClick={() => {
                            post("/api/startgame", {lobby: myLobby});
                        }} className="LobbyWait-button">START</button>
                    </Link>
                </> : "You are not in a lobby yet! Please return to the main page"}
            </div>
        </>
    );
  };
  
  export default LobbyWait;
  