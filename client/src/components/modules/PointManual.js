import React, { useState, useEffect } from "react";

import "./PointManual.css";

function PointManual(props) {
  const { setPointManual } = props;
  return (
    <div className="PointManual-container">
      <div className="PointManual-title">Point Manual</div>
      <div className="PointManual-body">
        <p>
          For the set that you have the most items in (or the one with the highest point value if
          there's a tie), you get full points. For all other items, you get half points.
        </p>
        <p>Points per item in each set:</p>
        <p class="indent">Royal: 1100</p>
        <p class="indent">Viking: 1050</p>
        <p class="indent">Athlete: 1050</p>
        <p class="indent">Dancer: 1000</p>
        <p class="indent">Scholar: 1000</p>
        <p class="indent">Musician: 950</p>
        <p class="indent">Animal: 950</p>
        <p class="indent">Random: 900</p>
        <p>
          Items in the Animal and Random sets can be buffs or de-buffs. Some buffs and de-buffs are
          universal, while others are based on your in-game character (bunny, fox, wolf, deer, cat,
          tiger, otter, dog). Character buffs give you a 1.5x points multiplier, universal buffs
          give you a 1.2x points multiplier, and universal de-buffs give you a 0.8x points
          multiplier:
        </p>
        <p class="indent">Universal Buff: Random boots (rocket shoes)</p>
        <p class="indent">Universal De-buff: Random helmet (clown mask)</p>
        <p class="indent">Bunny Buff: Random weapon (carrot)</p>
        <p class="indent">Fox Buff: Random armor (grapes)</p>
        <p class="indent">Wolf Buff: Random shield (moon)</p>
        <p class="indent">Deer Buff: Animal boot (hooves)</p>
        <p class="indent">Cat Buff: Animal helmet (cat ears)</p>
        <p class="indent">Tiger Buff: Animal armor (striped armor)</p>
        <p class="indent">Otter Buff: Animal shield (small round otter)</p>
        <p class="indent">Dog Buff: Animal weapon (small angry dog)</p>
      </div>
      <button
        onClick={() => {
          setPointManual(false);
        }}
        className="PointManual-closeButton"
      >
        CLOSE
      </button>
    </div>
  );
}

export default PointManual;
