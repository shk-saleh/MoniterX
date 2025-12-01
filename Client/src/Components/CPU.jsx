import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Activity, TrendingUp, Zap, Battery, AlertCircle, ThermometerIcon } from 'lucide-react';

const CPUMonitor = ({ systemData, chartData }) => {
  const [cpuData, setCpuData] = useState(null);
  const [coreData, setCoreData] = useState([]);
  const [loading, setLoading] = useState(!systemData);

  // Update component when socket data arrives
  useEffect(() => {
    if (systemData && systemData.cpu) {
      // Map the socket data to component format
      const mappedData = {
        model: systemData.cpu.model || 'Unknown',
        cores: systemData.cpu.cores || 0,
        threads: systemData.cpu.cores || 0, // Usually same as cores
        usage: systemData.cpu.usage || 0,
        baseFrequency: systemData.cpu.baseFrequency || 1.7,
        maxFrequency: (systemData.cpu.speed / 1000).toFixed(2) || 0, // Convert MHz to GHz
        temperature: systemData.cpu.temperature || 0,
        processes: systemData.processes || 0,
        coreUsage: systemData.cpu.coreUsage || [],
        status: systemData.battery.status || 'Disconnected',
        percentage: systemData.battery.percentage || 100
      };

      setCpuData(mappedData);

      // Update core data for visualization
      if (mappedData.coreUsage && mappedData.coreUsage.length > 0) {
        const cores = mappedData.coreUsage.map((usage, index) => ({
          core: `Core ${index}`,
          usage: usage,
        }));
        setCoreData(cores);
      }

      setLoading(false);
    }
  }, [systemData]);


  const StatCard = ({ icon: Icon, label, value, unit, color, subLabel }) => (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">{label}</p>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon size={24} style={{ color }} />
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


  const StatusCard = ({ label, status, color, icon: Icon }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color }} />
          <span className="text-gray-700 font-medium">{label}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.includes("Disconnected")  ? "border border-gray-300 text-gray-700 bg-transparent" : "text-white"}`}
          style={!status.includes("Disconnected") ? { backgroundColor: color } : {}}
        >
          {status}
        </span>

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
          <div className="animate-spin mb-4">
            <Cpu size={48} style={{ color: '#7162bb' }} />
          </div>
          <p className="text-xl font-semibold" style={{ color: '#7162bb' }}>
            Loading CPU Monitor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Activity}
          label="CPU Usage"
          value={cpuData?.usage || 0}
          unit="%"
          color="#7162bb"
          subLabel="Current Load"
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
          icon={ThermometerIcon}
          label="Temperature"
          value={cpuData?.temperature || 0}
          unit="°C"
          color="#FF6B6B"
          subLabel="CPU Temp"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard
          icon={Battery}
          label="Power Status"
          status={`${cpuData?.percentage}% ${cpuData?.status}`}
          color="#4ECDC4"
        />
        <StatusCard
          icon={AlertCircle}
          label="System Health"
          status={cpuData?.temperature > 80 ? "Warning" : "Good"}
          color={cpuData?.temperature > 80 ? "#FF6B6B" : "#52C41A"}
        />
        <StatusCard
          icon={Activity}
          label="Active Processes"
          status={`${cpuData?.processes || 0} Running`}
          color="#7162bb"
        />
      </div>

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
              <span className="text-gray-600">Max Frequency</span>
              <span className="font-semibold text-gray-900">{cpuData?.maxFrequency || 0} GHz</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Active Processes</span>
              <span className="font-semibold text-gray-900">{cpuData?.processes || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* CPU Usage Trend */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            CPU Usage Over Time
          </h3>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className='-ms-10'>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7162bb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7162bb" stopOpacity={0.1} />
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#7162bb"
                  strokeWidth={2}
                  fill="url(#cpuGradient)"
                  name="CPU Usage (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No chart data available</div>
          )}
        </div>

        {/* Temperature Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
            Temperature Monitoring
          </h3>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className='-ms-10'>
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#FF6B6B"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No chart data available</div>
          )}
        </div>
      </div>

      {coreData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
            <ResponsiveContainer width="100%" height={300} className='-ms-10'>
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
          </div>
        </div>
      )}

    </div>
  );
};

export default CPUMonitor;