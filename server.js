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

// server.js (extendido con envio por mail)
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer para guardar el archivo temporalmente
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Ruta principal (formulario)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta que recibe el formulario y envía el email
app.post("/upload", upload.single("cv"), async (req, res) => {
  const { nombre, email, mensaje, fecha } = req.body;
  const archivo = req.file;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "TU_CORREO@gmail.com",         // <-- CAMBIAR
        pass: "TU_CONTRASEÑA_APP",           // <-- CAMBIAR (no tu contraseña real)
      },
    });

    const mailOptions = {
      from: "Formulario Web <TU_CORREO@gmail.com>",
      to: "TU_CORREO@gmail.com", // o cualquier otro mail
      subject: `Nuevo CV de ${nombre}`,
      text: `
        Nombre: ${nombre}
        Email: ${email}
        Fecha: ${fecha}
        Mensaje: ${mensaje}
      `,
      attachments: [
        {
          filename: archivo.originalname,
          path: archivo.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    // Eliminamos el archivo del servidor (opcional pero recomendado en Render)
    fs.unlinkSync(archivo.path);

    res.send("<script>alert('CV enviado por email correctamente!'); window.location.href='/'</script>");
  } catch (err) {
    console.error("Error al enviar email:", err);
    res.status(500).send("Error al enviar el email.");
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
