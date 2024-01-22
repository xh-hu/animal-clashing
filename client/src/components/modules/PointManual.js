import React, { useState, useEffect } from "react";

import "./PointManual.css";

function PointManual(props) {
    const {setPointManual} = props;
    return (
        <div className="PointManual-container">
            <div className="PointManual-title">Point Manual</div>
            <div className="PointManual-body">
                some text here
            </div>
            <button onClick={() => {
                setPointManual(false);
            }} className="PointManual-closeButton">CLOSE</button>
        </div>
    );
}

export default PointManual;