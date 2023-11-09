import  NewSquare from "./NewSquare";

function NewBoard({squares, handleClick, isClickable, winner, isDraw}) {
  return (
    <div className={isClickable ? "relative clickable-box" : isDraw ? "relative gray" : "relative"}>
      <div className={winner ? winner==="X" ? "absolute blue block-with-winner" : "absolute pink block-with-winner" : isDraw ? "absolute red block-with-winner" : "absolute"}>{winner ? winner : isDraw ? "!" : ""}</div>
      <div className="ver border">
        <div className="hor">
          <NewSquare value={squares[0]} onSquareClick={()=>handleClick(0)} />
          <NewSquare value={squares[1]} onSquareClick={()=>handleClick(1)} />
          <NewSquare value={squares[2]} onSquareClick={()=>handleClick(2)}/>
        </div>
        <div className="hor">
          <NewSquare value={squares[3]} onSquareClick={()=>handleClick(3)}/>
          <NewSquare value={squares[4]} onSquareClick={()=>handleClick(4)}/>
          <NewSquare value={squares[5]} onSquareClick={()=>handleClick(5)}/>
        </div>
        <div className="hor">
          <NewSquare value={squares[6]} onSquareClick={()=>handleClick(6)}/>
          <NewSquare value={squares[7]} onSquareClick={()=>handleClick(7)}/>
          <NewSquare value={squares[8]} onSquareClick={()=>handleClick(8)}/>
        </div>
      </div>
    </div>
  );
}

export default NewBoard;