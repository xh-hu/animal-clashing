import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities.js";

import "./ItemDisplay.css";

function ItemDisplay(props) {
    const {item} = props;
    return (
        (item ? <div className="ItemDisplay-container">
            {item.name}: {item.property}
        </div> : <div/>)
    );
}

export default ItemDisplay;