import { Router } from 'express';
import { sensorController } from '../controllers/sensorController.js';
import { verifyToken } from '../middlewares/tokenAuth.js';

const router = Router();

// Cadastrar um novo sensor (gera ID e Senha)
router.post('/sensors', verifyToken, sensorController.createSensor);

// Listar os sensores do cliente
router.get('/sensors', verifyToken, sensorController.getSensors);

// Editar o apelido do sensor
router.put('/sensors/:id', verifyToken, sensorController.updateSensor);

// Remover um dispositivo
router.delete('/sensors/:id', verifyToken, sensorController.deleteSensor);

// Rota para o simulador enviar dados
router.post('/sensors/data', sensorController.receiveData);

export default router;