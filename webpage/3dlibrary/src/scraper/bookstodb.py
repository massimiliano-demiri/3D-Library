import requests
import random
import spacy
import os.path
import pg8000

# Carica il modello linguistico di spacy
nlp = spacy.load("en_core_web_sm")

# Funzione per ottenere il genere del libro e l'URL dell'immagine della copertina da Google Books
def get_book_info(title):
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
            genre = volume_info.get('categories', ["Unknown"])[0]
            image_url = volume_info.get('imageLinks', {}).get('thumbnail', "Unknown")
            return genre, image_url
    return "Unknown", "Unknown"

# Lista per memorizzare i dati dei libri
books_data = []

# Connessione al database PostgreSQL
try:
    connection = pg8000.connect(
        user="postgres",
        password="1937456",
        host="localhost",
        port=5432,
        database="BooksDB"
    )

    cursor = connection.cursor()

    # Estrai 10 libri
    for _ in range(5):
        # Genera un ID casuale tra 40 e 500
        random_id = random.randint(40, 500)

        # Controlla se l'ID è già presente nel database
        cursor.execute("SELECT id FROM books WHERE id = %s", (random_id,))
        if cursor.fetchone():
            continue  # Se l'ID è già presente, passa al prossimo libro

        # Costruisci l'URL con l'ID casuale
        url = "https://www.gutenberg.org/cache/epub/{}/pg{}.txt".format(random_id, random_id)

        # Effettua la richiesta HTTP
        response = requests.get(url)

        if response.status_code == 200:
            print(f"Sto analizzando il libro con ID: {random_id}")

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
                # Ottieni il genere del libro e l'URL dell'immagine della copertina
                genre, image_url = get_book_info(title)

                # Scrivi i dati del libro nel database
                cursor.execute("INSERT INTO books (id, title, author, text, genre, language, image_url) VALUES (%s, %s, %s, %s, %s, %s, %s)",
               (random_id, title, author, found_paragraph, genre, language, image_url))

                connection.commit()

    print("Dati dei libri salvati con successo nel database.")

except pg8000.Error as error:
    print("Errore durante la connessione al database:", error)

finally:
    # Chiudi la connessione al database
    if connection:
        cursor.close()
        connection.close()
        print("Connessione al database chiusa.")
