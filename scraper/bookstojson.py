import requests
import random
import spacy
import json

# Carica il modello linguistico di spacy
nlp = spacy.load("en_core_web_sm")

# Funzione per ottenere il genere del libro da Google Books
def get_genre(title):
    api_url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": title,
        "maxResults": 1
    }
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        data = response.json()
        if 'items' in data and len(data['items']) > 0:
            volume_info = data['items'][0]['volumeInfo']
            if 'categories' in volume_info:
                return volume_info['categories'][0]
    return "Unknown"

# Lista per memorizzare i dati dei libri
books_data = []

# Estrai 10 libri
for _ in range(10):
    # Genera un ID casuale tra 40 e 500
    random_id = random.randint(40, 500)

    # Costruisci l'URL con l'ID casuale
    url = "https://www.gutenberg.org/cache/epub/{}/pg{}.txt".format(random_id, random_id)

    # Effettua la richiesta HTTP
    response = requests.get(url)

    if response.status_code == 200:
        # Estrai il testo dal contenuto della risposta
        text = response.text

        # Trova il titolo, l'autore e il linguaggio nel testo
        title = None
        author = None
        language = None
        for line in text.splitlines():
            if line.startswith("Title: "):
                title = line[7:].strip()
            elif line.startswith("Author: "):
                author = line[8:].strip()
            elif line.startswith("Language: "):
                language = line[10:].strip()
            if title and author and language:
                break

        # Calcola l'indice che rappresenta la metà del documento
        half_index = len(text) // 2

        # Tokenizza il testo in frasi utilizzando spacy a partire dalla metà del documento
        doc = nlp(text[half_index:])
        sentences = [sent.text for sent in doc.sents]

        # Cerca un paragrafo che ha un senso compiuto
        found_paragraph = None
        for sentence in sentences:
            if len(sentence) > 300:  # Consideriamo un paragrafo come significativo se supera i 300 caratteri
                found_paragraph = sentence
                break  # Esci dal ciclo dopo aver trovato il primo paragrafo significativo

        if found_paragraph:
            # Ottieni il genere del libro
            genre = get_genre(title)

            # Salva i dati del libro
            book_data = {
                "id": random_id,
                "title": title,
                "author": author,
                "text": found_paragraph,
                "genre": genre,
                "language": language
            }
            books_data.append(book_data)

# Salva i dati dei libri in un file JSON
with open("books.json", "w") as json_file:
    json.dump(books_data, json_file, indent=4)

print("Dati dei libri salvati con successo in books.json")

