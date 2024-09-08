function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const claimCell = (row, column, player) => {
    const cell = board[row][column];
    const cellAvailable = cell.getValue() === 0;

    if (cellAvailable) {
      cell.fillCell(player);
    }
  };

  const printBoard = () => {
    console.table(getBoard().map((row) => row.map((cell) => cell.getValue())));
  };

  const getBoard = () => board;

  return { claimCell, getBoard, printBoard };
}

function Cell() {
  let value = 0;

  const fillCell = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    fillCell,
    getValue,
  };
}

function Player() {}

function GameController() {
  playerOneName = "Player 1";
  playerTwoName = "Player 2";

  const board = GameBoard();

  const players = [
    {
      name: playerOneName,
      shape: "1",
    },
    {
      name: playerTwoName,
      shape: "2",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinCondition = () => {
    const boardState = board.getBoard(); // Get the board array

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        boardState[i][0].getValue() !== 0 &&
        boardState[i][0].getValue() === boardState[i][1].getValue() &&
        boardState[i][1].getValue() === boardState[i][2].getValue()
      ) {
        return boardState[i][0].getValue(); // Return the winning player
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        boardState[0][i].getValue() !== 0 &&
        boardState[0][i].getValue() === boardState[1][i].getValue() &&
        boardState[1][i].getValue() === boardState[2][i].getValue()
      ) {
        return boardState[0][i].getValue(); // Return the winning player
      }
    }

    // Check diagonals
    if (
      boardState[0][0].getValue() !== 0 &&
      boardState[0][0].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][2].getValue()
    ) {
      return boardState[0][0].getValue(); // Return the winning player
    }
    if (
      boardState[0][2].getValue() !== 0 &&
      boardState[0][2].getValue() === boardState[1][1].getValue() &&
      boardState[1][1].getValue() === boardState[2][0].getValue()
    ) {
      return boardState[0][2].getValue(); // Return the winning player
    }
  };

  const isBoardFull = () => {
    return board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  const playRound = (row, column) => {
    console.log(
      `Adding ${
        getActivePlayer().name
      }'s shape into row ${row}, column ${column}...`
    );
    board.claimCell(row, column, getActivePlayer().shape);

    const result = checkWinCondition();
    if (result) {
      board.printBoard();
      console.log(`Player ${result} wins!`);
      return "win";
    } else if (isBoardFull()) {
      board.printBoard();
      console.log("It's a draw!");
      return "draw";
    } else {
      switchPlayerTurn();
      printNewRound();
    }
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  let game = GameController();
  const playerTurnDisplay = document.getElementById("turn");
  const playAgain = document.getElementById("play-again");
  const playAgainBtn = document.getElementById("play-again-button");
  const boardDisplay = document.querySelector(".board");

  const playerOneSVG =
    '<svg id="cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M17,8.4L13.4,12L17,15.6L15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4Z" /></svg>';

  const playerTwoSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>circle</title><circle cx="12" cy="12" r="5.5" /></svg>';

  const updateScreen = () => {
    boardDisplay.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDisplay.innerHTML = `<b>${activePlayer.name}'s</b> turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        if (cell.getValue() === "1") {
          cellButton.innerHTML = playerOneSVG;
        }
        if (cell.getValue() === "2") {
          cellButton.innerHTML = playerTwoSVG;
        }

        // Disable the button if the cell has already been claimed.
        if (cell.getValue() !== 0) {
          cellButton.disabled = true;
        }
        boardDisplay.appendChild(cellButton);
      });
    });
  };

  const onGameFinish = (gameResult) => {
    boardDisplay.textContent = "";

    const board = game.getBoard();

    if (gameResult === "win") {
      const activePlayer = game.getActivePlayer();
      playerTurnDisplay.innerHTML = `<u><b>${activePlayer.name}</b></u> won!`;
    } else if (gameResult === "draw") {
      playerTurnDisplay.innerHTML = `<u><b>It's a draw!</b></u>`;
    }

    playAgain.style.display = "flex";

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.disabled = true;
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;

        if (cell.getValue() === "1") {
          cellButton.innerHTML = playerOneSVG;
        }
        if (cell.getValue() === "2") {
          cellButton.innerHTML = playerTwoSVG;
        }

        boardDisplay.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    const gameResult = game.playRound(selectedRow, selectedColumn);
    if (gameResult) {
      onGameFinish(gameResult);
    } else {
      updateScreen();
    }
  }

  function resetGame() {
    playAgain.style.display = "none";
    game = GameController();

    updateScreen();
  }

  boardDisplay.addEventListener("click", clickHandlerBoard);
  playAgainBtn.addEventListener("click", resetGame);

  // Initial render
  updateScreen();
}

ScreenController();
