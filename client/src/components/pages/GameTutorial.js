import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";
import PointManual from "../modules/PointManual";

import "./GameTutorial.css";
import "./FightScene.css"
import "./ResultScene.css"
import "./../modules/TradeModal.css";
import "./../modules/ItemTrade.css";
import "./../modules/ReceiveModal.css";

const itemsBefore = [
    {name: "helmet", property: "special"},
    {name: "sword", property: "viking"},
    {name: "shield", property: "viking"},
    {name: "armor", property: "viking"},
    {name: "boots", property: "viking"},
];
const itemsAfter = [
    {name: "helmet", property: "viking"},
    {name: "sword", property: "viking"},
    {name: "shield", property: "viking"},
    {name: "armor", property: "viking"},
    {name: "boots", property: "viking"},
]

function ItemTrade(props) {
    const {item} = props;
    const [traded, setTraded] = useState(false);
    return (
        <div className="ItemTrade-container">
            {item.name === "helmet" ? (traded ? <button className="ItemTrade-untradeButton">
                {item.name}: {item.property}
            </button> : <button onClick={() => {
                setTraded(true);
            }} className="ItemTrade-tradeButton">
                {item.name}: {item.property}
            </button>) : <div className="ItemTrade-tradeButton">{item.name}: {item.property}</div>}
        </div>
    );
}

function TradeModal(props) {
    const {setTradeModal, items, setReceiveModal} = props;
    return (
        <div className="TradeModal-container">
            <button className="TradeModal-back">X</button>
            <div className="TradeModal-text">Which of the items would you like to trade?</div>
            <div className="TradeModal-items">
                {items ? items.map((item) => 
                    <ItemTrade 
                        item={item}
                    /> 
                ) : "No items registered -- there may have been a bug."}
            </div>
            <button onClick={() => {
                setTradeModal(false);
                setReceiveModal(true);
            }} className="TradeModal-tradeButton">TRADE</button>
        </div>
    );
}

function ReceiveModal(props) {
    const {setReceiveModal, setPostTrade} = props;
    return (
        <div className="ReceiveModal-container">
            { <div>
                <div className="ReceiveModal-text">You got...</div>
                <div className="ReceiveModal-itemtext">helmet: viking</div>
            </div> }
            <button onClick={() => {
                setReceiveModal(false);
                setPostTrade(true);
            }} className="ReceiveModal-confirmButton"> CONFIRM </button>
        </div>
    );
}

function ResultScene(props) {
    const { user, completeTutorial } = props;
    const navigate = useNavigate();

    return (
        <>
        <div className="ResultScene-container">
            <h1>You won!</h1>
            <img src={imgMap["bunny"]} className="ResultScene-image ResultScene-avatar"/>
            <img src={imgMap["helmet_viking"]} className="ResultScene-image ResultScene-helmet"/>
            <img src={imgMap["sword_viking"]} className="ResultScene-image ResultScene-sword"/>
            <img src={imgMap["shield_viking"]} className="ResultScene-image ResultScene-shield"/>
            <img src={imgMap["armor_viking"]} className="ResultScene-image ResultScene-armor"/>
            <img src={imgMap["boots_viking"]} className="ResultScene-image ResultScene-boots"/>
            <div className="textAlign">
                <button onClick={() => {
                    completeTutorial(user);
                    navigate("/");
                }} className="ResultScene-button">HOME</button>
            </div>
        </div>
        </>
    );
};

function FightScene(props) {
    const {user, completeTutorial} = props;
    const [result, setResult] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setResult(true);
        }, 3000);
    }, [])

    return (!result ?
        <>
        <div className="FightScene-container">
            <h1>FIGHT FIGHT FIGHT!</h1>
            <div className="FightScene-column">
                {user.name}
                <img src={imgMap["bunny"]} className="FightScene-image FightScene-avatar"/>
                <img src={imgMap["helmet_viking"]} className="FightScene-image FightScene-helmet"/>
                <img src={imgMap["sword_viking"]} className="FightScene-image FightScene-sword"/>
                <img src={imgMap["shield_viking"]} className="FightScene-image FightScene-shield"/>
                <img src={imgMap["armor_viking"]} className="FightScene-image FightScene-armor"/>
                <img src={imgMap["boots_viking"]} className="FightScene-image FightScene-boots"/>
            </div>
            <div className="FightScene-column">
                somerandomboi
                <img src={imgMap["otter"]} className="FightScene-oppImage FightScene-avatar"/>
                <img src={imgMap["helmet_athlete"]} className="FightScene-oppImage FightScene-helmet"/>
                <img src={imgMap["sword_athlete"]} className="FightScene-oppImage FightScene-sword"/>
                <img src={imgMap["shield_special"]} className="FightScene-oppImage FightScene-shield"/>
                <img src={imgMap["armor_scholar"]} className="FightScene-oppImage FightScene-armor"/>
                <img src={imgMap["boots_scholar"]} className="FightScene-oppImage FightScene-boots"/>
            </div>
        </div>
        </> : <ResultScene
            user={user}
            completeTutorial={completeTutorial}
        />
    );
};

