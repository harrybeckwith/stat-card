import "../styles/index.scss";

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

const json = require("../json/player-stats.json");
// create class for player data
class Player {
  constructor(id, name, position, stats) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.stats = stats;
  }
  // return  stat value
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
    // number of goals divided by number of apperances
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
const options = formattedPlayers
  .map(item => {
    return `<option value="${
      item.id
    }" class="menu__item">${item.playerFullName()}</option>`;
  })
  .join(" ");
// html for select with options
const selectAndOptions = optionItems => {
  return `<select name="names" id="names" class="menu">${optionItems}</select>`;
};
// complete menu
const menu = selectAndOptions(options);
const app = document.getElementById("app");

window.addEventListener("load", () => {
  // add menu to html
  app.innerHTML = menu;
  const selectId = document.getElementById("names");

  const filterById = id => {
    // find player by id
    return formattedPlayers.filter(item => item.id === parseInt(id));
  };

  const cardHTML = currentPlayer => {
    console.log(currentPlayer);
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

  // select item click get value
  selectId.addEventListener("change", e => {
    upDataCardHTML(e.target.value);
  });

  const upDataCardHTML = id => {
    const foundPlayer = filterById(id);
    const h = cardHTML(foundPlayer[0]);
    const t = document.querySelector(".hi");
    t.innerHTML = h;
  };
  // load first player
  upDataCardHTML(formattedPlayers[0].id);
});
