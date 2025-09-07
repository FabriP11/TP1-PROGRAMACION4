const express = require("express");
const app = express();
const PORT = 3002;

app.use(express.json());

const alumnos = [];
const condicion = (prom) => (prom < 6 ? "reprobado" : prom < 8 ? "aprobado" : "promocionado");

// POST crear alumno 
app.post("/alumnos", (req, res) => {
  let { nombre, n1, n2, n3 } = req.body || {};
  nombre = (nombre ?? "").toString().trim();

  const a = Number(n1), b = Number(n2), c = Number(n3);

  if (!nombre) {
    return res.status(400).json({ success: false, error: "nombre es requerido" });
  }
  const existe = alumnos.some(x => x.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    return res.status(409).json({ success: false, error: "ya existe un alumno con ese nombre" });
  }
  const notasOk = [a, b, c].every(x => Number.isFinite(x) && x >= 0 && x <= 10);
  if (!notasOk) {
    return res.status(400).json({ success: false, error: "las notas deben ser números entre 0 y 10" });
  }

  alumnos.push({ nombre, n1: a, n2: b, n3: c, ts: new Date().toISOString() });
  res.status(201).json({ success: true, message: "Alumno creado" });
});

// GET listar alumnos 
app.get("/alumnos", (req, res) => {
  const data = alumnos.map(a => {
    const prom = ((a.n1 + a.n2 + a.n3) / 3);
    return {
      ...a,
      promedio: Number(prom.toFixed(2)),
      condicion: condicion(prom)
    };
  });

  res.json({ success: true, data });
});

app.listen(PORT, () => {
  console.log(`Ej2 listo en http://localhost:${PORT}`);
});
