import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new UserController();

// Listar usuários
router.get('/', controller.list.bind(controller));
// Buscar usuário por ID
router.get('/:id', controller.get.bind(controller));
// Criar usuário (com upload de avatar)
router.post('/', upload.single('avatar'), controller.create.bind(controller));
// Atualizar usuário (com upload de avatar)
router.put('/:id', upload.single('avatar'), controller.update.bind(controller));
// Deletar usuário
router.delete('/:id', controller.delete.bind(controller));

export { router as userRoutes };
