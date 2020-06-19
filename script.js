function getTilesDOM() {
  return Array.from(document.querySelectorAll("td"));
}

const DOM = {
  tiles: getTilesDOM(),
  // x: "blue", // Image here
  // o: "green", // Image here
  alert: document.querySelector(".alert"),
  boardSizeInput: document.querySelector("#board-size-input"),
  toWinInput: document.querySelector("#to-win-input"),
  submitBtn: document.querySelector("#submit-button"),
  board: document.querySelector("tbody"),

  continueBtn: document.querySelector("#continue-btn"),
  drawBtn: document.querySelector("#draw-btn"),
  resetBtn: document.querySelector("#reset-btn"),

  player: {
    x: {
      // name: document.querySelector("#player-x-avatar"),
      score: document.querySelector("#player-x-score"),
      avatar: document.querySelector("#player-x-avatar"),
      avatarColorBtn: document.querySelector("#player-x-avatar-color-button"),
      // avatarImgBtn: document.querySelector("#player-x-avatar-image-button"),
    },
    o: {
      // name: document.querySelector("#player-o-avatar"),
      score: document.querySelector("#player-o-score"),
      avatar: document.querySelector("#player-o-avatar"),
      avatarColorBtn: document.querySelector("#player-o-avatar-color-button"),
      // avatarImgBtn: document.querySelector("#player-o-avatar-image-button"),
    },
  },
};

function colorDiv(color) {
  return `<span
  style="
    background-color: ${color};
    height: 14px;
    width: 14px;
    display: inline-block;
  "
></span>`;
}

let state = {
  currentPlayer: "x",
  winner: false,
  player: {
    x: [],
    o: [],
  },
  color: {
    x: "blue",
    o: "green",
  },
  playerName: {
    x: colorDiv("blue"), // colorDiv(this.color.x),
    o: colorDiv("green"), // colorDiv(this.color.o),
  },
  point: {
    x: 0,
    o: 0,
  },
  boardSize: 3,
  toWin: 3,
};

function reverseCoordinate(token) {
  if (token === "x") {
    return "y";
  } else {
    return "x";
  }
}

function tileEmpty(tile) {
  if (
    // Photo case: !tile.innerHTML
    tile.style.backgroundColor == "" // Background color case
  ) {
    return true;
  } else {
    return false;
  }
}

function tileNotEmptyWarning() {
  DOM.alert.innerText = "This tile is not available";
}

function clearWarning() {
  DOM.alert.innerText = "";
}

function switchPlayer(prevPlayer) {
  state.currentPlayer = prevPlayer === "x" ? "o" : "x";
}

// Converts HTML ID to JavaScript Object for Tile Position
function tileJSPosition(tile) {
  const splitTile = tile.split(" ");
  return {
    x: parseInt(
      splitTile[0].split("").slice(1, splitTile[0].split("").length).join("")
    ),
    y: parseInt(
      splitTile[1].split("").slice(1, splitTile[1].split("").length).join("")
    ),
  };
}

function addPointsToToken(tileObj) {
  winThroughXorY(tileObj, "x");
  winThroughXorY(tileObj, "y");
  winThroughDiagonalTopLeft(tileObj);
  winThroughDiagonalTopRight(tileObj);
}

function mutatePoints(aTile, tileObj, position) {
  aTile.point[position] += tileObj.point[position];
  tileObj.point[position] = aTile.point[position];
}

function winThroughXorY(tileObj, coordinate) {
  state.player[state.currentPlayer].forEach((aTile) => {
    if (
      aTile.position[reverseCoordinate(coordinate)] ===
        tileObj.position[reverseCoordinate(coordinate)] &&
      (aTile.position[coordinate] === tileObj.position[coordinate] + 1 ||
        aTile.position[coordinate] === tileObj.position[coordinate] - 1)
    ) {
      mutatePoints(aTile, tileObj, coordinate);
      if (checkWinner(tileObj.point[coordinate])) declareWinner();
    }
  });
}

function winThroughDiagonalTopLeft(tileObj) {
  state.player[state.currentPlayer].forEach((aTile) => {
    if (
      // Positive Case
      (tileObj.position["x"] === aTile.position["x"] + 1 &&
        tileObj.position["y"] === aTile.position["y"] + 1) ||
      // Negative Case
      (tileObj.position["x"] === aTile.position["x"] - 1 &&
        tileObj.position["y"] === aTile.position["y"] - 1)
    ) {
      mutatePoints(aTile, tileObj, "topLeft");
      if (checkWinner(tileObj.point["topLeft"])) declareWinner();
    }
  });
}

function winThroughDiagonalTopRight(tileObj) {
  state.player[state.currentPlayer].forEach((aTile) => {
    if (
      // Positive Case
      (tileObj.position["x"] === aTile.position["x"] + 1 &&
        tileObj.position["y"] === aTile.position["y"] - 1) ||
      // Negative Case
      (tileObj.position["x"] === aTile.position["x"] - 1 &&
        tileObj.position["y"] === aTile.position["y"] + 1)
    ) {
      mutatePoints(aTile, tileObj, "topRight");
      if (checkWinner(tileObj.point["topRight"])) declareWinner();
    }
  });
}

