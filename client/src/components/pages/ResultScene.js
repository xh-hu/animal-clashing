import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./ResultScene.css";

const ResultScene = (props) => {
    const {myState, turnsLeft, readyForNext} = props ? props : useLocation().state;

    return (
        <>
        <div className="ResultScene-container">
            {myState.alive ? <>
                <h1>You won!</h1>
            </> : <h1>You lost :&lt</h1>}
            {myState.avatar}
            {!myState.alive || turnsLeft === 0 ? <div className="textAlign">
                <Link to="/">
                    <button className="ResultScene-button">HOME</button>
                </Link>
            </div> : <div className="textAlign">
                <Link to="/gameround">
                    <button onclick={() => {
                        readyForNext(myState);
                    }} className="ResultScene-button">CONTINUE</button>
                </Link>
            </div>}
        </div>
        </>
    );
  };
  
  export default ResultScene;
  