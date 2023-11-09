import Board from "./Board";
import { useState } from "react";

function UltimateBoard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9 * 9).fill(null));
  const [boxes, setBoxes] = useState(Array(9).fill(null));
  const [prevSquareIndex, setPrevSquareIndex] = useState(null);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  function calculateWinner(board) {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function calculateUltimateWinner() {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
        return boxes[a];
      }
    }
    return null;
  }

  function getBoard(boardIndex) {
    return squares.slice(boardIndex * 9, 9 * (boardIndex + 1));
  }

  function handleUltimateClick(boardIndex, squareIndex) {
    if (!isClickable(boardIndex)) return;
    if (calculateUltimateWinner()) {
      return;
    }
    let board = getBoard(boardIndex);
    if (board[squareIndex] || calculateWinner(board)) {
      return;
    }
    const updatedSquares = squares.slice();
    let ultimateSquareIndex = boardIndex * 9 + squareIndex;
    if (xIsNext) {
      updatedSquares[ultimateSquareIndex] = "X";
      board[squareIndex] = "X";
    } else {
      updatedSquares[ultimateSquareIndex] = "O";
      board[squareIndex] = "O";
    }
    setXIsNext(!xIsNext);
    setSquares(updatedSquares);
    if (calculateWinner(board)) {
      let updatedBoxes = boxes.slice();
      updatedBoxes[boardIndex] = calculateWinner(board);
      setBoxes(updatedBoxes);
    }

    setPrevSquareIndex(squareIndex);
  }

  function notClickable() {
    for(let i=0;i<9;i++){
        if(isClickable(i) === false){
            continue
        }
        else{
            return false
        }
    }
    return true
  }

  const winner = calculateUltimateWinner();
  let status;
  
  if (winner) {
    status = "Winner: " + winner;
  } else {
    console.log(notClickable())
    if (notClickable() && prevSquareIndex) {
      status = "It's a draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  function isClickable(boardIndex) {
    if (calculateUltimateWinner()) {
      return false;
    }
    let boardIsFilled = getBoard(boardIndex).every((each) => each !== null);
    if (boardIsFilled) {
      return false;
    }
    // Initially user can click anywhere
    if (prevSquareIndex === null) {
      return true;
    }
    // If the current board is already won.
    if (boxes[boardIndex]) {
      return false;
    }
    // if the previously  directed board is already won,
    // then all boards are clickable.
    if (boxes[prevSquareIndex]) {
      return true;
    }
    if(getBoard(prevSquareIndex).every((each)=> each !== null)){
        return true;
    }
    // If previousy directed to current baord.
    return prevSquareIndex === boardIndex;
  }
  function isDraw(i){
    if(!calculateWinner(getBoard(i)) && getBoard(i).every((each)=> each !== null)){
        return true;
    }
    return false;
  }
  return (
    <div className="centering">
      <p className={winner ? "green sizing" : "red sizing"}>{status}</p>
      <div className="border-for-box for-display">
        <div className="rows">
          <Board
            squares={getBoard(0)}
            handleClick={(idx) => handleUltimateClick(0, idx)}
            winner={boxes[0]}
            isClickable={isClickable(0)}
            isDraw={isDraw(0)}
          />
          <Board
            squares={getBoard(1)}
            handleClick={(idx) => handleUltimateClick(1, idx)}
            winner={boxes[1]}
            isClickable={isClickable(1)}
            isDraw={isDraw(1)}
          />
          <Board
            squares={getBoard(2)}
            handleClick={(idx) => handleUltimateClick(2, idx)}
            winner={boxes[2]}
            isClickable={isClickable(2)}
            isDraw={isDraw(2)}
          />
        </div>
        <div className="rows">
          <Board
            squares={getBoard(3)}
            handleClick={(idx) => handleUltimateClick(3, idx)}
            winner={boxes[3]}
            isClickable={isClickable(3)}
            isDraw={isDraw(3)}
          />
          <Board
            squares={getBoard(4)}
            handleClick={(idx) => handleUltimateClick(4, idx)}
            winner={boxes[4]}
            isClickable={isClickable(4)}
            isDraw={isDraw(4)}
          />
          <Board
            squares={getBoard(5)}
            handleClick={(idx) => handleUltimateClick(5, idx)}
            winner={boxes[5]}
            isClickable={isClickable(5)}
            isDraw={isDraw(5)}
          />
        </div>
        <div className="rows">
          <Board
            squares={getBoard(6)}
            handleClick={(idx) => handleUltimateClick(6, idx)}
            winner={boxes[6]}
            isClickable={isClickable(6)}
            isDraw={isDraw(6)}
          />
          <Board
            squares={getBoard(7)}
            handleClick={(idx) => handleUltimateClick(7, idx)}
            winner={boxes[7]}
            isClickable={isClickable(7)}
            isDraw={isDraw(7)}
          />
          <Board
            squares={getBoard(8)}
            handleClick={(idx) => handleUltimateClick(8, idx)}
            winner={boxes[8]}
            isClickable={isClickable(8)}
            isDraw={isDraw(8)}
          />
        </div>
      </div>
      <button className="button-deco">Reset Board</button>
    </div>
  );
}

export default UltimateBoard;
