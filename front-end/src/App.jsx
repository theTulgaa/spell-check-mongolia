import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import debounce from "lodash.debounce";
import { Pie } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";

export default function SimpleCharts() {
  return (
    <BarChart
      xAxis={[
        {
          id: "barCategories",
          data: ["bar A", "bar B", "bar C"],
          scaleType: "band",
        },
      ]}
      series={[
        {
          data: [2, 5, 3],
        },
      ]}
      width={500}
      height={300}
    />
  );
}

export const App = () => {
  const [text, setText] = useState("");

  const [data, setData] = useState("");
  const [options, setOptions] = useState("");

  const maxCharacters = 1000;

  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [res, setRes] = useState(false);
  const [showText, setShowText] = useState(false);
  const [misspelledWords, setMisspelledWords] = useState({});
  const [activeWord, setActiveWord] = useState("");
  const [prediction, setPrediction] = useState({});

  useEffect(() => {
    if (inputText.trim() !== "") {
      const cleaned = inputText.replace(/[.\/:"'-]/g, "");
      sendRequest(cleaned);
    }
  }, [inputText]);

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
      setMisspelledWords(data.suggestions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getResponse = async () => {
    setRes(true);
    try {
      const response = await fetch("http://127.0.0.1:8080");
      const data = await response.json();
      setMisspelledWords(data.suggestions);
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

  const handleChange = (event) => {
    const newText = event.target.value;

    // Хэрэв шинэ текстийн урт хэтрэхгүй бол state-г шинэчилнэ
    if (newText.length <= maxCharacters) {
      setText(newText);
      sendRequest(newText);
    } else {
      // Хэтэрсэн текстийг тасална
      setText(newText.slice(0, maxCharacters));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newText = responseText.replace(activeWord, suggestion);
    setResponseText(newText);
    setSuggestions([]);
    setText(newText);
  };

  const countWords = (text) => {
    const words = text.trim().split(/\s+/);
    return text.length > 0 ? words.length : 0;
  };

  const countCharacters = (text) => {
    return text.length;
  };

  // энэ зүгээр жишээ хийх гэж байгаа
  const pie_chart = () => {
    const data = {
      labels: ["Developer", "Designer", "Manager"],
      datasets: [
        {
          label: "Salary Distribution",
          data: [5000, 4500, 6000],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };
    setData(data);

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
    };
    setOptions(options);
  };

  const MouseButtonClick = (event) => {
    return event.button;
  };

  return (
    <div className="main-container">
      <div className="sub-container">
        <div className="sub-sub-container">
          <h2>Үгийн алдаа шалгагч</h2>

          {showText ? (
            // <div className="input" contentEditable={true}>
            <div className="input" onClick={() => setShowText(false)}>
              {renderTextWithHighlights()}
            </div>
          ) : (
            <textarea placeholder="Энд дарж бичнэ үү" value={text} onChange={handleChange} />
            // <div className="input" contentEditable={true} onChange={() => setResponseText(text)}>
            //   {text}
            // </div>
          )}
          <div className="icon-container">
            <div className="icons">
              <div className="copy icon"></div>
              <div className="icon paste"></div>
              <div className="icon delete"></div>
            </div>
            <div className="counts">
              <div>Үгийн тоо: {countWords(text)}</div>
              <div>
                Тэмдгийн тоо: {countCharacters(text)}/{maxCharacters}
              </div>
              {countCharacters(text) >= maxCharacters && (
                <div style={{ color: "red" }}>Тэмдэгтийн тоо хэтэрч, таслагдсан!</div>
              )}
            </div>
          </div>

          <button className="check-button" onClick={getResponse}>
            Шалгах
          </button>
        </div>

        <div className="analysis">
          <h2>Мэдээллийн дүн шинжилгээ</h2>
          <h1>
            {/* {suggestions.map((suggestion, index) => (
              <>
                <span key={index}>{suggestion}</span>
                <br />
              </>
            ))} */}
            <div className="binocular"></div>
            <div className="empty">
              <h5>Мэдээлэл алга байна.</h5>
            </div>

            {/* <div className="pie-Chart">
              <Pie data={data} options={options} />
            </div> */}
          </h1>
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
  );
};
