import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ItemDisplay from "../modules/ItemDisplay";
import TradeModal from "../modules/TradeModal";
import ReceiveModal from "../modules/ReceiveModal";

import "./GameRound.css";

import { get, post } from "../../utilities";

// Brute force importing all images
import armorAnimal from "../../public/assets/armor_animal.png"
import armorAthlete from "../../public/assets/armor_athlete.png"
import armorDancer from "../../public/assets/armor_dancer.png"
import armorMusician from "../../public/assets/armor_musician.png"
import armorRoyal from "../../public/assets/armor_royal.png"
import armorScholar from "../../public/assets/armor_scholar.png"
import armorSpecial from "../../public/assets/armor_special.png"
import armorViking from "../../public/assets/armor_viking.png"
import bootsAnimal from "../../public/assets/boots_animal.png"
import bootsAthlete from "../../public/assets/boots_athlete.png"
import bootsDancer from "../../public/assets/boots_dancer.png"
import bootsMusician from "../../public/assets/boots_musician.png"
import bootsRoyal from "../../public/assets/boots_royal.png"
import bootsScholar from "../../public/assets/boots_scholar.png"
import bootsSpecial from "../../public/assets/boots_special.png"
import bootsViking from "../../public/assets/boots_viking.png"
import helmetAnimal from "../../public/assets/helmet_animal.png"
import helmetAthlete from "../../public/assets/helmet_athlete.png"
import helmetDancer from "../../public/assets/helmet_dancer.png"
import helmetMusician from "../../public/assets/helmet_musician.png"
import helmetRoyal from "../../public/assets/helmet_royal.png"
import helmetScholar from "../../public/assets/helmet_scholar.png"
import helmetSpecial from "../../public/assets/helmet_special.png"
import helmetViking from "../../public/assets/helmet_viking.png"
import shieldAnimal from "../../public/assets/shield_animal.png"
import shieldAthlete from "../../public/assets/shield_athlete.png"
import shieldDancer from "../../public/assets/shield_dancer.png"
import shieldMusician from "../../public/assets/shield_musician.png"
import shieldRoyal from "../../public/assets/shield_royal.png"
import shieldScholar from "../../public/assets/shield_scholar.png"
import shieldSpecial from "../../public/assets/shield_special.png"
import shieldViking from "../../public/assets/shield_viking.png"
import swordAnimal from "../../public/assets/sword_animal.png"
import swordAthlete from "../../public/assets/sword_athlete.png"
import swordDancer from "../../public/assets/sword_dancer.png"
import swordMusician from "../../public/assets/sword_musician.png"
import swordRoyal from "../../public/assets/sword_royal.png"
import swordScholar from "../../public/assets/sword_scholar.png"
import swordSpecial from "../../public/assets/sword_special.png"
import swordViking from "../../public/assets/sword_viking.png"

import bunny from "../../public/assets/bunny.png"
import cat from "../../public/assets/cat.png"
import deer from "../../public/assets/deer.png"
import dog from "../../public/assets/dog.png"
import fox from "../../public/assets/fox.png"
import otter from "../../public/assets/otter.png"
import tiger from "../../public/assets/tiger.png"
import wolf from "../../public/assets/wolf.png"
import PointManual from "../modules/PointManual";

global.imgMap = {
    "armor_animal": armorAnimal,
    "armor_athlete": armorAthlete,
    "armor_dancer": armorDancer,
    "armor_musician": armorMusician,
    "armor_royal": armorRoyal,
    "armor_scholar": armorScholar,
    "armor_special": armorSpecial,
    "armor_viking": armorViking,
    "boots_animal": bootsAnimal,
    "boots_athlete": bootsAthlete,
    "boots_dancer": bootsDancer,
    "boots_musician": bootsMusician,
    "boots_royal": bootsRoyal,
    "boots_scholar": bootsScholar,
    "boots_special": bootsSpecial,
    "boots_viking": bootsViking,
    "helmet_animal": helmetAnimal,
    "helmet_athlete": helmetAthlete,
    "helmet_dancer": helmetDancer,
    "helmet_musician": helmetMusician,
    "helmet_royal": helmetRoyal,
    "helmet_scholar": helmetScholar,
    "helmet_special": helmetSpecial,
    "helmet_viking": helmetViking,
    "shield_animal": shieldAnimal,
    "shield_athlete": shieldAthlete,
    "shield_dancer": shieldDancer,
    "shield_musician": shieldMusician,
    "shield_royal": shieldRoyal,
    "shield_scholar": shieldScholar,
    "shield_special": shieldSpecial,
    "shield_viking": shieldViking,
    "sword_animal": swordAnimal,
    "sword_athlete": swordAthlete,
    "sword_dancer": swordDancer,
    "sword_musician": swordMusician,
    "sword_royal": swordRoyal,
    "sword_scholar": swordScholar,
    "sword_special": swordSpecial,
    "sword_viking": swordViking,
    "bunny": bunny,
    "cat": cat,
    "deer": deer,
    "dog": dog,
    "fox": fox,
    "otter": otter,
    "tiger": tiger,
    "wolf": wolf,
}

