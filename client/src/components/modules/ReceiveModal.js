import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ReceiveModal.css";

import { get, post } from "../../utilities";

function itemInArray(item, array) {
    for (const element of array) {
        if (element.name === item.name && element.property === item.property){
            return true;
        }
    }
    return false;
}

function ReceiveModal(props) {
    const {setReceiveModal, myState, roundNo, receiveItem, setPause, setSeconds} = props;
    return (
        <div className="ReceiveModal-container">
            {myState.receive.length > 0 ? <>
                {myState.receive.filter((item) => !itemInArray(item, myState.items)).length > 0 ? <div>
                    <div className="ReceiveModal-text">You got...</div>
                    {myState.receive.filter((item) => !itemInArray(item, myState.items)).map((item) => 
                        <div className="ReceiveModal-itemtext">{item.name}: {item.property} {emojiMap[item.property]}</div>
                    )}
                </div> : <div/>}
                {myState.receive.filter((item) => itemInArray(item, myState.items)).length > 0 ? <div>
                    <div className="ReceiveModal-text">You kept...</div>
                    {myState.receive.filter((item) => itemInArray(item, myState.items)).map((item) => 
                        <div className="ReceiveModal-itemtext">{item.name}: {item.property} {emojiMap[item.property]}</div>
                    )}
                </div> : <div/>}
            </> : <>
            <div className="ReceiveModal-text">You kept all your items!</div>
            </>}
            <button onClick={() => {
                setReceiveModal(false);
                receiveItem(myState);
            }} className="ReceiveModal-confirmButton"> CONFIRM </button>
        </div>
    );
}

export default ReceiveModal;