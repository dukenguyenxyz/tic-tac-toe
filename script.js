function getTilesDOM() {
  return Array.from(document.querySelectorAll("td"));
}

const DOM = {
  tiles: getTilesDOM(),
  x: "blue", //`<i class="far fa-check-circle tictac"></i>`,
  o: "green", //`<i class="fas fa-minus-circle tictac"></i>`,
  warning: document.querySelector(".warning"),
  boardSizeInput: document.querySelector("#board-size-input"),
  toWinInput: document.querySelector("#to-win-input"),
  submitButton: document.querySelector("#submit-button"),
  board: document.querySelector("tbody"),
};

let state = {
  currentPlayer: "x",
  player: {
    x: [],
    o: [],
  },
  playerName: {
    x: "Blue",
    o: "Green",
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
    // !tile.innerHTML
    tile.style.backgroundColor == ""
  ) {
    return true;
  } else {
    return false;
  }
}

function tileNotEmptyWarning() {
  DOM.warning.innerHTML = "<p>This tile is not available</p>";
}

function clearWarning() {
  DOM.warning.innerText = "";
}

function switchPlayer(prevPlayer) {
  state.currentPlayer = prevPlayer === "x" ? "o" : "x";
}

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

function gamePlayOff() {
  DOM.tiles.forEach((tile) => {
    tile.removeEventListener("click", insertToken);
  });
}

function declareWinner() {
  DOM.warning.innerHTML = `<p>Player ${
    state.playerName[state.currentPlayer]
  } has won</p>`;
  gamePlayOff();
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
  const tile = event.target;
  if (tileEmpty(tile)) {
    // Insert photo mode
    // tile.insertAdjacentHTML("beforeend", DOM[state.currentPlayer]);

    // Colour mode
    tile.style.backgroundColor = DOM[state.currentPlayer];

    const tileObj = tileJSPosition(tile.id);
    addTokenToState(tileObj);
    addPointsToToken(
      state.player[state.currentPlayer][
        state.player[state.currentPlayer].length - 1
      ]
    );

    // console.log(state.currentPlayer);
    switchPlayer(state.currentPlayer);
    // console.log(state.currentPlayer);
  } else {
    tileNotEmptyWarning();
    clearWarning();
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
}

main();

DOM.submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  setting();
});
