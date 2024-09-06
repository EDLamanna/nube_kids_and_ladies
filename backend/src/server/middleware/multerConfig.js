import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define la ruta del directorio de subida
const uploadDirectory = path.join(__dirname, '../uploads/')

// Verifica si el directorio existe y lo crea en caso de no existir
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true })
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

export default upload
