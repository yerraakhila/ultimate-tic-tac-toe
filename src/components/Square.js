function Square({value,onSquareClick}){
    return(
        <button className="make-square" onClick={onSquareClick}>{value}</button>
    )
}

export default Square;