import "../styles/index.scss";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}
// stat card code start
const json = require("../json/player-stats.json");
const app = document.getElementById("app");
// create class for player data
class Player {
  constructor(id, name, position, stats, currentTeam) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.stats = stats;
    this.currentTeam = currentTeam;
  }
  // return stat value
  getStatValue(statName) {
    // check for missing data
    if (!this.stats.filter(item => item.name === statName).length > 0) {
      return "n/a";
    }
    return this.stats.filter(item => item.name === statName)[0].value;
  }
  // create player name
  playerFullName() {
    // check that last name is available
    if (!this.name.first) return `${this.name.last}`;
    if (!this.name.last) return `name missing`;
    return `${this.name.first} ${this.name.last}`;
  }
  // position check
  checkPosition() {
    let playerPosition;
    switch (this.position.toUpperCase()) {
      case "M":
        playerPosition = "Midfielder";
        break;
      case "D":
        playerPosition = "Defender";
        break;
      case "F":
        playerPosition = "Forward";
        break;
    }

    return playerPosition;
  }
  // goals per match
  goalsPerMatch() {
    // number of goals divided by number of appearances
    const totalGames = parseInt(this.getStatValue("appearances"));
    const goals = parseInt(this.getStatValue("goals"));
    const result = goals / totalGames;

    return result.toFixed(2);
  }
  // passes per minute
  passesPerMinute() {
    // forward passes + backward passes / minutes played
    const forwardPasses = parseInt(this.getStatValue("fwd_pass"));
    const backwardPass = parseInt(this.getStatValue("backward_pass"));
    const minutesPlayed = parseInt(this.getStatValue("mins_played"));

    const result = (forwardPasses + backwardPass) / minutesPlayed;
    return result.toFixed(2);
  }

  getID() {
    return this.id;
  }

  teamName() {
    return this.currentTeam.shortName
      .split(" ")
      .join("")
      .toLowerCase();
  }
}
// create player objects
const formattedPlayers = json.players.map(item => {
  const playerData = item.player;
  const createPlayers = new Player(
    playerData.id,
    playerData.name,
    playerData.info.position,
    item.stats,
    playerData.currentTeam
  );
  return createPlayers;
});

// html for dropdown with player id added
const createOptions = playerArr => {
  return playerArr
    .map(item => {
      return `
      <option value="${item.id}" class="menu__item">
      ${item.playerFullName()}
      </option>`;
    })
    .join(" ");
};

// html for select with options
const selectAndOptions = optionItems => {
  return `
  <div class="player-card">
    <div class="player-card__header"> 
      <select name="names" id="names" class="player-card__menu">
      <option value="" disabled selected>Select a player...</option>
        ${optionItems}
      </select>
    </div>
      <div class="player-card__body"></div>
  </div>`;
};
// complete menu
const menu = selectAndOptions(createOptions(formattedPlayers));

window.addEventListener("load", () => {
  // add menu to html
  app.insertAdjacentHTML("afterbegin", menu);
  // menu id
  const selectId = document.getElementById("names");
  // find player by id
  const filterById = (obj, idSearch) => {
    return obj.filter(item => item.id === parseInt(idSearch));
  };
  // create body of card html
  const cardHTML = currentPlayer => {
    return `
      <div class="player-card__details">
        <img src ="src/images/players/p${currentPlayer.getID()}.png" height='280' class="player-card__details__player">

        <div class="player-card__details__content"> 
        <div class="player-card__badge player-card__badge--${currentPlayer.teamName()}"></div>
        <h2 class="player-card__details__title">${currentPlayer.playerFullName()}</h2>
        <h3 class="player-card__details__sub-title">${currentPlayer.checkPosition()} </h3>
        <div class="player-card__stats">
      
            <div class="player-card__stats__stat"> 
              <p class="player-card__stats__name">Appearances</p> 
              <p class="player-card__stats__value">${currentPlayer.getStatValue(
                "appearances"
              )}</p>
            </div>

            <div class="player-card__stats__stat"> 
            <p class="player-card__stats__name">Goals</p> 
            <p class="player-card__stats__value">${currentPlayer.getStatValue(
              "goals"
            )}
            </div>

            <div class="player-card__stats__stat"> 
            <p class="player-card__stats__name">Assists</p> 
            <p class="player-card__stats__value">${currentPlayer.getStatValue(
              "goal_assist"
            )}
            </div>

            <div class="player-card__stats__stat"> 
            <p class="player-card__stats__name">Goals per match</p> 
            <p class="player-card__stats__value">${currentPlayer.goalsPerMatch()}
            </div>

            <div class="player-card__stats__stat"> 
            <p class="player-card__stats__name">Passes per minute</p> 
            <p class="player-card__stats__value">${currentPlayer.passesPerMinute()}
            </div>

          </div>
      </div>
      </div>
    `;
  };
  // add html to card
  const upDataCardHTML = id => {
    const foundPlayer = filterById(formattedPlayers, id);
    const playerCardBody = document.querySelector(".player-card__body");
    playerCardBody.innerHTML = cardHTML(foundPlayer[0]);
  };
  // get id from dropdown list
  selectId.addEventListener("change", e => {
    upDataCardHTML(e.target.value);
  });
  // load first player
  upDataCardHTML(formattedPlayers[0].id);
});
// stat card code end
