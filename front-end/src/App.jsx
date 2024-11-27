import React, { useState, useEffect } from "react";
import "./App.css";
import { Chart } from "./features/Chart";
import { MdContentCopy } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { BsFileText } from "react-icons/bs";
import { DuplicatedWords } from "./features/DuplicatedWords";
import axios from "axios";
import { Loader } from "./features/Loader";
import img1 from "./assets/binocular.png";

const VerticalDivider = () => <div className="vertical-divider" />;

// Reusable Button Component
const ButtonWithIcon = ({ icon: Icon, onClick, tooltip }) => (
  <button
    className="icon-btn"
    onClick={onClick}
    title={tooltip}
    style={{ background: "none", border: "none", cursor: "pointer" }}
  >
    <Icon size={30} />
  </button>
);

export const App = () => {
  const [inputText, setInputText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [misspelledWords, setMisspelledWords] = useState({});
  const [activeWord, setActiveWord] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const [news, setNews] = useState([1, 1, 1, 1, 1, 1]);
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);

  // Count words and letters
  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setLetterCount(inputText.replace(/\s+/g, "").length);
  }, [inputText]);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(inputText).then(
      () => alert("Text copied!"),
      (err) => console.error("Could not copy text:", err)
    );
  };

  // Delete text
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to clear the text?")) {
      setInputText("");
    }
  };

  // Simulate paste functionality
  const handlePaste = () => {
    navigator.clipboard.readText().then(
      (text) => setInputText((prev) => prev + text),
      (err) => console.error("Could not paste text:", err)
    );
  };

  const getResponse = async () => {
    if (wordCount > 50) {
      alert("Ugiin too heterchlee.");
      return;
    }
    setLoader(true);
    try {
      const response = await axios.get("http://localhost:8080/");
      setMisspelledWords(response.data.suggestions || {});
      setShowTextArea(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div className="main-con">
        <div className="left-con">
          <h1 className="header-text">Text Analysis App</h1>
          {!showTextArea ? (
            <textarea
              className="text-area"
              placeholder="Enter text here..."
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
            />
          ) : (
            <div className="highlighted-text">
              {/* Highlighted text functionality can go here */}
              {responseText}
            </div>
          )}

          <div className="three-btn-con">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ButtonWithIcon
                icon={MdContentCopy}
                onClick={handleCopy}
                tooltip="Copy Text"
              />
              <VerticalDivider />
              <ButtonWithIcon
                icon={MdDeleteOutline}
                onClick={handleDelete}
                tooltip="Clear Text"
              />
              <VerticalDivider />
              <ButtonWithIcon
                icon={BsFileText}
                onClick={handlePaste}
                tooltip="Paste Text"
              />
            </div>

            <div className="count-word-letter-con">
              <div>{wordCount}/50 үг</div>
              <div>{letterCount}/800 тэмдэгт</div>
            </div>
          </div>
          <button className="analyze-btn" onClick={getResponse}>
            Analyze
          </button>
        </div>
        <div className="right-con">
          {loader2 ? (
            <>
              <Chart data={news} />
              <DuplicatedWords data={misspelledWords} />
            </>
          ) : (
            <div className="if-no-analyze">
              <img src={img1} alt="Placeholder" className="bino-img" />
              <p>Мэдээлэл алга байна.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
