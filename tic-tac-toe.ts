/**
 * Tic Tac Toe — browser version, written in TypeScript.
 * This file gets compiled to tic-tac-toe.js, which index.html loads.
 */

type Player = "X" | "O";
type Cell = Player | null;

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

let board: Cell[] = Array(9).fill(null);
let currentPlayer: Player = "X";
let gameOver = false;

const boardEl = document.getElementById("board") as HTMLDivElement;
const statusEl = document.getElementById("status") as HTMLParagraphElement;
const resetBtn = document.getElementById("reset") as HTMLButtonElement;

function getWinningLine(): number[] | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }

  return null;
}

function getResult(): Player | "draw" | null {
  const winningLine = getWinningLine();
  if (winningLine) return board[winningLine[0]] as Player;

  if (board.every((cell) => cell !== null)) return "draw";
  return null;
}

function handleClick(index: number) {
  if (gameOver || board[index] !== null) return;

  board[index] = currentPlayer;

  const result = getResult();
  if (result === "draw") {
    statusEl.textContent = "It's a draw!";
    gameOver = true;
  } else if (result) {
    statusEl.textContent = `Player ${result} wins!`;
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
  }

  render();
}

function render() {
  boardEl.innerHTML = "";
  boardEl.style.position = "relative";

  board.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.className = "cell" + (cell ? ` ${cell.toLowerCase()}` : "");
    btn.textContent = cell ?? "";
    btn.disabled = cell !== null || gameOver;
    btn.addEventListener("click", () => handleClick(index));
    boardEl.appendChild(btn);
  });

  const winningLine = getWinningLine();

  if (winningLine) {
    const [start, , end] = winningLine;
    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    line.setAttribute("viewBox", "0 0 3 3");
    line.style.position = "absolute";
    line.style.inset = "0";
    line.style.width = "100%";
    line.style.height = "100%";
    line.style.pointerEvents = "none";
    line.style.zIndex = "2";

    const startX = (start % 3) + 0.5;
    const startY = Math.floor(start / 3) + 0.5;
    const endX = (end % 3) + 0.5;
    const endY = Math.floor(end / 3) + 0.5;

    const winningStroke = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );

    winningStroke.setAttribute("x1", String(startX));
    winningStroke.setAttribute("y1", String(startY));
    winningStroke.setAttribute("x2", String(endX));
    winningStroke.setAttribute("y2", String(endY));
    winningStroke.setAttribute("stroke", "black");
    winningStroke.setAttribute("stroke-width", "0.08");
    winningStroke.setAttribute("stroke-linecap", "round");

    line.appendChild(winningStroke);
    boardEl.appendChild(line);
  }
}

function reset() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  statusEl.textContent = "Player X's turn";
  render();
}

resetBtn.addEventListener("click", reset);

render();
