const DOM = {
  tiles: Array.from(document.querySelectorAll("td")),
  x: `<i class="far fa-check-circle tictac"></i>`,
  o: `<i class="fas fa-minus-circle tictac"></i>`,
  warning: document.querySelector(".warning"),
};

let state = {
  currentPlayer: "x",
  player: {
    x: [],
    o: [],
  },
};

function reverseCoordinate(token) {
  if (token === "x") {
    return "y";
  } else {
    return "x";
  }
}

function tileEmpty(tile) {
  if (!tile.innerHTML) {
    return true;
  }
  return false;
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

const operatorWith1 = {
  "+": function (num) {
    return num++;
  },
  "-": function (num) {
    return num--;
  },
};

function movingDirection(tileObj, aTile, coordinate, operator) {
  return (
    tileObj.position[coordinate] ===
    operatorWith1[operator](aTile.position[coordinate])
  );
}

function winThroughXorY(tileObj, coordinate) {
  state.player[state.currentPlayer].forEach((aTile) => {
    if (
      (aTile.position[reverseCoordinate(coordinate)] ===
        tileObj.position[reverseCoordinate(coordinate)] &&
        movingDirection(tileObj, aTile, coordinate, "-")) ||
      movingDirection(tileObj, aTile, coordinate, "+")
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
      (movingDirection(tileObj, aTile, "x", "+") &&
        movingDirection(tileObj, aTile, "y", "+")) ||
      // Negative Case
      (movingDirection(tileObj, aTile, "x", "-") &&
        movingDirection(tileObj, aTile, "y", "-"))
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
      (movingDirection(tileObj, aTile, "x", "+") &&
        movingDirection(tileObj, aTile, "y", "-")) ||
      // Negative Case
      (movingDirection(tileObj, aTile, "x", "-") &&
        movingDirection(tileObj, aTile, "y", "+"))
    ) {
      mutatePoints(aTile, tileObj, "topRight");
      if (checkWinner(tileObj.point["topRight"])) declareWinner();
    }
  });
}

function checkWinner(point) {
  if (point >= 3) {
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
  DOM.warning.innerHTML = `<p>Player ${state.currentPlayer} has won</p>`;
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
    tile.insertAdjacentHTML("beforeend", DOM[state.currentPlayer]);
    const tileObj = tileJSPosition(tile.id);
    addTokenToState(tileObj);
    addPointsToToken(
      state.player[state.currentPlayer][
        state.player[state.currentPlayer].length - 1
      ]
    );
    switchPlayer(state.currentPlayer);
  } else {
    tileNotEmptyWarning();
    clearWarning();
  }
}

DOM.tiles.forEach((tile) => {
  tile.addEventListener("click", insertToken);
});
