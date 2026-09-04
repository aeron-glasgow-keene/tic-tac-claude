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

function getResult(): Player | "draw" | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
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
  board.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.className = "cell" + (cell ? ` ${cell.toLowerCase()}` : "");
    btn.textContent = cell ?? "";
    btn.disabled = cell !== null || gameOver;
    btn.addEventListener("click", () => handleClick(index));
    boardEl.appendChild(btn);
  });
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
