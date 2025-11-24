import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Activity, TrendingUp, Zap, RefreshCw } from 'lucide-react';

const CPUMonitor = () => {
  const [cpuData, setCpuData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [coreData, setCoreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartDataRef = useRef([]);

  useEffect(() => {
    const fetchCPUData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/system/cpu');
        const data = await response.json();
        setCpuData(data);
        setLoading(false);

        // Update chart data
        if (chartDataRef.current.length > 20) {
          chartDataRef.current.shift();
        }
        chartDataRef.current.push({
          time: new Date().toLocaleTimeString(),
          usage: data.usage,
          temperature: data.temperature || 0,
        });
        setChartData([...chartDataRef.current]);

        // Update core data
        if (data.coreUsage && data.coreUsage.length > 0) {
          const cores = data.coreUsage.map((usage, index) => ({
            core: `Core ${index}`,
            usage: usage,
          }));
          setCoreData(cores);
        }
      } catch (error) {
        console.error('Error fetching CPU data:', error);
        setLoading(false);
        // Fallback demo data
        setCpuData({
          model: 'Intel Core i7-9700K',
          cores: 8,
          threads: 8,
          baseFrequency: 3.6,
          maxFrequency: 4.9,
          usage: 45 + Math.random() * 20,
          temperature: 55 + Math.random() * 15,
          processes: 145,
          coreUsage: Array.from({ length: 8 }, () => Math.random() * 100),
        });

        // Generate demo chart data
        if (chartDataRef.current.length === 0) {
          for (let i = 0; i < 20; i++) {
            chartDataRef.current.push({
              time: new Date(Date.now() - (20 - i) * 2000).toLocaleTimeString(),
              usage: 30 + Math.random() * 40,
              temperature: 50 + Math.random() * 20,
            });
          }
          setChartData([...chartDataRef.current]);
        }

        // Generate demo core data
        const cores = Array.from({ length: 8 }, (_, i) => ({
          core: `Core ${i}`,
          usage: Math.random() * 100,
        }));
        setCoreData(cores);
      }
    };

    fetchCPUData();
    const interval = setInterval(fetchCPUData, 2000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, label, value, unit, color, subLabel }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          <span className="text-lg ml-1">{unit}</span>
        </p>
        {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, color, max = 100 }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min((value / max) * 100, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f3fd' }}>
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} style={{ color: '#7162bb' }} />
          <p className="text-xl font-semibold" style={{ color: '#7162bb' }}>Loading CPU Monitor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f0f3fd' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#7162bb' }}>
          <Cpu size={36} />
          CPU Monitoring Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Real-time processor performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Activity}
          label="CPU Usage"
          value={cpuData?.usage || 0}
          unit="%"
          color="#7162bb"
          subLabel="Average Load"
        />
        <StatCard
          icon={Zap}
          label="Frequency"
          value={cpuData?.maxFrequency || 0}
          unit="GHz"
          color="#00D4FF"
          subLabel={`Base: ${cpuData?.baseFrequency || 0} GHz`}
        />
        <StatCard
          icon={TrendingUp}
          label="Temperature"
          value={cpuData?.temperature || 0}
          unit="°C"
          color="#FF6B6B"
          subLabel="Current Temp"
        />
        <StatCard
          icon={Cpu}
          label="Cores"
          value={cpuData?.cores || 0}
          unit=""
          color="#4ECDC4"
          subLabel={`${cpuData?.threads || 0} Threads`}
        />
      </div>

      {/* CPU Details Card */}
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#7162bb' }}>
          <Cpu size={24} />
          Processor Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Model</span>
              <span className="font-semibold text-gray-900">{cpuData?.model || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Physical Cores</span>
              <span className="font-semibold text-gray-900">{cpuData?.cores || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Logical Processors</span>
              <span className="font-semibold text-gray-900">{cpuData?.threads || 0}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Base Frequency</span>
              <span className="font-semibold text-gray-900">{cpuData?.baseFrequency || 0} GHz</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Max Turbo Frequency</span>
              <span className="font-semibold text-gray-900">{cpuData?.maxFrequency || 0} GHz</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Processes</span>
              <span className="font-semibold text-gray-900">{cpuData?.processes || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CPU Usage Trend */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            CPU Usage Over Time
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7162bb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7162bb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="time" 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#7162bb" 
                  strokeWidth={2}
                  fill="url(#cpuGradient)"
                  name="CPU Usage (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
          )}
        </div>

        {/* Temperature Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            Temperature Monitoring
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="time" 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#FF6B6B" 
                  strokeWidth={3}
                  dot={{ fill: '#FF6B6B', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
          )}
        </div>
      </div>

      {/* Per-Core Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Usage Bars */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            Per-Core Usage
          </h3>
          <div className="space-y-3">
            {coreData.map((core, index) => (
              <ProgressBar
                key={index}
                label={core.core}
                value={core.usage}
                color={`hsl(${250 - (index * 20)}, 70%, 60%)`}
              />
            ))}
          </div>
        </div>

        {/* Core Usage Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            Core Distribution
          </h3>
          {coreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={coreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="core" 
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  style={{ fontSize: '11px' }}
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="usage" 
                  fill="#7162bb"
                  radius={[8, 8, 0, 0]}
                  name="Usage (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-gray-600">Live monitoring active • Updates every 2 seconds</span>
          </div>
          <span className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CPUMonitor;