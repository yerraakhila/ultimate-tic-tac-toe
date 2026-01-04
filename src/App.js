import React, { useState, useEffect } from "react";
import UltimateBoard from "./components/UltimateBoard";
import Header from "./components/Header";
import Lobby from "./components/Lobby";

function App() {
  const [gameState, setGameState] = useState({
    mode: null, // 'local' or 'online'
    roomCode: null,
    playerRole: null, // 'X' or 'O'
  });

  // Handle player session persistence and deep linking on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryRoom = params.get("room");
    const forcedRole = params.get("playerId")?.toUpperCase();
    const isValidRole = (role) => role === "X" || role === "O";

    // Check path for room code (strip slashes, take first segment)
    let pathRoom = window.location.pathname.split('/').filter(Boolean)[0] || "";
    pathRoom = pathRoom.toUpperCase();

    const isCode = (str) => /^[A-Z0-9]{6}$/.test(str);
    const room = isCode(pathRoom) ? pathRoom : (isCode(queryRoom) ? queryRoom : null);

    console.log("App: Room check -> Path segment:", pathRoom, "Query param:", queryRoom, "Forced Role:", forcedRole, "Selected:", room);

    if (room) {
      if (isValidRole(forcedRole)) {
        console.log("App: Using forced role from URL:", forcedRole);
        setGameState({ mode: "online", roomCode: room, playerRole: forcedRole });
      } else {
        // Check if we have a saved role for this specific room
        const savedRole = localStorage.getItem(`room_role_${room}`);
        console.log("App: Role in storage for room:", room, "is:", savedRole);

        if (savedRole) {
          setGameState({ mode: "online", roomCode: room, playerRole: savedRole });
        } else {
          // First time joining this room -> Join as player O
          handleStartGame("online", room, "O");
        }
      }
    }
  }, []);

  const handleStartGame = (mode, roomCode = null, playerRole = null) => {
    setGameState({ mode, roomCode, playerRole });
    if (mode === "online" && roomCode) {
      // Persist the role for this room session
      localStorage.setItem(`room_role_${roomCode}`, playerRole);

      // Transition to a clean shareable URL: /ROOM_CODE
      const newUrl = `${window.location.origin}/${roomCode}`;
      window.history.pushState({ roomCode }, "", newUrl);
    }
  };

  const handleBackToLobby = () => {
    setGameState({ mode: null, roomCode: null, playerRole: null });
    // Reset URL if there was a room param
    window.history.replaceState({}, document.title, "/");
  };

  return (
    <div className="home">
      <Header />
      {!gameState.mode ? (
        <Lobby onStartGame={handleStartGame} />
      ) : (
        <UltimateBoard
          mode={gameState.mode}
          roomCode={gameState.roomCode}
          playerRole={gameState.playerRole}
          onBack={handleBackToLobby}
        />
      )}
    </div>
  );
}

export default App;


