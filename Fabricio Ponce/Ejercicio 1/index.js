const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

const calculos = [];

// POST crear cálculo
app.post("/rectangulos", (req, res) => {
  const { base, altura } = req.body;

  const b = Number(base);
  const h = Number(altura);

  if (!Number.isFinite(b) || !Number.isFinite(h) || b <= 0 || h <= 0) {
    return res.status(400).json({ success: false, error: "base y altura deben ser números > 0" });
  }

  const perimetro = 2 * (b + h);
  const superficie = b * h;

  const item = { base: b, altura: h, perimetro, superficie, ts: new Date().toISOString() };
  calculos.push(item);

  res.status(201).json({ success: true, message: "Cálculo agregado" });
});

// GET: listar cálculos 
app.get("/rectangulos", (req, res) => {
  const data = calculos.map(c => ({
    ...c,
    tipo: c.base === c.altura ? "Cuadrado" : "Rectángulo"
  }));

  res.json({ success: true, data });
});

app.listen(PORT, () => {
  console.log(`Ej1 listo en http://localhost:${PORT}`);
});
