import React, { useState, useEffect } from "react";

import "./RulesManual.css";

function RulesManual(props) {
  const { setRulesManual } = props;
  return (
    <div className="RulesManual-container">
        <div className="RulesManual-title">Rules Manual</div>
        <div className="RulesManual-body">
        <p> Your character will have 5 gear items: helmet, shield, sword, armor, shoes. These gear
        items can have 8 different properties: viking, scholar, athlete, musician, royal,
        dancer, animal, special. Each item will have a certain property, and different
        combinations of gear properties will give you different amounts of points. Your goal
        is to get the combo with more points than all your friends to win every duel and come
        out on top. </p>
        <p> Game progression: </p>
        <p class="indent">
            At the start of each game, each piece of gear your character has will be randomly
            assigned to a certain property. The same gear item will only be assigned to each
            property once.
        </p>
        <p class="indent">
            You can choose to swap or keep each piece of your gear to try to get a better
            combination of properties for more points (see points page for more details).
        </p>
        <p class="indent">
            During each of 4 rounds, a random switch will be initiated between every person who
            chose to trade each gear item.
        </p>
        <p class="indent">
            After all rounds of switches are completed, players will be randomly paired into
            brackets to fight, where the person with the higher number of points wins each duel.
            The player who wins the final duel wins the game!
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
