import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Network = ({ systemData, chartData }) => {
  const net = systemData?.network || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#7162bb" }}>
          Network Monitoring
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Network Activity</h3>
            {chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#4ECDC4"
                    strokeWidth={2}
                    name="Download"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">Loading...</div>
            )}
          </div>

          {/* Network details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Network Details</h3>

            <div className="space-y-4">
              <div className="p-4 border-l-4 rounded" style={{ borderColor: "#4ECDC4", backgroundColor: "#f0f3fd" }}>
                <p className="text-sm text-gray-600">Download Speed</p>
                <p className="text-2xl font-bold" style={{ color: "#4ECDC4" }}>
                  {net.download?.toFixed(2)} Mbps
                </p>
              </div>

              <div className="p-4 border-l-4 rounded" style={{ borderColor: "#FF9999", backgroundColor: "#f0f3fd" }}>
                <p className="text-sm text-gray-600">Upload Speed</p>
                <p className="text-2xl font-bold" style={{ color: "#FF9999" }}>
                  {net.upload?.toFixed(2)} Mbps
                </p>
              </div>

              <div className="p-4 border-l-4 rounded" style={{ borderColor: "#7162bb", backgroundColor: "#f0f3fd" }}>
                <p className="text-sm text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold" style={{ color: "#7162bb" }}>
                  {net.activeConnections}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Network;
