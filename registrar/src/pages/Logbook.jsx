import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Logbook() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      const endpoint = filter === 'today' ? '/logbook/today' : '/logbook';
      const response = await api.get(endpoint);
      setLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading logbook...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visitor Logbook</h1>
          <p className="text-gray-500 text-sm mt-1">
            Digital record of all office visitors
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors"
            style={{
              backgroundColor: filter === 'all' ? '#800000' : 'white',
              color: filter === 'all' ? 'white' : '#800000',
              borderColor: '#800000',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('today')}
            className="px-4 py-2 text-sm rounded-lg border font-medium transition-colors"
            style={{
              backgroundColor: filter === 'today' ? '#800000' : 'white',
              color: filter === 'today' ? 'white' : '#800000',
              borderColor: '#800000',
            }}
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#800000' }}>
              <th className="text-left px-6 py-3 text-white font-medium">Name</th>
              <th className="text-left px-6 py-3 text-white font-medium">Purpose</th>
              <th className="text-left px-6 py-3 text-white font-medium">Department</th>
              <th className="text-left px-6 py-3 text-white font-medium">Contact</th>
              <th className="text-left px-6 py-3 text-white font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No visitor logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{log.fullName}</td>
                  <td className="px-6 py-4">{log.purpose}</td>
                  <td className="px-6 py-4 text-gray-500">{log.department ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-500">{log.contact ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(log.loggedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}