const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const PORT = 3000;

// Servir archivos estáticos
app.use(express.static("public"));


// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Solo se permiten archivos PDF"));
  }
});

// Ruta para recibir el formulario
app.post("/upload", upload.single("cv"), (req, res) => {
  const { nombre, email, mensaje } = req.body;
  const archivo = req.file;

  if (!archivo) {
    return res.status(400).send("No se subió ningún archivo.");
  }

  console.log("📩 Nuevo CV recibido:");
  console.log("Nombre:", nombre);
  console.log("Email:", email);
  console.log("Mensaje:", mensaje);
  console.log("Archivo:", archivo.path);

  res.send("✅ Tu CV fue recibido correctamente.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});