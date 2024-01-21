import React, { useState, useEffect } from "react";

import "./UserBlock.css";

function UserBlock(props) {
    const {username} = props;
    return (
        <div className="UserBlock-container">
            <div className="UserBlock-user">{username}</div>
        </div>
    );
}

export default UserBlock;