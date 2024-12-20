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
import { elements } from "chart.js";

const VerticalDivider = () => {
  return <div className="vertical-divider" />;
};

export const App = () => {
  const data = {
    word1: 5,
    word2: 10,
    word3: 10,
    word4: 5,
    word5: 10,
    word6: 10,
    word7: 5,
    word8: 10,
    word9: 10,
  };

  // input text
  const [inputText, setInputText] = useState("");
  // word counter
  const [wordCount, setWordCount] = useState(1);
  // letter counter
  const [letterCount, setLetterCount] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [misspelledWords, setMisspelledWords] = useState({});
  const [activeWord, setActiveWord] = useState("");
  // when button clicked textarea will be hidden
  const [showTextArea, setShowTextArea] = useState(false);
  // analyze response
  const [news, setNews] = useState([1, 1, 1, 1, 1, 1]);
  // loader for check spelling
  const [loader, setLoader] = useState(false);

  // loader for check anal i mean analyze
  const [loader2, setLoader2] = useState(false);

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

  // send request
  const sendRequest = async (text) => {
    try {
      const response = await axios.post("http://localhost:8080/send", {
        message: text,
      });
      setResponseText(response.data.response);
      setMisspelledWords(response.data.suggestions || {});
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/pred", {
        inputText: inputText,
      });
      setNews(response.data.prediction[0]);
      console.log(response.data.prediction);
    } catch (error) {
      console.error("Error while making prediction:", error);
    } finally {
      setLoader2(true);
    }
  };

  // sends request to server everytime inputText changes
  useEffect(() => {
    if (inputText.trim() !== "") {
      // if (!inputText) {
      sendRequest(inputText);
      // const cleaned = inputText.replace(/[.\/:,"'-]/g, "");
      // sendRequest(cleaned);
      // console.log(cleaned);

      const words = inputText.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);

      const letters = inputText.replace(/\s+/g, "").length;
      setLetterCount(letters);
    }
  }, [inputText]);

  // get response
  const getResponse = async () => {
    if (wordCount > 300) {
      alert("Үгийн тоо хэтэрсэн");
    } else {
      setLoader(true);
      try {
        const response = await axios.get("http://localhost:8080/");
        setMisspelledWords(response.data.suggestions);
        setLoader(false);
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong!");
        setLoader(false);
      } finally {
        setShowTextArea(true);
        setLoader(false);
      }
    }
  };

  const getSuggestion = async (word) => {
    try {
      const response = await axios.post("http://localhost:8080/suggest", {
        message: word,
      });
      misspelledWords[word] = response.data.response;
      setActiveWord(word);
      setSuggestions(response.data.response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const checkStr = (word) => {
    const chars = "/[./:,\"-'";

    for (let i = 0; i < chars.length; i++) {
      if (word.includes(chars[i])) {
        return true;
      }
    }
    return false;
  };

  const posStr = (word) => {
    const chars = "/[./:,\"-'";
    console.log(chars.includes(word[0]), word[0]);
    return 0 ? chars.includes(word[0]) : 1;
  };

  const charStr = (word) => {
    const chars = "/[./:,-'";

    for (let i = 0; i < chars.length; i++) {
      if (word.includes(chars[i])) {
        return chars[i];
      }
    }
  };

  // rendering misspeled and correct words together
  const renderTextWithHighlights = () => {
    if (!responseText) return null;

    return (
      <div
        className="text-area"
        onClick={() => {
          setShowTextArea(false);
        }}
      >
        {responseText.split(" ").map((word, index) => {
          if (misspelledWords[word]) {
            return (
              <span>
                <span
                  key={index}
                  className="misspelled-word words"
                  onMouseOver={() => {
                    getSuggestion(word);
                  }}
                >
                  {word}
                </span>
                <span> </span>
              </span>
            );
          } else {
            return (
              <span className="correct-word words" key={index}>
                {word}
                <span> </span>
              </span>
            );
          }
        })}
      </div>
    );
  };

  const handleSuggestionClick = (suggestion) => {
    const check = checkStr(activeWord);
    const ch1 = posStr(activeWord);
    const ch2 = charStr(activeWord);

    if (check) {
      if (ch1 == 0) {
        suggestion = ch2 + suggestion;
        let newText = responseText.replace(activeWord, suggestion);
        setResponseText(newText);
        setSuggestions([]);
        setInputText(newText);
      } else {
        suggestion = suggestion + ch2;
        let newText = responseText.replace(activeWord, suggestion);
        setResponseText(newText);
        setSuggestions([]);
        setInputText(newText);
      }
    }
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
      <div className="main-con">
        <div className="left-con">
          <h1 className="header-text">Үгийн алдаа шалгагч</h1>

          {!showTextArea ? (
            <textarea
              className="text-area"
              placeholder="Enter text here..."
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              value={inputText}
            />
          ) : (
            renderTextWithHighlights()
          )}

          {/* 3 tovch hiigeed heden ug heden temdegt orsong tooloh container */}

          <div className="three-btn-con">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ButtonWithIcon icon={MdContentCopy} onClick={handleCopy} tooltip="Copy Text" />
              <VerticalDivider />
              <ButtonWithIcon icon={MdDeleteOutline} onClick={handleDelete} tooltip="Clear Text" />
              <VerticalDivider />
              <ButtonWithIcon icon={BsFileText} onClick={handlePaste} tooltip="Paste Text" />
            </div>

            {/* heden ug heden useg orson heseg */}
            <div className="count-word-letter-con">
              <div className="">{wordCount}/300 үг</div>
              {/* <div className="">{letterCount}/800 тэмдэгт</div> */}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <button className="analyze-btn" onClick={getResponse}>
              Шалгах
            </button>
            <button className="analyze-btn" onClick={handleSubmit}>
              Анализ
            </button>
          </div>
        </div>

        {/*  Medeeelliin dun shinjilgee, davhardsan ug zereg code ene containerd bairlana*/}

        <div className="right-con">
          {loader2 ? (
            <>
              <Chart data={news} />
              <p style={{ marginTop: "40px", marginLeft: "30px" }}>Давхардсан үгийн жагсаалт</p>
              <DuplicatedWords data={data} />
              <div className="count-mis-word-con">
                <span>45 / 50</span>
                <p>Алдааны үнэлгээ</p>
              </div>
            </>
          ) : (
            <>
              <div className="if-no-analyze">
                <p style={{ fontSize: "1.3rem", fontWeight: "bolder" }}>Мэдээллийн дүн шижилгээ</p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img src={img1} alt="" className="bino-img" />
                  <p style={{ fontWeight: "bolder" }}>мэдээлэл алга байна.</p>
                </div>
              </div>
            </>
          )}
        </div>
        {Boolean(activeWord && suggestions.length > 0) && (
          <div className="suggestions-box">
            <h4>Suggestions for "{activeWord}":</h4>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
