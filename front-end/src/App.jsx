import { useState, useEffect, useCallback } from "react";
import "./App.css";
import debounce from "lodash.debounce";

export const App = () => {
  const [resp, setResp] = useState("");
  const [text, setText] = useState("");
  const maxCharacters = 1000;
  const [suggestions, setSuggestions] = useState([]);

  const sendInput = useCallback(
    debounce(async (value) => {
      try {
        const res = await fetch("http://127.0.0.1:8080/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: value }),
        });

        const data = await res.json();
        setResp(data.response);

        console.log(data.response);
        console.log(resp);
      } catch (error) {
        console.log("This is the error mooooollly");
      }
    }, 1000),
    [resp]
  );

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8080")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setSuggestions(data.sug);
  //     })
  //     .catch((error) => console.error("Error fetching suggestions:", error));
  // }, []);

  const handleChange = (event) => {
    const newText = event.target.value;

    // Хэрэв шинэ текстийн урт хэтрэхгүй бол state-г шинэчилнэ
    if (newText.length <= maxCharacters) {
      setText(newText);
      sendInput(newText);
    } else {
      // Хэтэрсэн текстийг тасална
      setText(newText.slice(0, maxCharacters));
    }

    fetch("http://127.0.0.1:8080")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSuggestions(data.sug);
      })
      .catch((error) => console.error("Error fetching suggestions:", error));
  };

  const countWords = (text) => {
    const words = text.trim().split(/\s+/);
    return text.length > 0 ? words.length : 0;
  };

  const countCharacters = (text) => {
    return text.length;
  };

  return (
    <div className="grid-container">
      <div className="container">
        <textarea placeholder="Энд дарж бичнэ үү" value={text} onChange={handleChange} />

        <div className="counts">
          <div>Үгийн тоо: {countWords(text)}</div>
          <div>
            Тэмдгийн тоо: {countCharacters(text)}/{maxCharacters}
          </div>
          {countCharacters(text) >= maxCharacters && (
            <div style={{ color: "red" }}>Тэмдэгтийн тоо хэтэрч, таслагдсан!</div>
          )}
        </div>

        <button className="check-button">Алдааг шалгах</button>

        <div className="icon">
          <img src="checkmark-icon.png" alt="Checkmark" />
        </div>
      </div>
      <div className="misspelled-word">
        <h1 style={{ fontSize: "24px", textAlign: "center", color: "black" }}>
          {suggestions.map((suggestion, index) => (
            <>
              <span key={index}>{suggestion}</span>
              <br />
            </>
          ))}
        </h1>
      </div>
    </div>
  );
};
