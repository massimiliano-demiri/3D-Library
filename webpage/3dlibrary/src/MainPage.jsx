import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import jsonData from './scraper/books.json';
import './DarkModeComponent.css';
import wifiIcon from './wifi.svg';
import batteryIcon from './battery.svg';
import darkModeIcon from './dark.svg';
import lightModeIcon from './light.svg';
import speakIcon from './speak.svg';
import BookInfoComponent from './BookInfoComponent';

const DarkModeComponent = () => {
  const [data, setData] = useState([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBookInfo, setShowBookInfo] = useState(false);

  useEffect(() => {
    setData(jsonData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
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
    <Router>
      <div className={`dark-mode-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="tablet-header">
          <div className="tablet-status">
            <img src={batteryIcon} alt="Battery Icon" className="status-icon" />
            <span className="status-item">87%</span>
            <img src={wifiIcon} alt="WiFi Icon" className="status-icon" />
            <span className="status-item">Dook-fi</span>
            <span className="status-item">{currentTime.toLocaleTimeString()}</span>
            {/* Icona per il dark mode nel tablet header */}
            <Link to="/book-info" className="mode-icon-link">
              {darkMode ? (
                <img src={lightModeIcon} alt="Light Mode Icon" className="mode-icon" />
              ) : (
                <img src={darkModeIcon} alt="Dark Mode Icon" className="mode-icon" />
              )}
            </Link>
          </div>
        </div>
        <div className='navigation'>https://3dooks.it</div>
        <div className="tablet-content">
          <div className="icon-toggle-container">
            {/* Toggle per la modalità scura */}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              {darkMode ? (
                <img src={lightModeIcon} alt="Light Mode Icon" className="mode-icon" />
              ) : (
                <img src={darkModeIcon} alt="Dark Mode Icon" className="mode-icon" />
              )}
            </button>
            {/* Bottone per lo speaker */}
            <button className="speaker-toggle" onClick={toggleReading}>
              <img src={speakIcon} alt="Speak Icon" />
            </button>
          </div>
          <div className="content">
            {!showBookInfo ? (
              <>
                <p className="paragraph typing-animation">{data[currentParagraph]?.text}</p>
                {currentParagraph < data.length - 1 && (
                  <Link to="/book-info" className="reveal-link">
                    <button className="reveal-button" onClick={() => setShowBookInfo(true)}>
                      Rivela
                    </button>
                  </Link>
                )}
                <button className="not_interested" onClick={nextParagraph}>Non mi interessa</button>
              </>
            ) : (
              <Routes>
                <Route path="/book-info" element={<BookInfoComponent />} />
              </Routes>
            )}
          </div>
        </div>
        <div className="site-name">3dook</div> {/* Nome del sito */}
      </div>
    </Router>
  );
};

export default DarkModeComponent;
