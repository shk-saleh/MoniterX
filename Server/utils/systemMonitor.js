import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import si from "systeminformation";

const execPromise = promisify(exec);

export const getSystemStats = async () => {
  try {
    const cpuUsage = getCPUUsage();
    const memoryStats = getMemoryStats();
    const diskStats = await getDiskStats();
    const networkStats = await getNetworkStats();
    const processCount = getProcessCount();
    const batteryStatus = await getBatteryStatus();

    return {
      cpu: cpuUsage,
      memory: memoryStats,
      disk: diskStats,
      network: networkStats,
      battery: batteryStatus,
      processes: processCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    return null;
  }
};

const getCPUUsage = () => {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - ~~(100 * idle / total);

  let baseFrequency = 3.6; // Default
  const modelMatch = cpus[0]?.model.match(/@\s([\d.]+)GHz/);
  if (modelMatch) {
    baseFrequency = parseFloat(modelMatch[1]);
  }

  return {
    usage: Math.min(100, Math.max(0, usage)),
    cores: cpus.length,
    model: cpus[0]?.model || 'Unknown',
    speed: cpus[0]?.speed || 0,
    baseFrequency: baseFrequency,            
    temperature: 50 + Math.random() * 20,  
    coreUsage: cpus.map(cpu => {
      // Calculate per-core usage
      let coreIdle = 0;
      let coreTick = 0;
      for (let type in cpu.times) {
        coreTick += cpu.times[type];
      }
      coreIdle = cpu.times.idle;
      const coreUsage = 100 - ~~(100 * coreIdle / coreTick);
      return Math.min(100, Math.max(0, coreUsage));
    })
  };
};

const getMemoryStats = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const usagePercentage = (usedMemory / totalMemory) * 100;

  return {
    total: Math.round(totalMemory / (1024 ** 3)),
    used: Math.round(usedMemory / (1024 ** 3)),
    free: Math.round(freeMemory / (1024 ** 3)),
    usage: Math.round(usagePercentage),
  };
};

const getDiskStats = async () => {

  const toKBps = (bytes) => (bytes / 1024).toFixed(2);

  try {
    const fsSize = await si.fsSize();
    const read = await execPromise(
      'powershell "(Get-Counter \\"\\PhysicalDisk(_Total)\\Disk Read Bytes/sec\\").CounterSamples[0].CookedValue"'
    );

    const write = await execPromise(
      'powershell "(Get-Counter \\"\\PhysicalDisk(_Total)\\Disk Write Bytes/sec\\").CounterSamples[0].CookedValue"'
    );

    const readSpeed = parseFloat(read.stdout.trim());
    const writeSpeed = parseFloat(write.stdout.trim());

    const storage = fsSize.map((disk) => ({
      ...disk,
      readSpeedKB: toKBps(readSpeed),
      writeSpeedKB: toKBps(writeSpeed),
    }));

    return { storage };  
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getNetworkStats = async () => {
  try {
    const net1 = await si.networkStats();
    await new Promise(r => setTimeout(r, 1000));
    const net2 = await si.networkStats();

    if (!net1.length || !net2.length) return { upload: 0, download: 0 };

    const iface1 = net1.find(i => i.operstate === 'up') || net1[0];
    const iface2 = net2.find(i => i.iface === iface1.iface) || net2[0];

    return {
      upload: parseFloat(((iface2.tx_bytes - iface1.tx_bytes) / 1024).toFixed(2)),
      download: parseFloat(((iface2.rx_bytes - iface1.rx_bytes) / 1024).toFixed(2)),
      interface: iface1.iface,
    };
  } catch (err) {
    console.error(err);
    return { upload: 0, download: 0, activeConnections: 0 };
  }
};

const getProcessCount = () => {
  try {
    return Math.floor(Math.random() * 200) + 50;
  } catch (error) {
    return 0;
  }
};

export const optimizeSystem = async () => {
  try {
    await execPromise('del /q/f/s %TEMP%\\*'); // deletes temp folder files
    console.log('Temporary files cleared');
    return{ success : true }
  } catch (err) {
    console.error('Failed to clear temp files:', err.message);
    return{ success : false }
  }
};

export const getRunningProcesses = async () => {
  try {
    const processData = await si.processes(); // returns info about all running processes
    // Example: return top 10 CPU-consuming processes
    const topProcesses = processData.list
      .sort((a, b) => b.memRss - a.memRss)
      .slice(0, 20)
      .map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: parseFloat(p.cpu.toFixed(2)),
        memory: parseFloat((p.memRss / 1024 / 1024).toFixed(2)), // MB
      }));

      console.log(topProcesses)

    return topProcesses;
  } catch (err) {
    console.error('Error fetching processes:', err);
    return [];
  }
};

export const getBatteryStatus = async () => {
  try {
    const { stdout } = await execPromise(
      `powershell "Get-WmiObject Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus"`,
      { encoding: 'utf8' }
    );

    // Parse the output
    const chargeMatch = stdout.match(/(\d+)/);
    const estimatedCharge = chargeMatch ? parseInt(chargeMatch[1]) : 100;

    // Battery Status: 1 = Discharging, 2 = Connected
    const isCharging = stdout.includes('2') || stdout.includes('Connected');
    // console.log(isCharging)

    return {
      status: isCharging ? 'Charging' : 'Disconnected',
      isPlugged: isCharging,
      percentage: estimatedCharge,
      health: 'Good',
      error: null,
    };
  } catch (error) {
    console.error('Error getting Windows battery:', error.message);

    // Fallback: Try alternative method
    try {
      const { stdout } = await execPromise(
        `wmic path Win32_Battery get EstimatedChargeRemaining`,
        { encoding: 'utf8' }
      );

      const match = stdout.match(/(\d+)/);
      const percentage = match ? parseInt(match[1]) : 100;

      return {
        status: 'Unknown',
        isPlugged: true,
        percentage: percentage,
        health: 'Good',
        error: null,
      };
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);

      // Desktop/No Battery - assume always plugged
      return {
        status: 'Connected',
        isPlugged: true,
        percentage: 100,
        health: 'Good',
        error: 'No battery detected (Desktop PC)',
      };
    }
  }
};


export const startMonitoring = () => {
  console.log('System monitoring started');
};