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
  const game = GameController();
  const playerTurnDisplay = document.getElementById("turn");
  const boardDisplay = document.querySelector(".board");

  const updateScreen = () => {
    boardDisplay.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDisplay.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
        boardDisplay.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow && !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDisplay.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
}

console.log("test");
ScreenController();

// const game = GameController();
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(1, 0);
// game.playRound(2, 1);
// game.playRound(0, 0);
// game.playRound(0, 2);
// game.playRound(2, 0);
