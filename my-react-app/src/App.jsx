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

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setIsStarted(true);

    const totalRequests = 1000;
    const requestPromises = [];
    let concurrencyLimit = Number(inputValue);
    let doneRequest = 0;

    // for (let i = 1; i <= totalRequests; i++) {
    //   requestPromises.push(fetch(`http://localhost:3000/api/${i}`));
    // }

    while (doneRequest < totalRequests) {
      for (let i = doneRequest + 1; i <= doneRequest + concurrencyLimit; i++) {
        requestPromises.push(fetch(`http://localhost:3000/api/${i}`));
      }
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

  const isButtonDisabled = isStarted || errorMessage;

  return (
    <>
      <form className="app-form" onSubmit={handleSubmitForm}>
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
          disabled={isButtonDisabled}
          className="start-button"
          type="submit"
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
      </form>
    </>
  );
}

export default App;
