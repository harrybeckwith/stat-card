import "../styles/index.scss";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const json = require("../json/player-stats.json");
const app = document.getElementById("app");
// create class for player data
class Player {
  constructor(id, name, position, stats) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.stats = stats;
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
}
// create player objects
const formattedPlayers = json.players.map(item => {
  const playerData = item.player;
  const createPlayers = new Player(
    playerData.id,
    playerData.name,
    playerData.info.position,
    item.stats
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
    <select name="names" id="names" class="player-card__menu">
      ${optionItems}
    </select>
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
      <div class="player">
        <h2>${currentPlayer.playerFullName()}</h2>
        <h3>${currentPlayer.checkPosition()} </h3>
        <p>Appearances ${currentPlayer.getStatValue("appearances")}</p>
        <p>Goals ${currentPlayer.getStatValue("goals")}</p>
        <p>Assists ${currentPlayer.getStatValue("goal_assist")}</p>
        <p>Goals per match ${currentPlayer.goalsPerMatch()}</p>
        <p>Passes per minute ${currentPlayer.passesPerMinute()}</p>
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
