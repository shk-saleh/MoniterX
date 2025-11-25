import React from "react";
import { Zap, AlertCircle, X  } from "lucide-react";

const Processes = ({ processes, onOptimize, optimizing, handleOptimize, optimizationResult = true }) => {


  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold" style={{ color: "#7162bb" }}> Running Processes</h2>
          <button
            onClick={handleOptimize}
            disabled={optimizing}
            className="px-4 py-2 text-white rounded-lg font-semibold text-md transition-all hover:shadow-lg disabled:opacity-70 cursor-pointer"
            style={{ backgroundColor: "#7162bb" }}
          >
          {optimizing ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="animate-spin mr-2" size={24} />
              Optimizing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Zap className="mr-2" size={20} />
              Scan & Optimize Now
            </span>
          )}
        </button>

        {optimizationResult && (
          <div
            className="fixed bottom-10 right-3 z-100 bg-white mt-8 p-5 rounded-lg border border-gray-300"
          >
            <h3
              className="flex justify-between items-center gap-4 text-lg font-bold mb-4"
              style={{ color: "#7162bb" }}
            >
              Optimization Complete!
              <X size={20} className="mr-2 cursor-pointer" />
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600 text-sm">RAM Freed</p>
                <p className="text-2xl font-bold" style={{ color: "#7162bb" }}>
                  {optimizationResult.ramFreed}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Processes Optimized</p>
                <p className="text-2xl font-bold" style={{ color: "#00D4FF" }}>
                  {optimizationResult.processesOptimized}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">CPU Improvement</p>
                <p className="text-2xl font-bold" style={{ color: "#FF6B6B" }}>
                  {optimizationResult.cpuImprovement}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Table Card with Bottom-Right Button */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#f0f3fd" }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Process Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">PID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">CPU %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Memory (MB)</th>
              </tr>
            </thead>
            <tbody>
              {processes?.length > 0 ? (
                processes.map((proc, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{proc.name}</td>
                    <td className="px-6 py-4 text-sm">{proc.pid}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#7162bb" }}>
                      {proc.cpu?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#00D4FF" }}>
                      {proc.memory?.toFixed(2)} MB
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-gray-500">
                    No running processes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Processes;