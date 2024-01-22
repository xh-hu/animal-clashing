import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import "./ItemDisplay.css";

function ItemDisplay(props) {
    const {item} = props;
    return (
        <div className="ItemDisplay-container">
            {item ? <div className="ItemDisplay-itembox">
                {item.name}: {item.property}
            </div> : <div/>}
        </div>
    );
}

export default ItemDisplay;