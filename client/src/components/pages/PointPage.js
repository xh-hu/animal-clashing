import React from "react";
import { Link } from "react-router-dom";

import "../../utilities.css";
import "./PointPage.css";

const PointPage = () => {
  return (
    <>
      <Link to="/">
        <button className="PointPage-back">BACK</button>
      </Link>
      <div className="PointPage-container">
        <h1>POINTS</h1>
        <div className="PointPage-box">
        <p>
          Each item is assigned has a base number of points based on their property using the following system:
        </p>
        <p class="indent">Royal: 1100</p>
        <p class="indent">Viking: 1050</p>
        <p class="indent">Athlete: 1050</p>
        <p class="indent">Dancer: 1000</p>
        <p class="indent">Scholar: 1000</p>
        <p class="indent">Musician: 950</p>
        <p class="indent">Animal: 950</p>
        <p class="indent">Special: 900</p>
        <p>
          To calculate the number of points you have, find the property that you have the most items in. If there is a tie 
          between properties, use the one with the highest point value. For that property, each item is worth its full amount of 
          base points. For items of all other properties, you get half the number of base points. 
        </p>
        <p>
          Items in the Animal and Special sets can be buffs or de-buffs. Some buffs and de-buffs are
          universal, while others are based on your in-game character. Character buffs (dependent on the character assigned to
          you at the beginning of each game) give you a 1.5x points multiplier, universal buffs
          give you a 1.2x points multiplier, and universal de-buffs give you a 0.8x points
          multiplier. Buffs and de-buffs that apply to you based on the items you own will also be listed on your game dashboard. 
          Here is the complete list of buffs and de-buffs:
        </p>
        <p class="indent">Universal Buff: Special boots (rocket shoes)</p>
        <p class="indent">Universal De-buff: Special helmet (clown mask)</p>
        <p class="indent">Bunny Buff: Special weapon (carrot)</p>
        <p class="indent">Fox Buff: Special armor (grapes)</p>
        <p class="indent">Wolf Buff: Special shield (moon)</p>
        <p class="indent">Deer Buff: Animal boot (hooves)</p>
        <p class="indent">Cat Buff: Animal helmet (cat ears)</p>
        <p class="indent">Tiger Buff: Animal armor (striped armor)</p>
        <p class="indent">Otter Buff: Animal shield (small otter)</p>
        <p class="indent">Dog Buff: Animal weapon (small dog)</p>
      </div>
      </div>
    </>
  );
};

export default PointPage;
