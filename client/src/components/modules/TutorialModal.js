import React, { useState, useEffect } from "react";

import "./TutorialModal.css";

import { get, post } from "../../utilities";

function TutorialModal(props) {
    const {postTrade, postReceive, receiveModal, fight} = props;
    const [modal1, setModal1] = useState(true);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [modal4, setModal4] = useState(false);
    const [modal5, setModal5] = useState(false);
    const [modal6, setModal6] = useState(false);
    const [modal7, setModal7] = useState(false);
    const [modal8, setModal8] = useState(false);
    const [modal9, setModal9] = useState(false);
    const [modal10, setModal10] = useState(true);
    const [modal11, setModal11] = useState(true);

    useEffect(() => {
        if (postTrade) {
            setModal9(false);
            if (!receiveModal) {
                setModal10(false);
            }
        }
        if (fight) {
            setModal11(false);
        }
    }, [postTrade, receiveModal, fight])

    return ( modal1 ? 
        <div className="TutorialModal-container TutorialModal-1">
            Welcome to Animal Clashing! Let's show you around the main parts of the game screen.
            <button onClick={()=>{setModal1(false); setModal2(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton1">&gt;&gt;</button>
        </div> : modal2 ?
        <div className="TutorialModal-blackout2">
            <div className="TutorialModal-container TutorialModal-2">
                Here's your character! Your goal is to equip yourself with the best possible combination of items, and then clash with your friends!
                <button onClick={()=>{setModal2(false); setModal3(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton2">&gt;&gt;</button>
            </div>
        </div> : modal3 ?
        <div className="TutorialModal-blackout3">
            <div className="TutorialModal-container TutorialModal-3">
                These are the items you have right now. Each item has a different property, and each combination of these properties is worth a certain amount of points.
                To win the clash, you need to have a higher number of points than your friends!  
                <button onClick={()=>{setModal3(false); setModal4(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton3">&gt;&gt;</button>
            </div>
        </div> : modal4 ?
        <div className="TutorialModal-blackout3">
            <div className="TutorialModal-container TutorialModal-3">
                Full sets of items with the same property usually gives you more points! Since you have the most items from the viking set, each viking item you own is worth its full point value of 1050. 
                For items of any other property, they are worth half points. So the helmet from the random set is worth half of its usual 900 point value. 
                <button onClick={()=>{setModal4(false); setModal5(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton3">&gt;&gt;</button>
            </div>
        </div> : modal5 ?
        <div className="TutorialModal-blackout5">
            <div className="TutorialModal-container TutorialModal-5">
                There are some special items lying around too. If you happen to have one of them, their effect will be shown here. You currently have the clown mask (helmet: random), which is giving you a 0.8x point multiplier :\
                <button onClick={()=>{setModal5(false); setModal6(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton5">&gt;&gt;</button>
            </div>
        </div> : modal6 ?
        <div className="TutorialModal-blackout6">
            <div className="TutorialModal-container TutorialModal-6">
                Each round, you can choose to either keep all your items, or try to trade some of your items with your friends. 
                However, trades can only happen if more than one person chooses to trade away an item. 
                For example, if you are the only one who wants to give away your helmet in that round, you will have to keep the one you have. 
                <button onClick={()=>{setModal6(false); setModal7(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton6">&gt;&gt;</button>
            </div>
        </div> : modal7 ?
        <div className="TutorialModal-blackout7">
            <div className="TutorialModal-container TutorialModal-7">
                At the top left, you can see the number of rounds remaining before the clash and the time left during each round. Each round is 30 seconds, and you will automatically keep all your items if time runs out!
                <button onClick={()=>{setModal7(false); setModal8(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton7">&gt;&gt;</button>
            </div>
        </div> : modal8 ?
        <div className="TutorialModal-blackout8">
            <div className="TutorialModal-container TutorialModal-8">
                Feel free to refer to the rules and points manual during the game if you need a refresher on how the game works. 
                <button onClick={()=>{setModal8(false); setModal9(true)}} className="TutorialModal-nextbutton TutorialModal-nextbutton8">&gt;&gt;</button>
            </div>
        </div> : modal9 ?
        <div className="TutorialModal-blackout9">
            <div className="TutorialModal-container TutorialModal-9">
                Now, let's try to trade something away! Looks like the clown makeup (helmet: random) is giving you a bad multiplier. Click the trade button and select the helmet to trade it away. 
                We only want to trade one item this time, but remember that you can trade away as many items as you want each round!
            </div>
        </div> : modal10 && postTrade ?
        <div className="TutorialModal-container TutorialModal-9">
            Wow! You got the viking helmet, so that makes a complete set!
            Let's confirm the trade.
        </div> : postReceive && !receiveModal && modal11 ?
        <div className="TutorialModal-container TutorialModal-11">
            Look, you have more points now! I think we're ready to fight! Click on the FIGHT button to proceed to battle.
            Good luck in the clash!
        </div> : <div/>
    );
}

export default TutorialModal;