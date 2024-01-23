import React from "react";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./Achievements.css";

const Achievements = (props) => {
    const {achievements} = props;
    return (
        <>
        <Link to="/">
            <button className="Achievements-back">BACK</button>
        </Link>
        <div className="Achievements-container">
            <h1>ACHIEVEMENTS</h1>
            <div className="Achievements-box">
                <div className="leftAlign">
                    <p>No. of games played: {achievements.gameNo}</p>
                    <p>No. of games won: {achievements.wonGames}</p>
                    <p>No. of full sets: {achievements.fullSet.length} ({achievements.fullSet.join(", ")})</p>
                </div>
            </div>
        </div>
        </>
    );
  };
  
  export default Achievements;
  