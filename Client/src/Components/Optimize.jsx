import React from "react";
import { Zap, RefreshCw, AlertCircle } from "lucide-react";

const Optimize = ({ optimizing, handleOptimize, optimizationResult }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-8 shadow-md text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#7162bb" }}>
          System Optimization
        </h2>
        <p className="text-gray-600 mb-8">
          Click the button below to scan and optimize your system
        </p>

        <button
          onClick={handleOptimize}
          disabled={optimizing}
          className="px-8 py-4 text-white rounded-lg font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-70"
          style={{ backgroundColor: "#7162bb" }}
        >
          {optimizing ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="animate-spin mr-2" size={24} />
              Optimizing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Zap className="mr-2" size={24} />
              Scan & Optimize Now
            </span>
          )}
        </button>

        {optimizationResult && (
          <div
            className="mt-8 p-6 rounded-lg"
            style={{
              backgroundColor: "#f0f3fd",
              borderLeft: "4px solid #7162bb",
            }}
          >
            <h3
              className="text-xl font-bold mb-4 flex items-center justify-center"
              style={{ color: "#7162bb" }}
            >
              <AlertCircle size={20} className="mr-2" />
              Optimization Complete!
            </h3>

            <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
};

export default Optimize;
