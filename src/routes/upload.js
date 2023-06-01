const router = require('express').Router();
const multer = require('multer');
const path = require('path');

// Configuración de Multer para la carga de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio de almacenamiento de las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nombre de archivo único con marca de tiempo
  },
});

const upload = multer({ storage: storage });

// Ruta de carga de imágenes
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha seleccionado ninguna imagen' });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
    return res.status(200).json({ imageUrl });
  });
  

module.exports = router;