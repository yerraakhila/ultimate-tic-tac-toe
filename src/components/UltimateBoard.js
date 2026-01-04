import React, { useState, useEffect } from "react";
import Board from "./Board";
import useStickyState from "../stickyState";
import { db, isFirebaseConfigured } from "../firebase";
import { ref, onValue, set, update } from "firebase/database";

function UltimateBoard({ mode = "local", roomCode, playerRole, onBack }) {
  const keyPrefix = mode === "online" ? `online_${roomCode}_` : "local_";

  const [xIsNext, setXIsNext] = useStickyState(true, keyPrefix + "xIsNext");
  const [totalSquares, setTotalSquares] = useStickyState(
    Array(81).fill(null),
    keyPrefix + "totalSquares"
  );
  const [boxes, setBoxes] = useStickyState(
    Array(9).fill(null),
    keyPrefix + "boxes"
  );
  const [prevSquareIndex, setPrevSquareIndex] = useStickyState(
    null,
    keyPrefix + "prevSquareIndex"
  );
  const [isLoading, setIsLoading] = useState(mode === "online");
  const [connectionError, setConnectionError] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const firebaseConfigured = isFirebaseConfigured();

  // Database Connection Monitoring
  useEffect(() => {
    if (mode === "online" && firebaseConfigured) {
      const connectedRef = ref(db, ".info/connected");
      const unsubscribe = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          console.log("UltimateBoard: Firebase Connected");
          setDbConnected(true);
        } else {
          console.log("UltimateBoard: Firebase Disconnected");
          setDbConnected(false);
        }
      });
      return () => unsubscribe();
    }
  }, [mode, firebaseConfigured]);

  // Firebase Synchronization
  useEffect(() => {
    console.log("UltimateBoard: Sync Effect ->", { mode, roomCode, firebaseConfigured });

    if (mode === "online" && roomCode && firebaseConfigured) {
      console.log("UltimateBoard: Connecting to Firebase room:", roomCode);
      const gameRef = ref(db, `games/${roomCode}`);

      // Fallback timeout to stop loading if Firebase hangs
      const timeout = setTimeout(() => {
        console.warn("UltimateBoard: Firebase connection timed out. Forcing load completion.");
        setIsLoading(false);
      }, 10000);

      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        console.log("UltimateBoard: Data received from Firebase:", data ? "Game exists" : "Initial Game Data Required");

        if (data) {
          if (data.totalSquares) {
            // Firebase may return arrays as objects if they have null gaps
            const squaresArr = Array.isArray(data.totalSquares)
              ? data.totalSquares
              : Object.assign(Array(81).fill(null), data.totalSquares);
            setTotalSquares(squaresArr);
          }
          if (data.boxes) {
            const boxesArr = Array.isArray(data.boxes)
              ? data.boxes
              : Object.assign(Array(9).fill(null), data.boxes);
            setBoxes(boxesArr);
          }
          if (data.prevSquareIndex !== undefined) setPrevSquareIndex(data.prevSquareIndex);
          if (data.xIsNext !== undefined) setXIsNext(data.xIsNext);
        } else {
          console.log("UltimateBoard: No data found at path, initializing...");
          set(gameRef, {
            totalSquares: Array(81).fill(null),
            boxes: Array(9).fill(null),
            prevSquareIndex: null,
            xIsNext: true,
          }).catch(err => {
            console.error("UltimateBoard: Init failed:", err);
            setConnectionError("Failed to initialize game data. Check your Database Rules.");
          });
        }
        setIsLoading(false);
        setConnectionError(null);
        clearTimeout(timeout);
      }, (error) => {
        console.error("UltimateBoard: Firebase onValue Error:", error);
        setConnectionError(error.message);
        setIsLoading(false);
        clearTimeout(timeout);
      });
      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } else if (mode === "online" && !firebaseConfigured) {
      console.warn("UltimateBoard: Firebase not configured, skipping sync.");
      setIsLoading(false);
    } else if (mode === "local") {
      setIsLoading(false);
    }
  }, [mode, roomCode, firebaseConfigured, setTotalSquares, setBoxes, setPrevSquareIndex, setXIsNext]);

  function getBoard(boardIndex) {
    return totalSquares.slice(boardIndex * 9, (boardIndex + 1) * 9);
  }

  let lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
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
    console.log(`UltimateBoard: Clicked board ${boardIndex}, square ${squareIndex}`);

    if (mode === "online") {
      if (!firebaseConfigured) return;
      const currentTurn = xIsNext ? "X" : "O";
      console.log(`UltimateBoard: Player Role: ${playerRole}, Turn: ${currentTurn}`);
      if (playerRole !== currentTurn) {
        console.warn("UltimateBoard: Not your turn!");
        return;
      }
    }

    if (!isClickable(boardIndex)) {
      console.warn("UltimateBoard: Square not clickable.");
      return;
    }
    if (getBoard(boardIndex)[squareIndex]) {
      return;
    }

    let board = getBoard(boardIndex);
    let updatedSquares = totalSquares.slice();
    let clickedSquareIndex = 9 * boardIndex + squareIndex;
    let turnValue = xIsNext ? "X" : "O";

    updatedSquares[clickedSquareIndex] = turnValue;
    board[squareIndex] = turnValue;

    let updatedBoxes = boxes.slice();
    if (singleBoardWinner(board)) {
      updatedBoxes[boardIndex] = singleBoardWinner(board);
    }

    const nextXIsNext = !xIsNext;
    const nextPrevSquareIndex = squareIndex;

    if (mode === "online" && firebaseConfigured) {
      const gameRef = ref(db, `games/${roomCode}`);
      update(gameRef, {
        totalSquares: updatedSquares,
        boxes: updatedBoxes,
        prevSquareIndex: nextPrevSquareIndex,
        xIsNext: nextXIsNext,
      }).catch(err => console.error("Firebase Update Error:", err));
    } else {
      setTotalSquares(updatedSquares);
      setXIsNext(nextXIsNext);
      setPrevSquareIndex(nextPrevSquareIndex);
      setBoxes(updatedBoxes);
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

    if (prevSquareIndex === null || prevSquareIndex < 0 || prevSquareIndex > 8) {
      return true;
    }

    let prevBoard = getBoard(prevSquareIndex);
    if (
      singleBoardWinner(prevBoard) ||
      boardIsFilled(prevSquareIndex)
    ) {
      return true;
    }
    return boardIndex === prevSquareIndex;
  }

  function isDraw(boardIndex) {
    return (
      !singleBoardWinner(getBoard(boardIndex)) && boardIsFilled(boardIndex)
    );
  }

  function notClickable() {
    for (let i = 0; i < 9; i++) {
      if (isClickable(i) === false) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  let status;
  const currentTurn = xIsNext ? "X" : "O";
  const isMyTurn = mode !== "online" || playerRole === currentTurn;

  if (ultimateBoardWinner()) {
    status = "Winner : " + ultimateBoardWinner();
  } else {
    if (notClickable()) {
      status = "It's a Draw!!!";
    } else {
      status = "Next Player : " + currentTurn;
      if (mode === "online") {
        status += isMyTurn ? " (You)" : " (Opponent)";
      }
    }
  }

  function handleReset() {
    const initialState = {
      totalSquares: Array(81).fill(null),
      prevSquareIndex: null,
      xIsNext: true,
      boxes: Array(9).fill(null),
    };

    if (mode === "online" && firebaseConfigured) {
      set(ref(db, `games/${roomCode}`), initialState)
        .catch(err => console.error("Firebase Reset Error:", err));
    } else {
      setTotalSquares(initialState.totalSquares);
      setPrevSquareIndex(initialState.prevSquareIndex);
      setXIsNext(initialState.xIsNext);
      setBoxes(initialState.boxes);
    }
  }

  if (isLoading) {
    return (
      <div className="centering" style={{ height: "90vh" }}>
        <h2>Loading Game...</h2>
        <div className="share-link">Connecting to Firebase Realtime Database</div>
      </div>
    );
  }

  const shareLink = `${window.location.origin}/${roomCode}`;

  return (
    <div className="centering-ultimate-box">
      <div className="board-div">
        {!firebaseConfigured && mode === "online" && (
          <div className="status-draw-deco red" style={{ fontSize: "16px", background: "#fee", padding: "10px", borderRadius: "5px" }}>
            <b>Firebase Error:</b> Please update <code>src/firebase.js</code> with your actual API keys.
          </div>
        )}

        {connectionError && (
          <div className="status-draw-deco red" style={{ fontSize: "14px", background: "#fee", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            <b>Connection Error:</b> {connectionError}. <br />
            Check your Firebase Realtime Database URL and Rules.
          </div>
        )}

        {mode === "online" && firebaseConfigured && !dbConnected && !isLoading && (
          <div className="status-draw-deco red" style={{ fontSize: "14px", background: "#fee", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
            <b>Offline:</b> Unable to connect to Firebase. <br />
            Please verify your <code>databaseURL</code> in <code>src/firebase.js</code> and ensure the database is enabled in the console.
          </div>
        )}

        <div
          style={{ margin: "0px" }}
          className={
            ultimateBoardWinner()
              ? "status-winner-deco green"
              : notClickable()
                ? "status-draw-deco red"
                : xIsNext
                  ? "status-next-text-deco blue"
                  : "status-next-text-deco pink"
          }
        >
          {status}
        </div>

        {mode === "online" && (
          <div className="room-info" style={{ textAlign: "center", marginBottom: "10px" }}>
            <div className={`room-code-display ${!isMyTurn ? 'gray' : ''}`} style={{ padding: "10px" }}>
              Room Code: <span className="room-code-text">{roomCode}</span>
              <div style={{ fontSize: "14px", marginTop: "5px" }}>
                You are playing as <b>{playerRole}</b>
                {!isMyTurn && <span className="red"> (Wait for opponent)</span>}
              </div>
            </div>
            <div className="invite-section">
              <div className="share-link-label">Invite Link:</div>
              <div className="copy-container">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="share-input"
                />
                <button
                  className={`copy-button ${copied ? 'success' : ''}`}
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`ultimate-board ${!isMyTurn ? 'disabled' : ''}`}>
          <div className="ver border">
            {[0, 1, 2].map((row) => (
              <div className="hor" key={row}>
                {[0, 1, 2].map((col) => {
                  const idx = row * 3 + col;
                  return (
                    <Board
                      key={idx}
                      squares={getBoard(idx)}
                      handleClick={(squareIndex) => handleUltimateClick(idx, squareIndex)}
                      isClickable={isClickable(idx)}
                      winner={singleBoardWinner(getBoard(idx))}
                      isDraw={isDraw(idx)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleReset}>Reset Board</button>
          <button onClick={onBack} style={{ backgroundColor: "#666" }}>Back to Lobby</button>
        </div>
      </div>
      <div className="without-board">
        <div className="rules">
          <h2>Rules:</h2>
          <p>1. The first player can place their designated shape at any of the 81 squares provided.</p>
          <p>2. Whichever square that the first player places in a small tic tac toe, determines which square of the large tic tac toe the next player gets to place their shape at. They are confined to that small tic tac toe ONLY.</p>
          <p>3. Should that particular small tic tac toe be occupied already, the player that was sent there can choose to place their shape at any available spot in the larger space.</p>
          <p>4. The square is conquered by the player that achieves the 3 in a row for that particular small tic tac toe.</p>
          <p>5. Should a draw be achieved in that small tic tac toe, that square is considered wasted and remains at a draw.</p>
        </div>
      </div>
    </div>
  );
}

export default UltimateBoard;

