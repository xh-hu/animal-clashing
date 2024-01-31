import React, { useState, useEffect } from "react";

import "./RulesManual.css";

function RulesManual(props) {
  const { setRulesManual } = props;
  return (
    <div className="RulesManual-container">
        <div className="RulesManual-title">Rules Manual</div>
        <div className="RulesManual-body">
        <p>
              Welcome to Animal Clashing! Your goal is to equip yourself with the best possible 
              combination of items through trading, and then clash with your friends.
            </p>
            <p>
              Your character will have 5 gear items: helmet, shield, sword, armor, shoes. These gear
              items can have 8 different properties: viking, scholar, athlete, musician, royal,
              dancer, animal, and special. Each item will have a certain property, and different
              combinations of gear properties will give you different amounts of points. (Refer 
              to the points manual for more information about points.)
            </p>
            <p> Game progression: </p>
            <p class="indent">
               - At the start of each game, you will be randomly assigned to a character and gear items with various
              properties. 
            </p>
            <p class="indent">
              - During each round you can choose to keep your gear or trade any number (from 1 to all 5) of your gear items
              to try to get more points. Trades will occur only if at least one other person in your lobby chooses to trade that item.
            </p>
            <p class="indent">
               - Depending on the number of people in the lobby, you will do up to 5 rounds of trades to finalize your gear properties. 
            </p>
            <p class="indent">
               - After all trading rounds are completed, players will fight, where the person with the most points wins the clash!
            </p>
      </div>
      <button
        onClick={() => {
          setRulesManual(false);
        }}
        className="RulesManual-closeButton"
      >
        CLOSE
      </button>
    </div>
  );
}

export default RulesManual;
