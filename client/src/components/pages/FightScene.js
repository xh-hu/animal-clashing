import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./FightScene.css";

global.pointCalc = (items, avatar) => {
    const propertyPointMap = {
        "animal": 950,
        "athlete": 1050,
        "dancer": 1000,
        "musician": 950,
        "royal": 1100,
        "scholar": 1000,
        "special": 900,
        "viking": 1050,
    }

    let points = 0;
    let countMap = new Map([
        ["animal", 0],
        ["athlete", 0],
        ["dancer", 0],
        ["musician", 0],
        ["royal", 0],
        ["scholar", 0],
        ["special", 0],
        ["viking", 0],
    ]);
    for (const item of items) {
        countMap.set(item.property, countMap.get(item.property)+1);
    }
    console.log(countMap);
    let countList = [];
    countMap.forEach((value, key, map) => {
        countList.push({"property": key, "count": value});
    });
    countList.sort((a, b) => {
        if (a.count === b.count) {
            return propertyPointMap[a.property] < propertyPointMap[b.property] ? 1 : propertyPointMap[a.property] > propertyPointMap[b.property] ? -1 : 0;
        }
        return a.count < b.count ? 1 : -1;
    });
    for (let i = 0; i < countList.length; i++) {
        if (i === 0) {
            points += countList[i].count * propertyPointMap[countList[i].property];
        } else {
            points += countList[i].count * propertyPointMap[countList[i].property] / 2;
        }
    }
    if (avatar === "bunny" && items[1].name === "sword" && items[1].property === "special") points *= 1.5;
    else if (avatar === "cat" && items[0].name === "helmet" && items[0].property === "animal") points *= 1.5;
    else if (avatar === "deer" && items[4].name === "boots" && items[4].property === "animal") points *= 1.5;
    else if (avatar === "dog" && items[1].name === "sword" && items[1].property === "animal") points *= 1.5;
    else if (avatar === "fox" && items[3].name === "armor" && items[3].property === "special") points *= 1.5;
    else if (avatar === "otter" && items[2].name === "shield" && items[2].property === "animal") points *= 1.5;
    else if (avatar === "tiger" && items[3].name === "armor" && items[3].property === "animal") points *= 1.5;
    else if (avatar === "wolf" && items[2].name === "shield" && items[2].property === "special") points *= 1.5;

    if (items[4].name === "boots" && items[4].property === "special") points *= 1.2;
    else if (items[0].name === "helmet" && items[0].property === "special") points *= 0.8;

    return points;
}

const FightScene = (props) => {
    const {myState, allStates, setBattle, setWinState} = props ? props : useLocation().state;
    const navigate = useNavigate();

    setBattle(false);
    useEffect(() => {
        if (myState) {
            setTimeout(() => {
                let maxScore = 0;
                let winner = null;
                for (const state of allStates) {
                    const score = pointCalc(state.items, state.avatar);
                    if (score > maxScore) {
                        winner = state;
                        maxScore = score;
                    }
                }
                setWinState(winner);
                navigate("/resultScene", { state: { myState: myState, winState: winner } });
            }, 3000);
        }
    }, [])

    return (
        <>
        <div className="FightScene-container">
            {allStates ? <>
                <h1>FIGHT FIGHT FIGHT!</h1>
                {allStates.map((state) =>
                    <div className="FightScene-column">
                        {state.name}
                        <img src={imgMap[state.avatar]} className="FightScene-oppImage FightScene-avatar"/>
                        <img src={imgMap[state.items[0].name + "_" + state.items[0].property]} className="FightScene-oppImage FightScene-helmet"/>
                        <img src={imgMap[state.items[1].name + "_" + state.items[1].property]} className="FightScene-oppImage FightScene-sword"/>
                        <img src={imgMap[state.items[2].name + "_" + state.items[2].property]} className="FightScene-oppImage FightScene-shield"/>
                        <img src={imgMap[state.items[3].name + "_" + state.items[3].property]} className="FightScene-oppImage FightScene-armor"/>
                        <img src={imgMap[state.items[4].name + "_" + state.items[4].property]} className="FightScene-oppImage FightScene-boots"/>
                    </div>
                )}
            </> : "Luckily you're exempted!"}
        </div>
        </>
    );
  };
  
  export default FightScene;
  