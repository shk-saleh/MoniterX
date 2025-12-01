import { Router } from 'express';
import { getStats, optimize, getProcesses} from '../controllers/systemController.js';

const router = Router();

export default (io) => {
    
  router.get('/stats', getStats);

  router.post('/optimize', async (req, res) => {
    try {
      const result = await optimize(req, res);
      io.emit('optimizationComplete', result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/processes', getProcesses);

  return router;
};