const GameRound = (props) => {
    const {myState, tradeItem, receiveItem, readyForNext, readyForBattle, roundNo, receiveModal, setReceiveModal, setAchievements} = props ? props : useLocation().state;
    console.log(myState);
    const [tradeModal, setTradeModal] = useState(false);
    const [pointManual, setPointManual] = useState(false);

    const [tradeHelmet, setTradeHelmet] = useState(false);
    const [tradeSword, setTradeSword] = useState(false);
    const [tradeShield, setTradeShield] = useState(false);
    const [tradeArmor, setTradeArmor] = useState(false);
    const [tradeBoots, setTradeBoots] = useState(false);

    const maxRounds = 5;
    const roundDuration = 20;

    useEffect(() => {
        const property = myState.items[0].property;
        let sameProperty = true;
        for (const item of myState.items) {
            sameProperty = sameProperty && (property === item.property);
        }
        if (sameProperty) {
            post("/api/addfullset", {user_id: myState.user_id, property: property}).then((achievement) => {
                setAchievements(achievement);
            });
        }
    }, [myState]);
    
    return (<>
        <div className="GameRound-roundNo">{roundNo > maxRounds ? "Preparing for battle" : <div>Round {roundNo}/{maxRounds}</div>}</div>
        <div className="textAlign">
            <button onClick={() => {setPointManual(true);}} className="GameRound-manual">Point Manual</button>
        </div>
        <div className="GameRound-container">
        {myState ? <>
            <div className="GameRound-column GameRound-profile">
                <img src={imgMap[myState.avatar]} className="GameRound-image GameRound-avatar"/>
                <img src={imgMap[myState.items[0].name + "_" + myState.items[0].property]} className="GameRound-image GameRound-helmet"/>
                <img src={imgMap[myState.items[1].name + "_" + myState.items[1].property]} className="GameRound-image GameRound-sword"/>
                <img src={imgMap[myState.items[2].name + "_" + myState.items[2].property]} className="GameRound-image GameRound-shield"/>
                <img src={imgMap[myState.items[3].name + "_" + myState.items[3].property]} className="GameRound-image GameRound-armor"/>
                <img src={imgMap[myState.items[4].name + "_" + myState.items[4].property]} className="GameRound-image GameRound-boots"/>
                <div className="GameRound-username">{myState.name}</div>
            </div>
            <div className="GameRound-column GameRound-items">
                {myState.items ? myState.items.map((item) => 
                    <ItemDisplay
                        item={item}
                    />
                ) : "There was a bug -- please restart the game!"}
                <div className="GameRound-points">total points: {pointCalc(myState.items, myState.avatar)}</div>
                {roundNo > maxRounds ? <button onClick={() => {
                    readyForBattle(myState);
                }} className="GameRound-button"> FIGHT! </button> : <>
                    <button onClick={() => {
                        if (!tradeModal) {
                            readyForNext(myState);
                        }
                    }} className="GameRound-button">KEEP</button>
                    <button onClick={() => {
                        setTradeModal(true);
                    }} className="GameRound-button">TRADE</button>
                </>}
            </div>
            {tradeModal ? <TradeModal
                setTradeModal={setTradeModal}
                myState={myState}
                tradeItem={tradeItem}
                readyForNext={readyForNext}
                tradeHelmet={tradeHelmet}
                tradeSword={tradeSword}
                tradeShield={tradeShield}
                tradeArmor={tradeArmor}
                tradeBoots={tradeBoots}
                setTradeHelmet={setTradeHelmet}
                setTradeSword={setTradeSword}
                setTradeShield={setTradeShield}
                setTradeArmor={setTradeArmor}
                setTradeBoots={setTradeBoots}
            /> : <div/>}
            {receiveModal ? <ReceiveModal
                setReceiveModal={setReceiveModal}
                myState={myState}
                roundNo={roundNo}
                receiveItem={receiveItem}
            /> : <div/>}
            {pointManual ? <PointManual 
                setPointManual={setPointManual}
            /> : <div/>}
            </> : "Loading..."}
        </div> 
    </>
    );
  };
  
  export default GameRound;
  