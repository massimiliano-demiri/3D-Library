import React, { useState, useEffect } from 'react';
import jsonData from './scraper/books.json';
import './DarkModeComponent.css';

const DarkModeComponent = () => {
  const [data, setData] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    setData(jsonData);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const nextParagraph = () => {
    setCurrentParagraph(currentParagraph + 1);
  };

  const toggleReading = () => {
    setIsReading(!isReading);
    if (!isReading) {
      readText(data[currentParagraph]?.text);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const readText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`dark-mode-container ${darkMode ? 'dark-mode' : ''}`}>
      <button onClick={toggleDarkMode}>Dark Mode</button>
      <button onClick={toggleReading}>
        {isReading ? 'Stop Reading' : 'Read Aloud'}
      </button>
      <div className="content">
        <p className="paragraph">{data[currentParagraph]?.text}</p>
        {currentParagraph < data.length - 1 && (
          <button onClick={nextParagraph}>Leggi altro</button>
        )}
      </div>
    </div>
  );
};

export default DarkModeComponent;
