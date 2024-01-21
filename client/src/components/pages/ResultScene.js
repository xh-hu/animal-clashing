import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./ResultScene.css";

const ResultScene = (props) => {
    const {myState, turnsLeft, readyForNext, deleteState} = props ? props : useLocation().state;

    const navigate = useNavigate();

    return (
        <>
        <div className="ResultScene-container">
            {myState.alive ? <>
                <h1>You won!</h1>
            </> : <h1>You lost :&lt</h1>}
            {myState.avatar}
            {!myState.alive || turnsLeft === 0 ? <div className="textAlign">
                <button onClick={() => {
                    deleteState(myState);
                    navigate("/");
                }} className="ResultScene-button">HOME</button>
            </div> : <div className="textAlign">
                <button onclick={() => {
                    readyForNext(myState);
                    navigate("/gameround");
                }} className="ResultScene-button">CONTINUE</button>
            </div>}
        </div>
        </>
    );
  };
  
  export default ResultScene;
  