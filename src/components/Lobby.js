import React, { useState } from "react";

function Lobby({ onStartGame }) {
    const [joinCode, setJoinCode] = useState("");

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreateRoom = () => {
        const code = generateCode();
        // Persist role first so it's available after navigation
        localStorage.setItem(`room_role_${code}`, "X");
        // Explicitly navigate to the clean URL
        window.location.href = `/${code}`;
    };

    const handleJoinRoom = () => {
        if (joinCode.length === 6) {
            onStartGame("online", joinCode, "O");
        } else {
            alert("Please enter a valid 6-character room code.");
        }
    };

    const handlePassAndPlay = () => {
        onStartGame("local");
    };

    return (
        <div className="lobby-container">
            <h1 className="lobby-title">Ultimate Tic-Tac-Toe</h1>

            <div className="lobby-options">
                <button className="lobby-button secondary" onClick={handlePassAndPlay}>
                    Pass & Play (Local)
                </button>

                <div style={{ textAlign: "center", margin: "10px 0", color: "#666" }}>
                    — OR —
                </div>

                <button className="lobby-button primary" onClick={handleCreateRoom}>
                    Create Online Game
                </button>

                <div className="join-section">
                    <input
                        type="text"
                        className="join-input"
                        placeholder="Enter Room Code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        maxLength={6}
                    />
                    <button className="lobby-button primary" onClick={handleJoinRoom} style={{ padding: "10px 20px" }}>
                        Join
                    </button>
                </div>
            </div>

            <div className="rules" style={{ marginTop: "40px", maxWidth: "600px" }}>
                <h3>How Multiplayer Works:</h3>
                <p>1. <b>Create:</b> Start a game and share the code/link with a friend.</p>
                <p>2. <b>Join:</b> Enter a code or click a shared link to join a friend's game.</p>
                <p>3. <b>Real-time:</b> Moves sync instantly across both players' screens!</p>
            </div>
        </div>
    );
}

export default Lobby;
