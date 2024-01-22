import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./FightScene.css";

const FightScene = (props) => {
    const {myState, opponentState, turnsLeft, reportFight, setBattle} = props ? props : useLocation().state;
    const navigate = useNavigate();

    setBattle(false);
    useEffect(() => {
        if (myState) {
            setTimeout(() => {
                const myScore = 2000;
                const opponentScore = 1000;
                console.log("reporting")
                reportFight(myState, myScore > opponentScore);
                navigate("/resultScene", { state: { myState: myState, turnsLeft: turnsLeft} });
            }, 3000);
        }
    }, [])

    return (
        <>
        <div className="FightScene-container">
            {opponentState ? <>
                <h1>FIGHT FIGHT FIGHT!</h1>
                <div className="FightScene-column">
                    {myState.name}
                    <img src={imgMap[myState.avatar]} className="FightScene-image FightScene-avatar"/>
                    <img src={imgMap[myState.items[0].name + "_" + myState.items[0].property]} className="FightScene-image FightScene-helmet"/>
                    <img src={imgMap[myState.items[1].name + "_" + myState.items[1].property]} className="FightScene-image FightScene-sword"/>
                    <img src={imgMap[myState.items[2].name + "_" + myState.items[2].property]} className="FightScene-image FightScene-shield"/>
                    <img src={imgMap[myState.items[3].name + "_" + myState.items[3].property]} className="FightScene-image FightScene-armor"/>
                    <img src={imgMap[myState.items[4].name + "_" + myState.items[4].property]} className="FightScene-image FightScene-boots"/>
                </div>
                <div className="FightScene-column">
                    {opponentState.name}
                    <img src={imgMap[opponentState.avatar]} className="FightScene-oppImage FightScene-avatar"/>
                    <img src={imgMap[opponentState.items[0].name + "_" + opponentState.items[0].property]} className="FightScene-oppImage FightScene-helmet"/>
                    <img src={imgMap[opponentState.items[1].name + "_" + opponentState.items[1].property]} className="FightScene-oppImage FightScene-sword"/>
                    <img src={imgMap[opponentState.items[2].name + "_" + opponentState.items[2].property]} className="FightScene-oppImage FightScene-shield"/>
                    <img src={imgMap[opponentState.items[3].name + "_" + opponentState.items[3].property]} className="FightScene-oppImage FightScene-armor"/>
                    <img src={imgMap[opponentState.items[4].name + "_" + opponentState.items[4].property]} className="FightScene-oppImage FightScene-boots"/>
                </div>
            </> : "Luckily you're exempted!"}
        </div>
        </>
    );
  };
  
  export default FightScene;
  