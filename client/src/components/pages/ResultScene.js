import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./ResultScene.css";

const ResultScene = (props) => {
    const {myState, turnsLeft, readyForNext, deleteState} = props ? props : useLocation().state;

    const navigate = useNavigate();

    useEffect(() => {
        post("/api/addgamestat", {state: state}).then((achievement) => {
            setMyAchievements(achievement);
        })
    })

    return (
        <>
        <div className="ResultScene-container">
            {myState ? <div>
                {myState.alive ? <>
                    <h1>You won!</h1>
                </> : <h1>You lost :&lt;</h1>}
                <img src={imgMap[myState.avatar]} className="ResultScene-image ResultScene-avatar"/>
                <img src={imgMap[myState.items[0].name + "_" + myState.items[0].property]} className="ResultScene-image ResultScene-helmet"/>
                <img src={imgMap[myState.items[1].name + "_" + myState.items[1].property]} className="ResultScene-image ResultScene-sword"/>
                <img src={imgMap[myState.items[2].name + "_" + myState.items[2].property]} className="ResultScene-image ResultScene-shield"/>
                <img src={imgMap[myState.items[3].name + "_" + myState.items[3].property]} className="ResultScene-image ResultScene-armor"/>
                <img src={imgMap[myState.items[4].name + "_" + myState.items[4].property]} className="ResultScene-image ResultScene-boots"/>
                {!myState.alive || turnsLeft === 0 ? <div className="textAlign">
                    <button onClick={() => {
                        deleteState(myState);
                        navigate("/");
                    }} className="ResultScene-button">HOME</button>
                </div> : <div className="textAlign">
                    <button onClick={() => {
                        readyForNext(myState);
                        navigate("/gameround");
                    }} className="ResultScene-button">CONTINUE</button>
                </div>}
            </div> : <div/> }
        </div>
        </>
    );
  };
  
  export default ResultScene;
  