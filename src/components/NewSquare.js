function NewSquare({value,onSquareClick}){
    return(
        <button className="make-square" onClick={onSquareClick}>{value}</button>
    )
}

export default NewSquare;