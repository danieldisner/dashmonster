import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `photo-${uniqueSuffix}${extension}`);
  }
});

// Validação de arquivos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Aceitar apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos'));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Middleware específico para foto de usuário
export const uploadBeneficiaryPhoto = upload.single('photo');