function checkWinner(point) {
  if (point >= state.toWin) {
    return true;
  }
  return false;
}

function checkDraw() {
  // Method 1
  // let tileCount = 0;
  // DOM.tiles.forEach((tile) => {
  //   if (tileEmpty(tile)) tileCount++;
  // });
  // if (tileCount === DOM.tiles.length) {
  //   return true;
  // } else {
  //   return false;
  // }

  // Method 2
  if (state.player.x.length + state.player.o.length === DOM.tiles.length) {
    return true;
  } else {
    return false;
  }
}

function declareDraw() {
  // Display UI
  DOM.alert.innerHTML = `<p>This is a draw</p>`;

  gameContinueReset();
}

function gamePlayOff() {
  DOM.tiles.forEach((tile) => {
    tile.removeEventListener("click", insertToken);
  });
}

function declareWinner() {
  // Display UI
  DOM.alert.innerHTML = `<p>Player ${
    state.playerName[state.currentPlayer]
  } has won</p>`;

  // Add points to user in DB
  state.point[state.currentPlayer] += 1;

  // Change winning status
  state.winner = true;

  // Add points to the UI
  DOM.player[state.currentPlayer].score.innerText =
    state.point[state.currentPlayer];

  gameContinueReset();
}

function gameContinueReset() {
  // Reset the game
  DOM.continueBtn.disabled = false;

  // Turn off Game
  gamePlayOff();

  // Continue
  DOM.continueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    reset();
  });
}

function gameResetAll() {
  gamePlayOff();

  // Clear DB
  state.point.x = 0;
  state.point.o = 0;

  // Clear UI
  DOM.player.x.score.innerText = state.point.x;
  DOM.player.o.score.innerText = state.point.o;

  reset();
}

function reset() {
  // Reset winner
  state.winner = false;

  // Clear the UI
  DOM.alert.innerHTML = "";
  DOM.tiles.forEach((tile) => {
    tile.style.backgroundColor = "";
  });

  // Clear the DB
  state.player.x = [];
  state.player.o = [];

  // Rerun the game
  main();
}

function addTokenToState(tileObj) {
  state.player[state.currentPlayer].push({
    position: tileObj,
    point: {
      // X and Y
      x: 1,
      y: 1,

      // Diagonal
      topLeft: 1,
      topRight: 1,
    },
  });
}

function insertToken(event) {
  clearWarning();
  const tile = event.target;

  if (tileEmpty(tile)) {
    //// Adding placed tile to UI
    // Insert photo mode
    // tile.insertAdjacentHTML("beforeend", DOM[state.currentPlayer]);

    // Colour mode
    // tile.style.backgroundColor = DOM[state.currentPlayer];
    tile.style.backgroundColor = state.color[state.currentPlayer];

    //// Addding placed tile info to database

    // Parsing tile from HTML id to JavaScript object
    const tileObj = tileJSPosition(tile.id);

    // Adding tile to player's move array
    addTokenToState(tileObj);

    // Adding points to tile's point tracker and check winning condition
    addPointsToToken(
      state.player[state.currentPlayer][
        state.player[state.currentPlayer].length - 1
      ]
    );

    if (checkDraw() & !state.winner) declareDraw();

    switchPlayer(state.currentPlayer);
  } else {
    tileNotEmptyWarning();
  }
}

function setting() {
  gamePlayOff();

  const boardSizeNum = parseInt(DOM.boardSizeInput.value);
  if (!isNaN(boardSizeNum) && DOM.boardSizeInput.value.trim() != "") {
    state.boardSize = boardSizeNum;
    DOM.board.innerHTML = "";

    for (let i = 0; i < boardSizeNum; i++) {
      const boardRow = document.createElement("tr");
      boardRow.classList = "x" + (i + 1);
      for (let i1 = 0; i1 < boardSizeNum; i1++) {
        const boardCell = document.createElement("td");
        boardCell.id = boardRow.classList + " " + "y" + (i1 + 1);
        boardRow.insertAdjacentElement("beforeend", boardCell);
      }
      DOM.board.insertAdjacentElement("beforeend", boardRow);
    }
  }
  DOM.tiles = getTilesDOM();

  const toWinNum = parseInt(DOM.toWinInput.value);
  if (!isNaN(toWinNum) && DOM.toWinInput.value.trim() != "") {
    state.toWin = toWinNum;
  }

  main();
}

function main() {
  DOM.tiles.forEach((tile) => {
    tile.addEventListener("click", insertToken);
  });

  DOM.continueBtn.disabled = true;
}

main();

DOM.drawBtn.addEventListener("click", (e) => {
  e.preventDefault();
  gamePlayOff();
  reset();
});

DOM.submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  setting();
});

DOM.resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  gameResetAll();
});

function update(jscolor) {
  // 'jscolor' instance can be used as a string
  const player = event.target.classList.value.split(" ")[0];
  const selectedColour = "#" + jscolor;

  state.playerName[player] = colorDiv(selectedColour);
  state.color[player] = selectedColour;
  DOM.player[player].avatar.style.backgroundColor = selectedColour;

  // console.log(state.playerName[player]);
  // console.log(DOM.player[player]);
}
