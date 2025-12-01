import React from "react";
import { Zap, AlertCircle, X, RefreshCw  } from "lucide-react";

const Processes = ({ processes, optimizing, handleOptimize, optimizationResult }) => {


  return (
    <div className="space-y-6 min-h-[86vh] h-auto">
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

        {
          optimizationResult && (

            <div className={`fixed bottom-10 ${optimizationResult ?  '-right-10' : '-right-60'} transition-all duration-200 z-100 bg-white mt-8 p-4 rounded-lg border border-gray-300 shadow-sm`}>
              <p className="text-lg font-medium text-gray-800">
                {optimizationResult.result}
              </p>
            </div>
          )
        }

      </div>

      {/* Table Card with Bottom-Right Button */}
      {  processes ? (

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
                      <tr key={idx} className="border-b border-gray-200">
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

        ) : (
          <div className="h-[80vh] flex items-center justify-center">
            <div className="text-gray-500 text-lg animate-pulse">Looking for Running Processes...</div>
          </div>
        )
      }


    </div>
  );
};

export default Processes;