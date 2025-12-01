import { getSystemStats, optimizeSystem, getRunningProcesses } from '../utils/systemMonitor.js';

export const getStats = async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const optimize = async (req, res) => {
  try {
    const result = await optimizeSystem();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProcesses = async (req, res) => {
  try {
    const processes = await getRunningProcesses();
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};