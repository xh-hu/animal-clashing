import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./ResultScene.css";

const ResultScene = (props) => {
    const {myState, winState, deleteState} = props ? props : useLocation().state;

    const navigate = useNavigate();

    useEffect(() => {
        post("/api/addgamestat", {state: state}).then((achievement) => {
            setMyAchievements(achievement);
        })
    })

    return (
        <>
        <div className="ResultScene-container">
            {winState ? <div>
                <h1>{winState.name} won!</h1>
                <img src={imgMap[winState.avatar]} className="ResultScene-image ResultScene-avatar"/>
                <img src={imgMap[winState.items[0].name + "_" + winState.items[0].property]} className="ResultScene-image ResultScene-helmet"/>
                <img src={imgMap[winState.items[1].name + "_" + winState.items[1].property]} className="ResultScene-image ResultScene-sword"/>
                <img src={imgMap[winState.items[2].name + "_" + winState.items[2].property]} className="ResultScene-image ResultScene-shield"/>
                <img src={imgMap[winState.items[3].name + "_" + winState.items[3].property]} className="ResultScene-image ResultScene-armor"/>
                <img src={imgMap[winState.items[4].name + "_" + winState.items[4].property]} className="ResultScene-image ResultScene-boots"/>
                <div className="textAlign">
                    <button onClick={() => {
                        deleteState(myState);
                        navigate("/");
                    }} className="ResultScene-button">HOME</button>
                </div>
            </div> : <div/> }
        </div>
        </>
    );
  };
  
  export default ResultScene;
  