import React, {useState} from "react";
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

  const disks = systemData?.disk?.storage || [];
  const [selectedDisk, setSelectedDisk] = useState(disks[0] || {});


  return (
    <div className="h-[86vh] space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disk Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Disk Usage Trend</h3>
            {chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}  className='-ms-10'>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" style={{ fontSize: "12px" }} />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Bar dataKey="disk" fill="#dfdfdf" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">Loading...</div>
            )}
          </div>

          {/* Disk details */}
          <div className="mt-10">
            <select name="DiskType"  
              value={selectedDisk.fs}
              onChange={(e) =>
                setSelectedDisk(disks.find((d) => d.fs === e.target.value))
              } 
              className="bg-gray-100 w-50 h-10 text-gray-700 rounded-lg cursor-pointer mb-6">
              {disks.map((disk) => (
                <option key={disk.fs} value={disk.fs}>
                  Disk: {disk.fs}
                </option>
              ))}
            </select>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Total Space: {(selectedDisk.size / (1024 * 1024 * 1024)).toFixed(2)}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full"
                    style={{
                      width: `${selectedDisk.use}%`,
                      backgroundColor: `${selectedDisk.use > 70 ? '#FF6B6B' : '#59e015' }`,
                    }}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="flex justify-between text-sm">
                  <span>Free</span>
                  <span className="font-medium">{(selectedDisk.available / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span>Read Speed</span>
                  <span className="font-medium">{selectedDisk.readSpeedKB} KB/s</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span>Write Speed</span>
                  <span className="font-medium">{selectedDisk.writeSpeedKB} KB/s</span>
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