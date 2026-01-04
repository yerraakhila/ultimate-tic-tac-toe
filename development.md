# Development and Deployment Instructions

This guide provides instructions on how to set up the development environment, run the application locally, and deploy it to Google Firebase Hosting.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yerraakhila/ultimate-tic-tac-toe.git
    cd ultimate-tic-tac-toe
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

---

## Deployment

This application is deployed using Google Firebase Hosting.

### Prerequisites

You need the Firebase CLI to deploy. Install it globally using npm:

```bash
npm install -g firebase-tools
```

### Deployment Steps

1.  **Login to Firebase**:
    ```bash
    firebase login
    ```

2.  **Initialize Firebase (if not already done)**:
    ```bash
    firebase init
    ```
    > [!IMPORTANT]
    > When prompted for the **public directory**, type `build` (not the default `public`). For React applications, `build` contains the compiled code, while `public` only contains source assets.

3.  **Build the Project**:
    Ensure you have the latest production build:
    ```bash
    npm run build
    ```

4.  **Deploy to Firebase**:
    ```bash
    firebase deploy
    ```

After deployment, your app will be live at the URL specified in your Firebase console or the one shown in the terminal.

---

## Online Multiplayer Setup (Firebase Realtime Database)

The online multiplayer feature uses Firebase Realtime Database. Configuration is handled via environment variables for security.

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the prompts.

### 2. Enable Realtime Database
1. In the left sidebar, go to **Build > Realtime Database**.
2. Click **Create Database** and choose your region (e.g., `asia-southeast1`).
3. Start in **Test Mode** (allows anyone to read/write for development).
4. **Publish** the rules:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

### 3. Configure Environment Variables
Instead of modifying `src/firebase.js` directly, create a `.env` file in the project root:

1. Copy `.env.example` to `.env`.
2. Populate the values from your Firebase Project Settings.
3. **Note**: All variables must start with `REACT_APP_` for Create React App to recognize them.

```bash
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app
...
```

### 4. Deployment to Hosting
Deploy locally with:
```bash
npm run build && firebase deploy
```
If using GitHub Actions, ensure you add these variables as **GitHub Secrets**.

---

## Debugging Multiplayer

To test synchronization in a single browser, use the `playerId` URL parameter to force your role in a second tab:

1. Create a game in Tab 1 (e.g., `/ABCDEF`).
2. Open Tab 2 at `/ABCDEF?playerId=O`.
3. You can now play against yourself to verify state sync.

---

## Troubleshooting

### "Offline: Unable to connect to Firebase"
1. **Region Mismatch**: Ensure your `REACT_APP_FIREBASE_DATABASE_URL` includes the region if yours isn't in the US (e.g., `.asia-southeast1.firebasedatabase.app` vs `.firebaseio.com`).
2. **Rules**: Verify rules are set to `true` in the Realtime Database section (NOT Cloud Firestore).
3. **Connectivity**: Check your browser console for `Firebase Connected` logs.

### "TypeError: totalSquares.slice is not a function"
This occurs if the database state is corrupt or initialized as an object. The app handles this by converting it back to an array, but a "Reset Board" in the UI usually fixes persistent state issues.


