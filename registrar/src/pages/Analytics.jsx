import { useState, useEffect } from 'react';
import api from '../api/axios';

const BarChart = ({ data, labelKey, valueKey, color }) => {
  const max = Math.max(...data.map((d) => parseInt(d[valueKey])));
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-32 truncate">{item[labelKey]}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all"
              style={{
                width: `${(parseInt(item[valueKey]) / max) * 100}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-6">{item[valueKey]}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [byType, setByType] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [typeRes, statusRes, dailyRes] = await Promise.all([
          api.get('/analytics/requests/by-type'),
          api.get('/analytics/requests/by-status'),
          api.get('/analytics/requests/daily'),
        ]);
        setByType(typeRes.data);
        setByStatus(statusRes.data);
        setDaily(dailyRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Request trends and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Requests by Document Type
          </h2>
          {byType.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <BarChart
              data={byType}
              labelKey="documentType"
              valueKey="count"
              color="#800000"
            />
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Requests by Status
          </h2>
          {byStatus.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <BarChart
              data={byStatus}
              labelKey="status"
              valueKey="count"
              color="#FFD700"
            />
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Daily Requests (Last 30 Days)
          </h2>
          {daily.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <BarChart
              data={daily}
              labelKey="date"
              valueKey="count"
              color="#800000"
            />
          )}
        </div>
      </div>
    </div>
  );
}