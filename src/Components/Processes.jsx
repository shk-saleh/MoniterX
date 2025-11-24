import React from "react";
import { Zap } from "lucide-react";

const Processes = ({ processes, onOptimize }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold" style={{ color: "#7162bb" }}>
        Running Processes
      </h2>

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

        {/* Optimize Button - Bottom Right Corner */}
        <div className="absolute bottom-4 right-6">
          <button
            onClick={onOptimize}
            className="flex items-center gap-2 bg-gradient-to-r from-[#7162bb] to-[#5a4a9e] hover:from-[#5a4a9e] hover:to-[#483d8b] text-white font-semibold py-3 px-7 rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-100"
          >
            <Zap className="w-5 h-5" />
            Optimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default Processes;