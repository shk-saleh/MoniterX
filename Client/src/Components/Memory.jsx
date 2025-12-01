import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const Memory = ({ systemData, chartData }) => {

  // Safety Checks
  const memory = systemData?.memory || {};
  const total = memory.total || 0;
  const used = memory.used || 0;
  const free = memory.free || 0;
  const usage = memory.usage || 0;

  return (
    <div className="h-[86vh] space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* RAM Usage Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">RAM Usage Trend</h3>

            {Array.isArray(chartData) && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300} className='-ms-8'>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" style={{ fontSize: "12px" }} />
                  <YAxis  style={{ fontSize: "12px" }}/>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="ram"
                    stroke="#00D4FF"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Loading...
              </div>
            )}
          </div>

          {/* Memory Details */}
          <div>

            <div className="space-y-4 mt-10">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Total Memory: {total} GB
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${usage}%`,
                      backgroundColor: "#00D4FF"
                    }}
                  />
                </div>

                <p className="text-sm mt-2 font-semibold">{used} GB Used</p>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used</span>
                  <span className="font-medium">{used} GB</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Free</span>
                  <span className="font-medium">{free} GB</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Usage %</span>
                  <span className="font-medium">{usage.toFixed(1)}%</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Memory;
