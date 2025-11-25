import React , { useState, useRef, useEffect } from 'react'
import Overview from './Overview';
import CPU from './CPU';
import Memory from './Memory';
import Disk from './Disk';
import Network from './Network';
import Processes from './Processes';
import Optimize from './Optimize';
import io from 'socket.io-client';


const Main = ({activeTab}) => {


  const socketRef = useRef(null);
  const [systemData, setSystemData] = useState(null);
  const [processes, setProcesses] = useState(null);
  const [chartData, setChartData] = useState([]);
  const chartDataRef = useRef([]);  
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Listen for real-time system updates from backend
    socketRef.current.on('systemUpdate', (data) => {
      console.log('Real-time system update:', data);
      setSystemData(data);
      
      // Add to chart data
      if (chartDataRef.current.length > 11) {
        chartDataRef.current.shift();
      }
      chartDataRef.current.push({
        time: new Date().toLocaleTimeString(),
        cpu: data.cpu.usage,
        ram: data.memory.usage,
        disk: data.disk.usage,
      });
      setChartData([...chartDataRef.current]);
    });

    // Listen for optimization complete event
    socketRef.current.on('optimizationComplete', (result) => {
      console.log('Optimization complete:', result);
      setOptimizationResult({
        ramFreed: result.ramFreed.toFixed(1) + ' GB',
        processesOptimized: result.processesOptimized,
        cpuImprovement: result.cpuImprovement + '%',
      });
      setOptimizing(false);
      setTimeout(() => setOptimizationResult(null), 3000);
    });

    
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      setSocketConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });
    
    // Handle connection errors
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });


    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/system/processes');
        const data = await response.json();
        setProcesses(data);
        console.log(processes)
      } catch (error) {
        console.error('Error fetching processes:', error);
      }
    };

    if (activeTab === 'processes') {
      fetchProcesses();
      const interval = setInterval(fetchProcesses, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);
  

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      // Call API endpoint
      const response = await fetch('http://localhost:3000/api/system/optimize', {
        method: 'POST',
      });
      
      // The response will also come via socket event 'optimizationComplete'
      // from the backend, so you can handle it there
      const result = await response.json();
      
      if (result.success) {
        setOptimizationResult({
          ramFreed: result.ramFreed.toFixed(1) + ' GB',
          processesOptimized: result.processesOptimized,
          cpuImprovement: result.cpuImprovement + '%',
        });
        setOptimizing(false);
        setTimeout(() => setOptimizationResult(null), 5000);
      }
    } catch (error) {
      console.error('Error optimizing system:', error);
      setOptimizing(false);
    }
  };


  const renderTab = () =>{
    switch (activeTab) {
      case 'overview':
         return <Overview systemData={systemData} chartData={chartData}/>
      case 'cpu':
        return <CPU/>
      case 'memory':
      return <Memory systemData={systemData} chartData={chartData} />;
      case 'disk':
        return <Disk systemData={systemData} chartData={chartData} />;
      case 'network':
        return <Network systemData={systemData} chartData={chartData}/>;
      case 'processes':
        return <Processes processes={processes}/>;
      case 'optimize':
        return <Optimize/>;
      default:
        break;
    }
  }


  return (
    <div className='w-full h-auto'>

      {/* Dashboard Header  */}

      <div className='sticky top-0 flex justify-between items-center bg-white border-b border-gray-200 p-4'>
        <span>Moniter what's going on! </span>
        <div className='flex relative gap-2'>
          { socketConnected ? (
          <span class="relative flex items-center">
            <span class="absolute inline-flex size-2 animate-ping rounded-full bg-purple-400 opacity-75"></span>
            <span class="relative inline-flex size-2 rounded-full bg-purple-500"></span>
          </span>
          ) : ''}
          <span className='text-sm'>{socketConnected ? 'Server Connected' : 'Server Disconnected'}</span>
        </div>
      </div>
      <div className='bg-(--primary-color)/4 h-auto p-4'>
        {renderTab()}
      </div>
    </div>
  )
}

export default Main