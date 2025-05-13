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
