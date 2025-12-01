import React, {useState} from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './StatCard';
import {Cpu,Activity, HardDrive, Wifi} from 'lucide-react';
import io from 'socket.io-client';


const Overview = ({systemData, chartData}) => {

    return (

        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Cpu}
                label="CPU Usage"
                value={systemData?.cpu?.usage || 0}
                unit="%"
                color="#7162bb"
              />
              <StatCard
                icon={Activity}
                label="Memory Usage"
                value={systemData?.memory?.usage || 0}
                unit="%"
                color="#00D4FF"
              />
              <StatCard
                icon={HardDrive}
                label="Disk Usage"
                value={systemData?.disk?.storage[0].use || 0}
                unit="%"
                color="#FF6B6B"
              />
              <StatCard
                icon={Wifi}
                label="Download Speed"
                value={systemData?.network?.download || 0}
                unit=" Kbps"
                color="#4ECDC4"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
                  System Trends (Real-time)
                </h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300} className='-ms-8'>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" style={{ fontSize: '12px' }} />
                      <YAxis style={{ fontSize: '12px' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#7162bb" strokeWidth={2} />
                      <Line type="monotone" dataKey="ram" stroke="#00D4FF" strokeWidth={2} />
                      <Line type="monotone" dataKey="disk" stroke="#FF6B6B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">Loading chart data...</div>
                )}
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
                  Resource Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300} className='-mt-6'>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Used', value: systemData?.memory?.usage || 0 },
                        { name: 'Free', value: Math.max(0, 100 - (systemData?.memory?.usage || 0)) },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      <Cell fill="#7162bb" />
                      <Cell fill="#E0E7FF" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className='flex items-center gap-2 -mt-10'>
                  <span className='w-4 h-4 bg-[#7162bb]'></span>
                  <span> Used: {systemData?.memory?.usage || 0}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='w-4 h-4 bg-[#E0E7FF]'></span>
                  <span> Free: {100 - (systemData?.memory?.usage || 0)}</span>
                </div>
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#7162bb' }}>
                System Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-100 bg-gray-50 rounded">
                  <p className="text-gray-600 text-sm">Total RAM</p>
                  <p className="text-xl font-bold" style={{ color: '#7162bb' }}>
                    {systemData?.memory?.total} GB
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-gray-50 rounded">
                  <p className="text-gray-600 text-sm">Used RAM</p>
                  <p className="text-xl font-bold" style={{ color: '#00D4FF' }}>
                    {systemData?.memory?.used} GB
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-gray-50 rounded">
                  <p className="text-gray-600 text-sm">Running Processes</p>
                  <p className="text-xl font-bold" style={{ color: '#FF6B6B' }}>
                    {systemData?.processes}
                  </p>
                </div>
                <div className="p-4 border border-gray-100 bg-gray-50 rounded">
                  <p className="text-gray-600 text-sm">CPU Cores</p>
                  <p className="text-xl font-bold" style={{ color: '#4ECDC4' }}>
                    {systemData?.cpu?.cores}
                  </p>
                </div>
              </div>
            </div>
        </div>

    );

}

export default Overview