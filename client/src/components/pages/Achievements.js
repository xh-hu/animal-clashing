import React from "react";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./Achievements.css";

const Achievements = (props) => {
    const {myAchievements} = props;
    console.log(myAchievements);
    return (
        <>
        <Link to="/">
            <button className="Achievements-back">BACK</button>
        </Link>
        <div className="Achievements-container">
            <h1>ACHIEVEMENTS</h1>
            {myAchievements ? 
            <div className="Achievements-box">
                <div className="leftAlign">
                    <p>No. of games played: {myAchievements.gameNo}</p>
                    <p>No. of games won: {myAchievements.wonGames}</p>
                    <p>No. of full sets: {myAchievements.fullSet.length} ({myAchievements.fullSet.join(", ")})</p>
                </div>
            </div> : "Loading achievements..."}
        </div>
        </>
    );
  };
  
  export default Achievements;
  