import Square from "./Square";

function Board({ squares, handleClick, winner, isClickable, isDraw}) {
    return (
        <div className={isClickable ? "border-for-box clickable" : isDraw ? "border-for-box not-clickable": !winner ? "border-for-box " : "border-for-box not-clickable"}>
            <div className={winner ? winner === "X" ? "position blue" : " position pink" : isDraw ? "position red" : "position"}>{winner ? winner : isDraw ? "D" : null}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </div>
    )
}

export default Board;
