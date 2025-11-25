import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Disk = ({ systemData, chartData }) => {
  const disk = systemData?.disk || {};


  return (
    <div className="min-h-screen space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disk Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Disk Usage Trend</h3>
            {chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="disk" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">Loading...</div>
            )}
          </div>

          {/* Disk details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Disk Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Total Space: {(disk.mounted / (1024 * 1024 * 1024)).toFixed(2)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${disk.usage}%`,
                      backgroundColor: "#FF6B6B",
                    }}
                  />
                </div>
                {/* <p className="text-sm mt-2 font-semibold">{(disk.mounted / (1024 * 1024 * 1024)).toFixed(2)} Used</p> */}
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="flex justify-between text-sm">
                  <span>Free</span>
                  <span className="font-medium">{(disk.free / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span>Read Speed</span>
                  <span className="font-medium">{disk.readSpeed} MB/s</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span>Write Speed</span>
                  <span className="font-medium">{disk.writeSpeed} MB/s</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Disk;
