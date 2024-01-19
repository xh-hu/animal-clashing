import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./FightScene.css";

const FightScene = (props) => {
    const {myState, opponentState, turnsLeft, reportFight, setBattle} = props ? props : useLocation().state;
    const navigate = useNavigate();

    setBattle(false);
    useEffect(() => {
        setTimeout(() => {
            const myScore = 2000;
            const opponentScore = 1000;
            console.log("reporting")
            reportFight(myState, myScore > opponentScore);
            navigate("/resultScene", { state: { myState: myState, turnsLeft: turnsLeft} });
        }, 2000)
    }, [])

    return (
        <>
        <div className="FightScene-container">
            {opponentState ? <>
                <h1>FIGHT FIGHT FIGHT!</h1>
                <div className="FightScene-column">
                    {myState.name}
                    {myState.avatar}
                </div>
                <div className="FightScene-column">
                    {opponentState.name}
                    {opponentState.avatar}
                </div>
            </> : "Luckily you're exempted!"}
        </div>
        </>
    );
  };
  
  export default FightScene;
  