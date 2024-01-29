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
    const [modal6, setModal6] = useState(true);
    const [modal7, setModal7] = useState(true);

    useEffect(() => {
        if (postTrade) {
            setModal5(false);
            if (!receiveModal) {
                setModal6(false);
            }
        }
        if (fight) {
            setModal7(false);
        }
    }, [postTrade, receiveModal, fight])

    return ( modal1 ? 
        <div className="TutorialModal-container TutorialModal-1">
            Welcome to animal clashing! Let's show you around the main parts of the game screen.
            <button onClick={()=>{setModal1(false); setModal2(true)}} className="TutorialModal-nextbutton">&gt;&gt;</button>
        </div> : modal2 ?
        <div className="TutorialModal-container TutorialModal-2">
            Here's your character! Your goal is to equip yourself with the best possible combination of items, and then clash with your friends!
            <button onClick={()=>{setModal2(false); setModal3(true)}} className="TutorialModal-nextbutton">&gt;&gt;</button>
        </div> : modal3 ?
        <div className="TutorialModal-container TutorialModal-3">
            These are the items you have right now! Each item has a different property, and combinations of these properties have points assigned to them.
            The point manual contains more details about how points are calculated.
            There are some special items lying around too, if you happen to chance upon one of them, their effect will be shown here as well.
            <button onClick={()=>{setModal3(false); setModal4(true)}} className="TutorialModal-nextbutton">&gt;&gt;</button>
        </div> : modal4 ?
        <div className="TutorialModal-container TutorialModal-4">
            Each round, you can choose to either keep all your items, or trade some of them out.
            The number of rounds remaining before the fight, and the time left for each round is shown at the top left.
            <button onClick={()=>{setModal4(false); setModal5(true)}} className="TutorialModal-nextbutton">&gt;&gt;</button>
        </div> : modal5 ?
        <div className="TutorialModal-container TutorialModal-5">
        We don't have a lot of time left! Looks like the clown makeup is giving us a bad multiplier... let's try to trade that away!
        </div> : modal6 && postTrade ?
        <div className="TutorialModal-container TutorialModal-6">
            Wow! We got the viking helmet, that makes a complete set! What a lot of points!
            Let's accept the item.
        </div> : postReceive && !receiveModal && modal7 ?
        <div className="TutorialModal-container TutorialModal-7">
            Don't I look cool in my new helmet? I think we're ready to fight! Click on the FIGHT button to proceed to battle.
            And good luck in all your future clashes too!
        </div> : <div/>
    );
}

export default TutorialModal;