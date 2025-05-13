# Docker Compose - Esercizio: Hello API

Per creare un ambiente Docker Compose con un back-end che restituisce "Hello API" e un front-end che lo mostra, dovremo definire due servizi: uno per il back-end (che esporrà una semplice API) e uno per il front-end (che consuma quella API e la mostra).

### 1. Back-end (API)

Useremo un'applicazione Node.js per il back-end. Creeremo un'API REST che restituisce "Hello API" quando viene effettuata una richiesta GET.

### 2. Front-end (UI)

Il front-end sarà un'applicazione React (o semplicemente HTML+JS) che fa una richiesta al back-end e mostra il risultato.

### Struttura del progetto:

```
progetto-zanella/
│
├── backend/
│   ├── Dockerfile
│   ├── index.js
|   └── package.js
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   └── js/script.js
│
└── docker-compose.yml
```

### Passo 1: Creare il back-end (Node.js)

#### **backend/Dockerfile**

```Dockerfile
# Usa l'immagine ufficiale di Node.js
FROM node:24-alpine3.20
# Imposta la cartella di lavoro
WORKDIR /app
# Copia i file di configurazione
COPY package*.json ./  

ENV NODE_ENV=development
# Installa le dipendenze
RUN npm install  
# Copia il codice sorgente dell'app
COPY . .  
# Espone la porta 3000
EXPOSE 3001  
# Avvia l'app
CMD ["npm", "run", "production"]
```

#### **backend/package.json**

```json
{
  "name": "hello-api",
  "version": "1.0.0",
  "description": "API Express che restituisce 'hello world'",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "production": "NODE_ENV=production node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"  
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}

```

#### **backend/index.js**

```javascript
const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Abilitare CORS per un dominio specifico
app.use(cors({
  origin: 'http://localhost:8080'  // Cambia con l'URL del tuo frontend
}));

app.get('/', (req, res) => {
  res.json({ message: 'hello world!' });
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta: ${port}`);
});

```

### Passo 2: Creare il front-end (HTML+JS)

#### **frontend/Dockerfile**

```Dockerfile
# Usa una semplice immagine di nginx per servire il front-end
FROM nginx:alpine

# Copia i file del front-end nella cartella di nginx
COPY . /usr/share/nginx/html

# Espone la porta 80
EXPOSE 8080
```

#### **frontend/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prova Container</title>
</head>
<body>
    <h1>Prova Container</h1>
    <p>Qui sotto troverai il contenuto dell'API</p>

    <div id="APIcontent"></div>

    <script src="./js/main.js" crossorigin="anonymous"></script>
</body>
</html>
```

#### **frontend/script.js**

```javascript
let APIcontent = document.querySelector("#APIcontent");

fetch("http://localhost:3001")
  .then(r => r.json())
  .then(data => {
    APIcontent.textContent = data.message;
  })
  .catch(err => {
    console.error("Errore nella richiesta al backend:", err);
  });
```

### Passo 3: Creare il file `docker-compose.yml`

```yaml
version: '3'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: helloweb        # nome personalizzato per l'immagine
    container_name: backend-container
    ports:
      - "3001:3001"                  # HOST:CONTAINER → 3001 sulla tua macchina
    restart: unless-stopped         

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: helloweb-f        
    container_name: frontend-container
    ports:
      - "8080:80"                   
    restart: unless-stopped

```

### Passo 4: Costruire e avviare i container

1. **Esegui il comando per costruire e avviare i container:**

   ```bash
   docker-compose up --build
   ```

2. **Visita il front-end:**  
   Apri il browser e vai su `http://localhost:3001`. Dovresti vedere la risposta `"Hello API"` restituita dal Back-end.  
   Apri il browser e vai su `http://localhost:8080`. Dovresti vedere la risposta `"Hello API"` restituita dal Front-end.  

### Spiegazione:

* **Back-end**: Il container del back-end è un'applicazione Node.js che espone un'API all'indirizzo `/api`. Restituisce un oggetto JSON con il messaggio `"Hello API"`.
* **Front-end**: Il front-end è servito da un container Nginx che mostra una pagina HTML con un piccolo script JavaScript. Il JavaScript effettua una richiesta al back-end e visualizza il messaggio sulla pagina.
* **docker-compose.yml**: Questo file collega i due servizi (back-end e front-end) e assicura che il front-end possa comunicare con il back-end tramite il nome del servizio `backend`.

Con questa configurazione, hai un'applicazione a due container che comunicano tra loro tramite Docker Compose.
