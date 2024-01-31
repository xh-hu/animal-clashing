import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";
import PointManual from "../modules/PointManual";
import RulesManual from "../modules/RulesManual";
import TutorialModal from "../modules/TutorialModal";

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
    const {item, traded ,setTraded} = props;
    return (
        <div className="ItemTrade-container">
            {item.name === "helmet" ? (traded ? <button className="ItemTrade-untradeButton">
                {item.name}: {item.property}
            </button> : <button onClick={() => {
                setTraded(true);
            }} className="ItemTrade-tradeButton">
                {item.name}: {item.property}
            </button>) : <button className="ItemTrade-tradeButton">{item.name}: {item.property}</button>}
        </div>
    );
}

function TradeModal(props) {
    const {setTradeModal, items, setReceiveModal, setPostTrade} = props;
    const [traded, setTraded] = useState(false);
    return (
        <div className="TradeModal-container">
            <button className="TradeModal-back">X</button>
            <div className="TradeModal-text">Which of the items would you like to trade?</div>
            <div className="TradeModal-items">
                {items ? items.map((item) => 
                    <ItemTrade 
                        item={item}
                        traded={traded}
                        setTraded={setTraded}
                    /> 
                ) : "No items registered -- there may have been a bug."}
            </div>
            <button onClick={() => {
                if (traded) {
                    setTradeModal(false);
                    setReceiveModal(true);
                    setPostTrade(true);
                }
            }} className="TradeModal-tradeButton">TRADE</button>
        </div>
    );
}

function ReceiveModal(props) {
    const {setReceiveModal, setPostReceive} = props;
    return (
        <div className="ReceiveModal-container">
            { <div>
                <div className="ReceiveModal-text">You got...</div>
                <div className="ReceiveModal-itemtext">helmet: viking</div>
            </div> }
            <button onClick={() => {
                setReceiveModal(false);
                setPostReceive(true);
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
    const [rulesManual, setRulesManual] = useState(false);
    const [postReceive, setPostReceive] = useState(false);
    const [postTrade, setPostTrade] = useState(false);
    const [receiveModal, setReceiveModal] = useState(false);
    const [fight, setFight] = useState(false);

    const [modal9, setModal9] = useState(false);
    const navigate = useNavigate();
    
    return (<>
        <button onClick={() => {
            completeTutorial(user);
            navigate("/");
        }} className="GameTutorial-skip">SKIP TUTORIAL</button>
        <div className="GameTutorial-roundNo">{postReceive ? "Preparing for battle" : <div>Round 1/1</div>}</div>
        <div className="GameTutorial-time">Time left: 45</div>
        <div className="textAlign">
            <button onClick={() => {}} className="GameTutorial-pointmanual">Point Manual</button>
        </div>
        <div className="textAlign">
            <button onClick={() => {}} className="GameTutorial-rules">Rules Manual</button>
        </div>
        <div className="GameTutorial-container">
        {user ? <>
            <div className="GameTutorial-column GameTutorial-profile">
                <img src={imgMap["bunny"]} className="GameTutorial-image GameTutorial-avatar"/>
                <img src={postReceive ? imgMap["helmet_viking"] : imgMap["helmet_special"]} className="GameTutorial-image GameTutorial-helmet"/>
                <img src={imgMap["sword_viking"]} className="GameTutorial-image GameTutorial-sword"/>
                <img src={imgMap["shield_viking"]} className="GameTutorial-image GameTutorial-shield"/>
                <img src={imgMap["armor_viking"]} className="GameTutorial-image GameTutorial-armor"/>
                <img src={imgMap["boots_viking"]} className="GameTutorial-image GameTutorial-boots"/>
                <div className="GameTutorial-username">{user.name}</div>
                <div className="GameTutorial-character">Character: bunny</div>
                <div className="GameTutorial-points">
                    Total Points: {pointCalc((postReceive ? itemsAfter : itemsBefore), "bunny")}
                </div>
            </div>
            <div className="GameTutorial-column GameTutorial-items">
                {postReceive ? itemsAfter.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                ) : itemsBefore.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                )}
                <div className="GameTutorial-multiplierbox">
                    {!postReceive ?
                        <div className="GameTutorial-multiplier">
                            <div><b>Clown: all points x0.8</b></div>
                            <div><i>Can anyone really take you seriously like that?</i></div>
                        </div>
                    : <div/>}
                </div>
                {postReceive ? <button onClick={() => {
                    if (!tradeModal && !receiveModal) {
                        setFight(true);
                    }
                }} className="GameTutorial-button"> FIGHT! </button> : <>
                    <button className="GameTutorial-button">KEEP</button>
                    <button onClick={() => {
                        if (!tradeModal && !receiveModal && modal9) {
                            setTradeModal(true);
                        }
                    }} className="GameTutorial-button">TRADE</button>
                </>}
            </div>
            <TutorialModal
                postTrade={postTrade}
                postReceive={postReceive}
                receiveModal={receiveModal}
                fight={fight}
                modal9={modal9}
                setModal9={setModal9}
            />
            {tradeModal ? <TradeModal
                setTradeModal={setTradeModal}
                items={itemsBefore}
                setReceiveModal={setReceiveModal}
                setPostTrade={setPostTrade}
            /> : <div/>}
            {receiveModal ? <ReceiveModal
                setReceiveModal={setReceiveModal}
                setPostReceive={setPostReceive}
            /> : <div/>}
            {pointManual ? <PointManual 
                setPointManual={setPointManual}
            /> : <div/>}
            {rulesManual ? <RulesManual 
                setRulesManual={setRulesManual}
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
  