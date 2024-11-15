import { useState, useEffect } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import { Pie } from "react-chartjs-2";

export const App = () => {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [res, setRes] = useState(false);
  const [showText, setShowText] = useState(false);
  const [misspelledWords, setMisspelledWords] = useState({});
  const [activeWord, setActiveWord] = useState("");
  const [prediction, setPrediction] = useState({});

  const sendRequest = async (text) => {
    try {
      const response = await fetch("http://127.0.0.1:8080/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setResponseText(data.response);
      setMisspelledWords(data.suggestions || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (inputText.trim() !== "") {
      const cleaned = inputText.replace(/[.\/:"'-]/g, "");
      sendRequest(cleaned);
    }
  }, [inputText]);

  const getResponse = async () => {
    setRes(true);
    try {
      const response = await fetch("http://127.0.0.1:8080");
      const data = await response.json();
      setMisspelledWords(data.suggestions);
      console.log(data.suggestions);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setRes(false);
      setShowText(true);
    }
  };

  const getPrediction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/predict");
      const data = await response.json();
      console.log(data.prediction);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;

  const renderTextWithHighlights = () => {
    if (!responseText) return null;

    return (
      <p className="p-1">
        {" "}
        {responseText.split(" ").map((word, index) => {
          if (misspelledWords[word]) {
            return (
              <span key={index} className="misspelled-word" onClick={() => handleWordClick(word)}>
                {word}{" "}
              </span>
            );
          } else {
            return <span key={index}>{word} </span>;
          }
        })}
      </p>
    );
  };
  const handleWordClick = (word) => {
    setActiveWord(word);
    setSuggestions(misspelledWords[word] || []);
  };

  const handleSuggestionClick = (suggestion) => {
    const newText = responseText.replace(activeWord, suggestion);
    setResponseText(newText);
    setSuggestions([]);
  };

  return (
    <>
      <div className="main-con">
        <h1>Ugly dude.</h1>
        <div className="main">
          <div className="section1">
            {showText ? (
              renderTextWithHighlights()
            ) : (
              <textarea
                placeholder="Insert text here....."
                className="text-area"
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
              />
            )}
            <hr />
            <div className="section1-btn">
              <button onClick={getResponse}>{res ? "checking....." : "check"}</button>
              <button onClick={getPrediction}>analyze</button>
            </div>
          </div>
          <div className="section2">
            <div className="section2-analyze">
              Analyze hiih graph end haragdana sdakud mni. Ongon buur, Zandan tomor 2 sda mni.
            </div>
            <div className="section2-count-word">
              <span>{wordCount}/50</span>
            </div>
          </div>
          {activeWord && suggestions.length > 0 && (
            <div className="suggestions-box">
              <h4>Suggestions for "{activeWord}":</h4>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
