import React, { useState, useEffect } from 'react';
import jsonData from './scraper/books.json';
 // Importa direttamente il file JSON
import './DarkModeComponent.css'; // Stile per il componente

const DarkModeComponent = () => {
  const [data, setData] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setData(jsonData); // Imposta i dati dal file JSON importato
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const nextParagraph = () => {
    setCurrentParagraph(currentParagraph + 1);
  };

  return (
    <div className={`dark-mode-container ${darkMode ? 'dark-mode' : ''}`}>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
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
