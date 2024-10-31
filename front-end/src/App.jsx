import { useState } from 'react'
import './App.css'

export const App = () => {  

  const [text, setText] = useState('');
  const maxCharacters = 1000;
  
  const handleChange = (event) => {
      const newText = event.target.value;
  
      // Хэрэв шинэ текстийн урт хэтрэхгүй бол state-г шинэчилнэ
      if (newText.length <= maxCharacters) {
        setText(newText);
      } else {
        // Хэтэрсэн текстийг тасална
        setText(newText.slice(0, maxCharacters));
      }
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
          <div class="container">
              <textarea 
                  placeholder="Энд дарж бичнэ үү"
                  value={text}
                  onChange={handleChange}
              />
              
              <div className="counts">
                  <div>Үгийн тоо: {countWords(text)}</div>
                  <div>Тэмдгийн тоо: {countCharacters(text)}/{maxCharacters}</div>
                  {countCharacters(text) >= maxCharacters && (
                      <div style={{ color: 'red' }}>
                          Тэмдэгтийн тоо хэтэрч, таслагдсан!
                      </div>
                  )}
              </div>
              
              <button className='check-button'>Аладааг шалгах</button>
              
              <div class="icon">
                  <img src="checkmark-icon.png" alt="Checkmark" />
              </div>
          </div>
          <div className="misspelled-word">
              <h1 style={{ fontSize: '24px', textAlign: 'center', color:'black'}}>Алдаатай үгс</h1>

          </div>
      </div>
      
    );
  
};
