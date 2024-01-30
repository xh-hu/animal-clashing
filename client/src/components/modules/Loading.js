import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import "./Loading.css";

function LoadScreen() {
    return (
        <div className="LoadScreen-container">
            <div className="LoadScreen-text">Loading...</div>
        </div>
    );
}

function WaitScreen() {
    return (
        <div className="LoadScreen-container">
            <div className="LoadScreen-text">Waiting for other players...</div>
        </div>
    );
}

export {LoadScreen, WaitScreen};