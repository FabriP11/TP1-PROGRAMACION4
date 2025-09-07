const express = require("express");
const app = express();
const PORT = 3003;

app.use(express.json());

const tareas = [];

// POST crear tarea
app.post("/tareas", (req, res) => {
  let { nombre, completada } = req.body || {};
  nombre = (nombre ?? "").toString().trim();

  if (!nombre) {
    return res.status(400).json({ success: false, error: "nombre es requerido" });
  }
  const existe = tareas.some(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    return res.status(409).json({ success: false, error: "ya existe una tarea con ese nombre" });
  }

  let comp = false;
  if (completada !== undefined) {
    if (typeof completada === "boolean") comp = completada;
    else if (typeof completada === "string") {
      const s = completada.trim().toLowerCase();
      if (s === "true") comp = true;
      else if (s === "false") comp = false;
      else return res.status(400).json({ success: false, error: "completada debe ser true o false" });
    } else {
      return res.status(400).json({ success: false, error: "completada debe ser true o false" });
    }
  }

  tareas.push({ nombre, completada: comp, ts: new Date().toISOString() });
  res.status(201).json({ success: true, message: "Tarea creada" });
});

// GET listar
app.get("/tareas", (req, res) => {
  const { estado } = req.query; 

  let data = tareas;
  if (estado) {
    const e = estado.toString().toLowerCase();
    if (e === "completadas") data = tareas.filter(t => t.completada);
    else if (e === "pendientes") data = tareas.filter(t => !t.completada);
    else return res.status(400).json({ success: false, error: 'estado debe ser "completadas" o "pendientes"' });
  }

  res.json({ success: true, data });
});

app.listen(PORT, () => {
  console.log(`Ej3 listo en http://localhost:${PORT}`);
});
