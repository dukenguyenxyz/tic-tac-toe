
# Tutorial — Tic-Tac-Toe Game with Vanilla JavaScript

This is a tutorial on how to build a very basic tic-tac-toe game with vanilla javascript, html, css.

Medium link: https://medium.com/@duke.raphael.ng/tutorial-tic-tac-toe-game-with-vanilla-javascript-4857eaca59e

![Final product](https://cdn-images-1.medium.com/max/2000/1*RL2pOic2pHoKMbdB0ADiHA.gif)

*Github Repo: https://github.com/dukeraphaelng/tic-tac-toe
Codepen: https://codepen.io/dukeraphaelng/pen/wvMgpmP*

**Features**
- Board size is dynamically generated upon user's input instead of being static and hard-coded.
- Winning score can be set manually.

**Update (19 June 2020)**
- This app now has a score counting, reset, and changing player's avatar feature. The guide to this second part is coming soon.



## HTML

**Step 1**: Create index.html. Generate a boiler plate through snippet code and attach css and js external files

    <!DOCTYPE html>
    
    <html>
    
    <head>
    
    <meta charset="utf-8" />
    
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>Tic Tac Toe</title>
    
    <link rel="stylesheet" href="style.css" />
    
    </head>
    
    <body>
    
    <div class="container box">
    
    <h1>Tic Tac Toe</h1>
    
    </div>
    
    <script src="script.js"></script>
    
    </body>
    
    </html>



**Step 2**: There are many ways to represent a board for a game like tic-tac-toe. However, in the current implementation, I have chosen to use HTML table. In addition, in any kind of boardgame, we must record the coordinate of the pieces in order to store user moves in the database (e.g. to check whether the winning condition has been met). In this implementation, I have chosen to record the coordinate using the following pattern: each row would have a class of the x coordinate (e.g. “x1”), and the row would contain the number of cells being equal to the number of columns, having the following id format “x[x-coordinate] y[y-coodinate]” (e.g. “x1 y2”). I would later parse this into a JavaScript object to manipulate in the database.

    <table class="table">
    
    <tbody>
    
    <tr class="x1">
    
    <td id="x1 y1"></td>
    
    <td id="x1 y2"></td>
    
    <td id="x1 y3"></td>
    
    </tr>
    
    <tr class="x2">
    
    <td id="x2 y1"></td>
    
    <td id="x2 y2"></td>
    
    <td id="x2 y3"></td>
    
    </tr>
    
    <tr class="x3">
    
    <td id="x3 y1"></td>
    
    <td id="x3 y2"></td>
    
    <td id="x3 y3"></td>
    
    </tr>
    
    </tbody>
    
    </table>

The previous code is to be added in the <body>



**Step 3**: Additional features that will be built later: warning & winner announcement

    <div>
    
    <span>
    
    <input
    
    size="10"
    
    type="text"
    
    id="board-size-input"
    
    placeholder="Board: 3"
    
    />
    
    </span>
    
    &nbsp
    
    <span>
    
    <input
    
    size="10"
    
    type="text"
    
    id="to-win-input"
    
    placeholder="To win: 3"
    
    />
    
    </span>
    
    <button id="submit-button">Submit</button>
    
    </div>
    
    <br />
    
    <div><p class="alert"></p></div>

You can decide how to organize your UI elements, but I prefer them at the top right above the tic-tac-toe table.



## CSS

**Step 4**: Create style.css, set table sizes, and display the body with flex so and justify-content, align-items, text-align center to have everything right in the middle. Add border to all <td> to have an outlined table.

    table {
    
    height: 50vh;
    
    width: 50vh;
    
    }
    
    body {
    
    display: flex;
    
    align-items: center;
    
    justify-content: center;
    
    text-align: center;
    
    }
    
    td {
    
    border: 1px black solid;
    
    background-color: rgba(0, 0, 0, 5%);
    
    }
    
    .alert {height: 1rem;}



## JavaScript

**Step 5:** Code planning
Coding becomes much more efficient if the programmer first imagines the structure of the program. This is especially needed since the implementation of my features produces 230 lines of code in JavaScript. To imagine the structure of this program, we should write some pseudocode.



**Step(s):**

* **1–5:** Create a basic structure, with a table with each cell as a box where either X or O can be filled. (HTML & CSbS: DONE)

* **6**: Store all DOM elements as attributes inside an object for DRY. We can then access all DOM elements by calling properties from this object.

* **7**:** **Create a STATE object which represents the current state of our application (the current player, moves each player has made, the board size, the winning requirement, and player’s name). When we want to modify any attribute of the current state (e.g. change to the next player, add an additional move to the current player, changing to winning point or the board size through inputs), we can simply modify the property of this object.

* **8**. Create a MAIN function which when called will start the game. The game is started when the moment the player clicks on a tile, the tile is filled.

* **9**. Create a INSERTTOKEN function called when a tile is clicked. This function will first check if the current tile is empty, and if it is not then a warning is displayed, otherwise the function runs. First the UI of the tile is filled with the current player’s token and secondly the filled tile’s ID is parsed from HTML id into a JavaScript object which is subsequently saved to the current player’s move list. Then the game is switched to the next player.

* **10**. At this point, the game is functional, but no winner is notified when the winning condition is reached. Building this functionality is perhaps the most difficult task in the application, mainly because I do not wish to hard code winning scenarios but allow for dynamic board generation (e.g. the algorithm would work at any board size and with any winning score), for the later addition of these settings. Certainly there are many ways to approach this task, but I believe my approach is one of the less memory intensive way. The idea is that each token when place holds has its own score tracker. This tracker would keep track of the token’s size along the x, the y, and the two diagonal axes. Whenever a token is newly placed, it will have score of 1 along the 4 axes (four 1 values). If another token of the same player is placed next to it along any of the axes, its score is added by 1 (the score of the newly added one), whilst the newly added score is added by the core the previous token. Since the previous token could be sitting on that axis already with 2 more tokens in a row (hence totaling 3 points for that axes). Then each of those tokens on the axes would each respectively have a score of 3. Every time a token is placed, the winning condition is assessed. By default, the required score is 3. Hence the moment a token reaches 3 point, the player who just places it has won.

* **11**. Once this is built, changing the size of the board and the winning requirement is as easy as a piece of cake. On the HTML template, once the player puts in the appropriate numbers and press submit, these numbers will be validated (whether they are a number, or whether they are empty), if they are valid, then the <tbody> is emptied, and a loop constructucted with the number of iterations equalling to the board size input, with each iteration create a row <tr> with the class according to the iteration, and then a loop is nested again to create each cell in <tr> with the id coded in. Then all event listeners are removed an re-applied on the newly created tiles. And that’s it!



**Step 6**: Store all DOM elements inside an object

    function getTilesDOM() {
    
    return Array.from(document.querySelectorAll("td"));
    
    }
    
    const DOM = {
    
    tiles: getTilesDOM(),
    
    x: "blue", // Image here
    
    o: "green", // Image here
    
    alert: document.querySelector(".alert"),
    
    boardSizeInput: document.querySelector("#board-size-input"),
    
    toWinInput: document.querySelector("#to-win-input"),
    
    submitButton: document.querySelector("#submit-button"),
    
    board: document.querySelector("tbody"),
    
    };

In the current implementation, I have chosen to represent x and o with the tile background colour of blue and green (I will later apply style change), but you can choose to insert images here as well, some of the code will be slightly modified in the UI display. One piece of code in this section also stands out: getting the array for all tiles. Queryselectorall is one of the main methods to return a collection of elements in JavaScript, however, it does not return an array but a nodelist, we have to convert it into an array using Array.from(). I also put this in a seperate function as later on when we add change board size functionality. It needs to be recalled as the default 3x3 tiles will be removed from the UI and replaced by HTML code in JavaScript which needs to be restored.



**Step 7**: Storing the current state of the application inside of a STATE object

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

The pieces that stand out in this section is the player: { x: [], o:[]} nested object. This stores all the moves (all the tiles that have been placed) of each player.



**Step 8**: Create a game-starting MAIN function

    function main() {
    
    DOM.tiles.forEach((tile) => {
    
    tile.addEventListener("click", insertToken);
    
    });
    
    }
    
    main();

The ‘click’ event is listened on for each tile in the DOM.tiles that we just parsed from the nodelist earlier, which is handled by the main driver of the application: insertToken().



**Step 9–1** Constructuring the insertToken function

    function insertToken(event) {
    
    clearWarning();
    
    const tile = event.target;
    
    if (tileEmpty(tile)) {
    
    //// Adding placed tile to UI
    
    // Insert photo mode
    
    // tile.insertAdjacentHTML("beforeend", DOM[state.currentPlayer]);
    
    // Colour mode
    
    tile.style.backgroundColor = DOM[state.currentPlayer];
    
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
    
    switchPlayer(state.currentPlayer);
    
    } else {
    
    tileNotEmptyWarning();
    
    }
    
    }

The insertToken is activated every time the player presses a new tile. The first action is to clear the previous ‘Tile already placed warning’ if it was activated. Then the exact tile is parsed from event.target, and the if statement is run to check whether the tile is empty with a tileEmpty function which we will craft later. If this is false, then we will display a warning with tileNotEmptyWarning() function. These will be detailed below. If the tile is indeed empty, we first modify the UI. In my case I will change the background colour of the tile, but I have also included code that you could use to insert and remove photos if that’s what you want instead. Afterwards the id of the tile is parsed into JavaScript object format with the tileJSPosition to get the coordinate/position of the tile. This tile is added to the player’s move array with the addTokenToState method. Afterwards, the tile’s point tracker is processed, this method also checks the winning condition after calculating the tracker point. If the winner is yet to be determined the switchPlayer function is called.



**Step 9–2**: Check whether tile is empty and display warning or clear warning functions

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

These are a group of three ‘tile not empty’ functions. The first — tileEmpty(tile) checks whether the backgroundColor is empty, (or in the case of inserting photos, if the innerHTML is empty). The second — tileNotEmptyWarning() displays a warning in the alert div if the previous function returns true. The third function — clearWarning() is run every time a new click on a tile is received, clearing the inner text of the alert div.



**Step 9–3**: HTML Tile ID is converted into JavaScript Object tile position

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

After changing the UI when clicking on an empty tile, tileJSPosition(tile) gets tile.id when called then .split(“ “) with a space to get to seperate “x[num]”, of which position is splitTile[0], and “y[num]” coordinate, of which position is splitTile[1]. Then both these are .split(‘’) character by character slicing off the first character (x/y) and then rejoining and parseInt() to get the final x, y coordinates in JavaScript Object. The object looks something like this when the middle tile is clicked in a 3x3 {x: 2, y: 2}.



**Step 9–4**: The tile is added to the databased

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

Since the tile is placed by the current player before switchPlayer(), the array of the player’s move can be accessed with state.player[state.currentPlayer]. the whole previous object is assigned to tileObj, and then saved as the tile position. Additional info include a base point of 1 for each axis (x,y and the 2 diagonal axes).



**Step 9–5**: Switching player after move is done and all processes for the previous player finished

    function switchPlayer(prevPlayer) {
    
    state.currentPlayer = prevPlayer === "x" ? "o" : "x";
    
    }

This is a simple ternary function, which toggles state.currentPlayer. Now that we have visisted, explained and built all the supplementary functions of insertToken, we need to get to the most important piece, the function that gets executed before switchPlayer — addPointsToToken(tileObj)



**Step 10**: Adding points to tile’s point tracker and checking winning condition

    function addPointsToToken(tileObj) {
    
    winThroughXorY(tileObj, "x");
    
    winThroughXorY(tileObj, "y");
    
    winThroughDiagonalTopLeft(tileObj);
    
    winThroughDiagonalTopRight(tileObj);
    
    }

addPointsToToken(tileObj) is composed of three functions called on four axes. winThroughXorY is called on both ‘x’ and ‘y’ axes, then the two diagonal axes are called with winThroughDiagonalTopLeft and winThroughDiagonalTopRight.



##### The following is the code for winThroughXorY

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

state.player[state.currentPlayer].forEach((aTile)=> {}) iterates through each/ every/ a tile in the player’s move array. Then an if statement is checked whether

    (aTile.position[reverseCoordinate(coordinate)] ===
    
    tileObj.position[reverseCoordinate(coordinate)] &&
    
    (aTile.position[coordinate] === tileObj.position[coordinate] + 1 ||
    
    aTile.position[coordinate] === tileObj.position[coordinate] - 1))

returns true. This condition checks whether along the x or the y axis if the tile that was just placed is connnected with previously placed tiles of the same player. If this condition is fulfilled then mutatePoints() will add the total point of all tiles along x/y to each tile.

![](https://cdn-images-1.medium.com/max/2000/1*gBzKWlxWpJHHq9VEzcCccA.png)

To demonstrate this we have the following examples of two cases of X winning with 3 consecutive tiles. The coordinates for the first case are: X2 Y2, X3 Y2, X4 Y2. The coordinates for the second are X5 Y3, X5 Y4, X5 Y5.

In both cases, winning coordinate’s number stay the same, whilst the other coordinate numbers ascend (e.g. in the first case, Y2 stays the same, and X ascends with X2–3–4; in the second case, X5 stays the same, and Y ascends with Y3–4–5). Nevertheless, depending on how we count it, it can be either descending or ascending. As a tile can both be placed on the ascending or the descending side of the sequence.

Thus we can check coordinate ‘x’ with aTile.position[‘y’] === tileObj.position[‘y’] && aTile.position[‘x’] === tileObj.position[‘x’] + 1 || aTile.position[‘x’] === tileObj.position[‘x’] — 1

The first phrase before && checks whether the Y coordinate stays the same, and the second phrase checks whether X coordinate either ascends or descends. If we generalize this for both x and y cases then we get the above algorithm. Then we only need to call the algorithm to both X and Y axes. One of the supplementary function was reverseCoordinate, which is a simple toggle string function betweeen ‘x’ and ‘y’.

    function reverseCoordinate(token) {
    
    if (token === "x") {
    
    return "y";
    
    } else {
    
    return "x";
    
    }
    
    }

If this condition is satisfied then mutatePoints(aTile, tileObj, coordinate) is called.

    function mutatePoints(aTile, tileObj, position) {
    
    aTile.point[position] += tileObj.point[position];
    
    tileObj.point[position] = aTile.point[position];
    
    }

mutatePoints add the point of the selected coordinate case from the current tile (tileOblj) to the tile that satisfies the condition (aTile), and re-assign that value to the tileObj’s point of that coordinate.

Afterwards, the winning condition is checked, and if it is true then the winner is declared

    if (checkWinner(tileObj.point[coordinate])) declareWinner();

If the point of the tileObj at the selected coordinate is greater than or equal to the state.toWin variable then the winner is set.

    function checkWinner(point) {
    
    if (point >= state.toWin) {
    
    return true;
    
    }
    
    return false;
    
    }

The winner is called by simply modifying HTML elemtns in the UI

    function declareWinner() {
    
    DOM.alert.innerHTML = `<p>Player ${
    
    state.playerName[state.currentPlayer]
    
    } has won</p>`;
    
    gamePlayOff();
    
    }

Once the winner has been declared. The game must be stopped from further clicking, this can be done by removing all event listeners.

    function gamePlayOff() {
    
    DOM.tiles.forEach((tile) => {
    
    tile.removeEventListener("click", insertToken);
    
    });
    
    }

That is the end of winThroughXorY



##### The following is the code for winThroughDiagonalTopLeft and winThroughDiagonalTopRight

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

With the same logic, we first examine the case examples in the following excel examples

![](https://cdn-images-1.medium.com/max/2000/1*IGL_6Sv5_0nm5RURcQnExQ.png)

The winning sequences here are: (X2 Y3, X3 Y4, X4 Y5) & (X4 Y7 X3 Y8 X2 Y9). The pattern in these sequences is that for the first case with the top left being on the higher end, both X (X — 2–3–4) and Y (Y3–4–5) coordinates ascend proportionately, whilst for the second case, X and Y coordinates have an inverse pattern: while X descends (X4–3–2), Y ascends (Y7–8–9). By applying the same logic as the previous code we will be able to produce the code above. With this we have reached the end of step 10.



**Step 11**: Additional setting functionalities

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

To be able to dynamically generate empty tiles depending on board size input, all event listeners must be removed from default tiles (as they will eventually be removed). Hence gamePlayOff() must first be called. Then the board size number is validated (against being not a number and being empty), if this condition is satisfied, then the board’s html is removed and for the size of the board size input, each row and each cell in rows are created accordingly as shown above. Subsequently, the winning requirement number is validated before it is assigned to the state variable. After all these steps, the game is started by calling main(). However, finally and most importantly, these need to be called when the submit button is pressed for the inputs, hence we need to add an event listener on this element

    DOM.submitButton.addEventListener("click", (e) => {
    
    e.preventDefault();
    
    setting();
    
    });

This is the end of this tutorial. I hope it has not been ‘too long’.

Happy coding :)
