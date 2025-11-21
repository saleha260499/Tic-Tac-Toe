import React, { useState, useEffect } from 'react';
import './App.css';

// ---------- Game Logic ---------- //
const wins = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const checkWinner = (board) => {
  for (let [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes('') ? null : 'Tie';
};

const availableMoves = (board) => board.map((v, i) => v === '' ? i : null).filter(i => i !== null);

const minimax = (board, depth, isMax, ai, human) => {
  const winner = checkWinner(board);
  if (winner === ai) return 10 - depth;
  if (winner === human) return depth - 10;
  if (winner === 'Tie') return 0;

  if (isMax) {
    let best = -Infinity;
    for (let m of availableMoves(board)) {
      board[m] = ai;
      best = Math.max(best, minimax(board, depth + 1, false, ai, human));
      board[m] = '';
    }
    return best;
  } else {
    let best = Infinity;
    for (let m of availableMoves(board)) {
      board[m] = human;
      best = Math.min(best, minimax(board, depth + 1, true, ai, human));
      board[m] = '';
    }
    return best;
  }
};

const bestMove = (board, ai, human) => {
  let bestScore = -Infinity;
  let moveChoice = null;
  for (let m of availableMoves(board)) {
    board[m] = ai;
    let score = minimax(board, 0, false, ai, human);
    board[m] = '';
    if (score > bestScore) {
      bestScore = score;
      moveChoice = m;
    }
  }
  return moveChoice;
};

// ---------- React App ---------- //
function App() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState('AI'); // AI or HUMAN

  const human = 'X';
  const ai = 'O';

  const handleClick = (idx) => {
    if (!winner && board[idx] === '') {
      const newBoard = [...board];
      newBoard[idx] = turn;
      setBoard(newBoard);
      setTurn(mode === 'HUMAN' ? (turn === 'X' ? 'O' : 'X') : ai);
    }
  };

  useEffect(() => {
    const w = checkWinner(board);
    setWinner(w);

    if (mode === 'AI' && turn === ai && !w) {
      const move = bestMove(board, ai, human);
      if (move !== null) {
        const newBoard = [...board];
        newBoard[move] = ai;
        setBoard(newBoard);
      }
      setTurn(human);
    }
  }, [board, turn, mode]);

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setWinner(null);
    setTurn('X');
  };

  return (
    <div className="App">
      <h1>Tic-Tac-Toe</h1>
      <div>
        <button onClick={() => setMode('AI')} disabled={mode === 'AI'}>Human vs AI</button>
        <button onClick={() => setMode('HUMAN')} disabled={mode === 'HUMAN'}>Human vs Human</button>
      </div>
      <div className="board">
        {board.map((cell, i) => (
          <div key={i} className="cell" onClick={() => handleClick(i)}>
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="winner">
          {winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`}
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default App;
