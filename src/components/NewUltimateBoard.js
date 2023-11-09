import { useState } from "react";
import NewBoard from "./NewBoard";

function NewUltimateBoard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [totalSquares, setTotalSquares] = useState(Array(81).fill(null));
  const [boxes, setBoxes] = useState(Array(9).fill(null));
  const [prevSquareIndex, setPrevSquareIndex] = useState(null);

  function getBoard(boardIndex) {
    return totalSquares.slice(boardIndex * 9, (boardIndex + 1) * 9);
  }

  let lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function singleBoardWinner(board) {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function ultimateBoardWinner() {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
        return boxes[a];
      }
    }
    return null;
  }

  function handleUltimateClick(boardIndex, squareIndex) {
    if (!isClickable(boardIndex)) {
      return;
    }
    if (getBoard(boardIndex)[squareIndex]) {
      return;
    }
    let board = getBoard(boardIndex);
    let updatedSquares = totalSquares.slice();
    let clickedSquareIndex = 9 * boardIndex + squareIndex;
    if (xIsNext) {
      updatedSquares[clickedSquareIndex] = "X";
      board[squareIndex] = "X";
    } else {
      updatedSquares[clickedSquareIndex] = "O";
      board[squareIndex] = "O";
    }
    setTotalSquares(updatedSquares);
    setXIsNext(!xIsNext);
    setPrevSquareIndex(squareIndex);

    if (singleBoardWinner(board)) {
      let updatedBoxes = boxes.slice();
      updatedBoxes[boardIndex] = singleBoardWinner(board);
      setBoxes(updatedBoxes);
      console.log(boxes);
    }
  }

  function boardIsFilled(boardIndex) {
    return getBoard(boardIndex).every((each) => each !== null);
  }

  function isClickable(boardIndex) {
    let board = getBoard(boardIndex);
    if (
      ultimateBoardWinner() ||
      singleBoardWinner(board) ||
      boardIsFilled(boardIndex)
    ) {
      return false;
    }
    let prevBoard = getBoard(prevSquareIndex);
    if (
      prevSquareIndex === null ||
      singleBoardWinner(prevBoard) ||
      boardIsFilled(prevSquareIndex)
    ) {
      return true;
    }
    return boardIndex === prevSquareIndex;
  }

  function isDraw(boardIndex) {
     return !singleBoardWinner(getBoard(boardIndex)) && boardIsFilled(boardIndex)
  }

  function notClickable(){
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

  let status;
  if (ultimateBoardWinner()) {
    status = "winner : " + ultimateBoardWinner();
  } else {
    if(notClickable()){
      status = "It's a Draw!!!"
    }
    else{
      status = "Next Player : " + (xIsNext ? "X" : "O")
    }
    
  }

  return (
    <div className="centering-ultimate-box">
      <div className="status-text-deco">{status}</div>
      <div className="ver border">
        <div className="hor">
          <NewBoard
            squares={getBoard(0)}
            handleClick={(squareIndex) => handleUltimateClick(0, squareIndex)}
            isClickable={isClickable(0)}
            winner={singleBoardWinner(getBoard(0))}
            isDraw={isDraw(0)}
          />
          <NewBoard
            squares={getBoard(1)}
            handleClick={(squareIndex) => handleUltimateClick(1, squareIndex)}
            isClickable={isClickable(1)}
            winner={singleBoardWinner(getBoard(1))}
            isDraw={isDraw(1)}
          />
          <NewBoard
            squares={getBoard(2)}
            handleClick={(squareIndex) => handleUltimateClick(2, squareIndex)}
            isClickable={isClickable(2)}
            winner={singleBoardWinner(getBoard(2))}
            isDraw={isDraw(2)}
          />
        </div>
        <div className="hor">
          <NewBoard
            squares={getBoard(3)}
            handleClick={(squareIndex) => handleUltimateClick(3, squareIndex)}
            isClickable={isClickable(3)}
            winner={singleBoardWinner(getBoard(3))}
            isDraw={isDraw(3)}
          />
          <NewBoard
            squares={getBoard(4)}
            handleClick={(squareIndex) => handleUltimateClick(4, squareIndex)}
            isClickable={isClickable(4)}
            winner={singleBoardWinner(getBoard(4))}
            isDraw={isDraw(4)}
          />
          <NewBoard
            squares={getBoard(5)}
            handleClick={(squareIndex) => handleUltimateClick(5, squareIndex)}
            isClickable={isClickable(5)}
            winner={singleBoardWinner(getBoard(5))}
            isDraw={isDraw(5)}
          />
        </div>
        <div className="hor">
          <NewBoard
            squares={getBoard(6)}
            handleClick={(squareIndex) => handleUltimateClick(6, squareIndex)}
            isClickable={isClickable(6)}
            winner={singleBoardWinner(getBoard(6))}
            isDraw={isDraw(6)}
          />
          <NewBoard
            squares={getBoard(7)}
            handleClick={(squareIndex) => handleUltimateClick(7, squareIndex)}
            isClickable={isClickable(7)}
            winner={singleBoardWinner(getBoard(7))}
            isDraw={isDraw(7)}
          />
          <NewBoard
            squares={getBoard(8)}
            handleClick={(squareIndex) => handleUltimateClick(8, squareIndex)}
            isClickable={isClickable(8)}
            winner={singleBoardWinner(getBoard(8))}
            isDraw={isDraw(8)}
          />
        </div>
      </div>
    </div>
  );
}

export default NewUltimateBoard;
