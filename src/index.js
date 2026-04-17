import express from "express";
import cors from "cors";
import { Alumno } from "./models/alumno.js";
import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js";
import req from "express/lib/request.js";
import res from "express/lib/response.js";
const app = express();
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

// === fecha ===
app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {
  const { ano, mes, dia } = req.params;
  const fechaStr = `${ano}-${mes}-${dia}`;
  const timestamp = Date.parse(fechaStr);
  if (isNaN(timestamp)) {
    return res.status(400).send('Fecha inválida');
  }
  return res.status(200).send('Fecha válida');
});

// === Matematica ===
app.get('/matematica/sumar', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);
  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send('Numero/s invalidos');

  }
  return res.status(200).send(String(sumar(n1, n2)));;
})

app.get('/matematica/restar', (req, res) => {
  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);
  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send('Numero/s invalidos');

  }
  return res.status(200).send(String(restar(n1, n2)));;
})

app.get('/matematica/multiplicar', (req, res) => {

  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);
  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send('Numero/s invalidos');

  }
  return res.status(200).send(String(multiplicar(n1, n2)));;
})

app.get('/matematica/dividir', (req, res) => {

  const n1 = parseInt(req.query.n1);
  const n2 = parseInt(req.query.n2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).send('Numero/s invalidos');

  }
  else if (n2 === 0){
        return res.status(400).send('No se puede dividir por 0');

  }
  return res.status(200).send(String(dividir(n1, n2)));;
})

// === Omdb Wrapper ===
function armarEnvelope(datos) {
  if (!datos) {
    return { respuesta: false, cantidadTotal: 0, datos: [] };
  }

  if (Array.isArray(datos)) {
    return {
      respuesta: datos.length > 0,
      cantidadTotal: datos.length,
      datos: datos
    };
  }

  return {
    respuesta: true,
    cantidadTotal: 1,
    datos: datos
  };
}

app.get('/omdb/searchbypage', async (req, res) => {
  const search = req.query.search;
  const p = req.query.p;

  try {
    const datos = await OMDBSearchByPage(search, p);
    res.status(200).send(armarEnvelope(datos));
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send(armarEnvelope(null));
  }
});

app.get('/omdb/searchcomplete', async (req, res) => {
  const search = req.query.search;

  try {
    const datos = await OMDBSearchComplete(search);
    res.status(200).send(armarEnvelope(datos));
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send(armarEnvelope(null));
  }
});

app.get('/omdb/getbyomdbid', async (req, res) => {
  const imdbID = req.query.imdbID;

  try {
    const datos = await OMDBGetByImdbID(imdbID);
    res.status(200).send(armarEnvelope(datos));
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send(armarEnvelope(null));
  }
});

// === Alumno ===
const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

app.get('/alumnos', function (req, res) {
  res.send(alumnosArray)
})

app.get('/alumnos/:dni', (req, res)=>{
  const dni = req.params.dni;
  const alumno = alumnosArray.find(item => item.dni === dni);
  if (alumno){
       return res.status(200).send(alumno)
  }
  else{
       return res.status(404).send(`No hay ningun alumno con dni: ${dni}`)
  }
})

app.post('/alumnos', (req, res) =>{
  const{username, dni, edad} = req.body;
  if (!username || !dni || !edad){
        return res.status(400).send("Datos incompletos");

  }
      const nuevoAlumno = new Alumno(username, dni, edad);
       alumnosArray.push(nuevoAlumno);
         return res.status(200).send("Alumno creado con exito");
})

app.delete('/alumnos', (req, res) =>{
  const { dni } = req.body;
const indice = alumnosArray.findIndex(item => item.dni === dni);
if (indice < 0) return res.status(404).send('Alumno Not Found');
alumnosArray.splice(indice, 1);
return res.status(200).send('Alumno eliminado con exito');
})


// === Arranca el servidor ===
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});