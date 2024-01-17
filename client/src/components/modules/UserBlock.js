import React, { useState, useEffect } from "react";

import "./UserBlock.css";

function UserBlock(props) {
    const {username} = props;
    return (
        <div className="UserBlock-container">
            {username}
        </div>
    );
}

export default UserBlock;