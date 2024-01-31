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
        <h1>RULES</h1>
        <div className="Help-box">
          <div className="leftAlign">
            <p>
              Welcome to Animal Clashing! Your goal is to equip yourself with the best possible 
              combination of items through trading, and then clash with your friends.
            </p>
            <p>
              Your character will have 5 gear items: helmet, shield, sword, armor, shoes. These gear
              items can have 8 different properties: viking, scholar, athlete, musician, royal,
              dancer, animal, and special. Each item will have a certain property, and different
              combinations of gear properties will give you different amounts of points, also known as combat power. (Refer 
              to the points manual for more information about points.)
            </p>
            <p> Game progression: </p>
            <p class="indent">
               - At the start of each game, you will be randomly assigned to a character and gear items with various
              properties. 
            </p>
            <p class="indent">
              - During each round you can choose to keep your gear or trade any number (from 1 to all 5) of your gear items
              to try to get more combat power. Trades will occur only if at least one other person in your lobby chooses to trade that item.
            </p>
            <p class="indent">
               - Depending on the number of people in the lobby, you will do up to 5 rounds of trades to finalize your gear properties. 
            </p>
            <p class="indent">
               - After all trading rounds are completed, players will fight, where the person with the most combat power wins the clash!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
