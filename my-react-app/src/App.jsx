import { useState } from "react";
import "./App.css";

const defaultValue = "";

function App() {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [requests, setRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState(defaultValue);
  const [isStarted, setIsStarted] = useState(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value < 0 || value > 100) {
      setErrorMessage("Error: Please enter a valid concurrency limit (0-100).");
      return;
    }
    setErrorMessage(defaultValue);
  };

  const handleStartClick = async () => {
    setIsStarted(true);

    const totalRequests = 1000;
    const requestPromises = [];
    let concurrencyLimit = Number(inputValue);
    let doneRequest = 0;

    for (let i = 1; i <= totalRequests; i++) {
      requestPromises.push(fetch(`http://localhost:3000/api/${i}`));
    }

    while (doneRequest < totalRequests) {
      const startTime = Date.now();

      const promiseToResolve = requestPromises.slice(
        doneRequest,
        doneRequest + concurrencyLimit
      );
      const result = await Promise.all(promiseToResolve);
      const resultJSON = await Promise.all(result.map((r) => r.json()));

      const elapsedTime = Date.now() - startTime;
      const remainingTime = 1000 - elapsedTime;

      setRequests((prevRequests) => [...prevRequests, ...resultJSON]);
      doneRequest += Number(inputValue);

      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    setIsStarted(false);
  };

  return (
    <>
      <div className="app-container">
        <input
          type="number"
          required
          min={0}
          max={100}
          value={inputValue}
          onChange={handleInputChange}
          className="input-field"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          disabled={isStarted}
          onClick={handleStartClick}
          className="start-button"
        >
          {isStarted ? "Running..." : "Start"}
        </button>
        <ul className="request-list">
          {requests.map((request, index) => (
            <li key={index} className="request-item">
              Request: {request}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