const GameTutorial = (props) => {
    const {user, completeTutorial} = props ? props : useLocation().state;
    const [tradeModal, setTradeModal] = useState(false);
    const [pointManual, setPointManual] = useState(false);
    const [postTrade, setPostTrade] = useState(false);
    const [receiveModal, setReceiveModal] = useState(false);
    const [fight, setFight] = useState(false);
    
    return (<>
        <button onClick={() => {
            completeTutorial(user);
            navigate("/");
        }} className="GameTutorial-skip">SKIP</button>
        <div className="GameTutorial-roundNo">{postTrade ? "Preparing for battle" : <div>Round 1/1</div>}</div>
        <div>Time left: 20</div>
        <div className="textAlign">
            <button onClick={() => {setPointManual(true);}} className="GameTutorial-manual">Point Manual</button>
        </div>
        <div className="GameTutorial-container">
        {user ? <>
            <div className="GameTutorial-column GameTutorial-profile">
                <img src={imgMap["bunny"]} className="GameTutorial-image GameTutorial-avatar"/>
                <img src={postTrade ? imgMap["helmet_viking"] : imgMap["helmet_special"]} className="GameTutorial-image GameTutorial-helmet"/>
                <img src={imgMap["sword_viking"]} className="GameTutorial-image GameTutorial-sword"/>
                <img src={imgMap["shield_viking"]} className="GameTutorial-image GameTutorial-shield"/>
                <img src={imgMap["armor_viking"]} className="GameTutorial-image GameTutorial-armor"/>
                <img src={imgMap["boots_viking"]} className="GameTutorial-image GameTutorial-boots"/>
                <div className="GameTutorial-username">{user.name}</div>
                <div className="GameTutorial-character">Character: bunny</div>
                <div className="GameTutorial-points">
                    Total Points: {pointCalc((postTrade ? itemsAfter : itemsBefore), "bunny")}
                </div>
            </div>
            <div className="GameTutorial-column GameTutorial-items">
                {postTrade ? itemsAfter.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                ) : itemsBefore.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                )}
                <div className="GameTutorial-multiplierbox">
                    {!postTrade ?
                        <div className="GameTutorial-multiplier">
                            <div><b>Clown: all points x0.8</b></div>
                            <div><i>Can anyone really take you seriously like that?</i></div>
                        </div>
                    : <div/>}
                </div>
                {postTrade ? <button onClick={() => {
                    if (!tradeModal && !receiveModal) {
                        setFight(true);
                    }
                }} className="GameTutorial-button"> FIGHT! </button> : <>
                    <button className="GameTutorial-button">KEEP</button>
                    <button onClick={() => {
                        if (!tradeModal && !receiveModal) {
                            setTradeModal(true);
                        }
                    }} className="GameTutorial-button">TRADE</button>
                </>}
            </div>
            {tradeModal ? <TradeModal
                setTradeModal={setTradeModal}
                items={itemsBefore}
                setReceiveModal={setReceiveModal}
            /> : <div/>}
            {receiveModal ? <ReceiveModal
                setReceiveModal={setReceiveModal}
                setPostTrade={setPostTrade}
            /> : <div/>}
            {pointManual ? <PointManual 
                setPointManual={setPointManual}
            /> : <div/>}
            {fight ? <FightScene
                user={user}
                completeTutorial={completeTutorial}
            /> : <div/>}
            </> : "Loading..."}
        </div> 
    </>
    );
  };
  
  export default GameTutorial;
  