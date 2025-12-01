
const StatCard = ({ icon: Icon, label, value, unit, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-xl font-medium mt-2" style={{ color }}>
            {typeof value === 'number' ? value.toFixed(1) : value}{unit}
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={28} style={{ color }} />
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${Math.min(value || 0, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
);

export default StatCard