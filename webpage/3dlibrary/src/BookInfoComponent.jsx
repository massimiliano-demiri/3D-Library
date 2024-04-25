import React from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes per definire il tipo dei props

import './BookInfoComponent.css'; // Assicurati di importare il CSS per questo componente

const BookInfoComponent = ({ onBuyClick }) => {
  // Dati del libro
  const bookData = {
    id: 84,
    title: "Frankenstein; Or, The Modern Prometheus",
    author: "Mary Wollstonecraft Shelley",
    text: "This lady died, but her lessons were indelibly\r\nimpressed on the mind of Safie, who sickened at the prospect of again\r\nreturning to Asia and being immured within the walls of a harem,\r\nallowed only to occupy herself with infantile amusements, ill-suited to\r\nthe temper of her soul, now accustomed to grand ideas and a noble\r\nemulation for virtue.",
    genre: "Galvanic skin response",
    language: "English",
    image_url: "http://books.google.com/books/content?id=2Zc3AAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", // URL dell'immagine del libro
    buy_link: "https://www.lafeltrinelli.it/frankenstein-or-modern-prometheus-unabridged-audiobook-mary-wollstonecraft-shelley/e/9798868688928?queryId=54c2b4f2005b21a52ffb2e533a2feafe" // URL per l'acquisto del libro
  };

  // Funzione per gestire il clic sul pulsante "Acquista"
  const handleBuyClick = () => {
    // Passa l'ID del libro alla funzione fornita come prop
    onBuyClick(bookData.id);
  };

  return (
    <div className="book-info-container">
      <img src={bookData.image_url} alt="Book Cover" className="book-cover" />
      <div className="book-details">
        <h2 className="book-title">{bookData.title}</h2>
        <h3 className="book-author">by {bookData.author}</h3>
        <p className="book-text">{bookData.text}</p>
        <a href={bookData.buy_link} target="_blank" rel="noopener noreferrer" className="buy-link">
          <button className="buy-button" onClick={handleBuyClick}>Acquista</button>
        </a>
        <p className="commission-disclaimer">Potremmo guadagnare una commissione dall'acquisto</p>
      </div>
    </div>
  );
};

// Definisci i tipi dei props per il componente
BookInfoComponent.propTypes = {
  onBuyClick: PropTypes.func.isRequired // La funzione di gestione del clic è richiesta
};

export default BookInfoComponent;
