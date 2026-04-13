import express from "express";
import cors    from "cors"; 

const app  = express();
const port = 3000;               // http://localhost:3000

// === Middlewares ===
app.use(cors());                 // Habilita CORS (permite llamadas cross-origin)
app.use(express.json());         // Parsea bodies en formato JSON

// === Endpoints ===
app.get('/', (req, res) => {
  res.status(200).send('¡Ya estoy respondiendo!');
});

app.get('/saludar', (req, res) => {
  res.send('Hello World!');
});
app.get('/saludar/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  res.status(200).send(`Hola ${nombre}`);
});


// === Arranca el servidor ===
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});