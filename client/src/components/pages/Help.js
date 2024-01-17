import React from "react";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./Help.css";

const HelpPage = () => {
    return (
        <>
        <Link to="/">
            <button className="Help-back">BACK</button>
        </Link>
        <div className="Help-container">
            <h1>HELP. HERE. PLEASE.</h1>
            <div className="Help-box">
                <div className="leftAlign">
                    some content here!
                </div>
            </div>
        </div>
        </>
    );
  };
  
  export default HelpPage;
  