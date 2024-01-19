import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ReceiveModal.css";

import { get, post } from "../../utilities";

function ReceiveModal(props) {
    const {setReceiveModal, myState, roundNo, receiveItem} = props;
    const maxRounds = 1;
    return (
        <div className="ReceiveModal-container">
            {myState.receive.name !== "none" ? <>
                <div className="ReceiveModal-text">You got...</div>
                <div className="ReceiveModal-text">{myState.receive.name}: {myState.receive.property}</div>
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