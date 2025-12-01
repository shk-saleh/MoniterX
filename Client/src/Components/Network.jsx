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
    <div className="space-y-6 h-[86vh]">
      <div className="bg-white rounded-lg p-6 shadow-md">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Network Activity</h3>
            {chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} className='-ms-8'>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time"  style={{ fontSize: "12px" }}/>
                  <YAxis  style={{ fontSize: "12px" }}/>
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

            <div className="space-y-4 mt-10">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">Download Speed</p>
                <p className="text-2xl font-bold" style={{ color: "#4ECDC4" }}>
                  {net.download?.toFixed(2)} Kbps
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm text-gray-600">Upload Speed</p>
                <p className="text-2xl font-bold" style={{ color: "#FF9999" }}>
                  {net.upload?.toFixed(2)} Kbps
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
