function Square({ value, onSquareClick }) {
  return (
    <button
      className={value === "X" ? "square-btn blue" : "square-btn pink"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default Square;
