import React, { useState, ChangeEvent } from "react";

import "./App.css";
import UserHistory from "./UserHistory";

export const DATE_KEY_FORMAT = "YYYYMMDD";

export enum AppState {
  PROMPT_FOR_USER_CREDS,
  USER_INPUT_ACCEPTED,
  ERROR,
}

function App() {
  const [userId, setUserId] = useState<string>("");
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [error, setError] = useState<Error>();
  const [appState, setAppState] = useState<AppState>(
    AppState.PROMPT_FOR_USER_CREDS
  );

  const setAppError = (error: Error) => {
    setError(error);
    setAppState(AppState.ERROR);
  };

  const handleUserIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleUserApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserApiKey(event.target.value);
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    setAppState(AppState.USER_INPUT_ACCEPTED);
  };

  // Start app right away with user ID and API key from URL params
  const urlUserId = window.location.search.split("?userId=")[1];
  const realurlUserId = urlUserId.split("&userapiKey=")[0];
  const urlUserApiKey = window.location.search.split("&userapiKey=")[1];

  // Fill form fields one by one from url params
  if (urlUserId && realurlUserId !== userId) {
    setUserId(realurlUserId);
  }

  if (urlUserApiKey && urlUserApiKey !== userApiKey) {
    setUserApiKey(urlUserApiKey);
  }

  // If both fields are filled, submit form
  if (urlUserId && urlUserApiKey && appState === AppState.PROMPT_FOR_USER_CREDS) {
    setAppState(AppState.USER_INPUT_ACCEPTED);
  }

  if (
    appState === AppState.PROMPT_FOR_USER_CREDS ||
    appState === AppState.ERROR
  ) {
    return (
      <div className="App">
        <h1>Habitica Tracker</h1>
        {error && <div className="error">Error: {error.message}</div>}
        <p>
          This tool displays a history of your Habits, Dailies and Todos in
          Habitica.
        </p>
        <p>
          Your User ID and API key can be found on the{" "}
          <a
            href="https://habitica.com/user/settings/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Settings &gt; API
          </a>{" "}
          page in Habitica.
        </p>
        <form className="user-api-form">
          <div className="label-container">
            <div className="label">User ID</div>
            <input
              type="text"
              className="user-id"
              value={userId}
              onChange={handleUserIdChange}
            />
          </div>
          <div className="label-container">
            <span className="label">API Key</span>
            <input
              type="password"
              className="api-key"
              value={userApiKey}
              onChange={handleUserApiKeyChange}
              minLength={36}
            />
          </div>
          <div className="submit-wrapper">
            <input type="submit" value="Fetch My Data" onClick={handleSubmit} />
          </div>
        </form>
        <h2>Note</h2>
        <ul>
          <li>
            Your user ID and API key will be sent to the Habitica servers and
            nowhere else.
          </li>
          <li>
            This app does not change your Habitica account data. It only fetches
            and displays data.
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <UserHistory
        userId={userId}
        userApiKey={userApiKey}
        setError={setAppError}
      />
    );
  }
}

export default App;
