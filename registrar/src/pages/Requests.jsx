import { useState, useEffect } from 'react';
import api from '../api/axios';

const statusColors = {
  PENDING: { bg: '#FEF3C7', text: '#92400E' },
  ON_PROCESS: { bg: '#DBEAFE', text: '#1E40AF' },
  COMPLETED: { bg: '#D1FAE5', text: '#065F46' },
};

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/requests');
      setRequests(response.data);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.patch(`/requests/${id}/status`, { status });
      await fetchRequests();
      setSelected(null);
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Document Requests</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and track all document requests
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#800000' }}>
              <th className="text-left px-6 py-3 text-white font-medium">Tracking Code</th>
              <th className="text-left px-6 py-3 text-white font-medium">Document Type</th>
              <th className="text-left px-6 py-3 text-white font-medium">Requester</th>
              <th className="text-left px-6 py-3 text-white font-medium">Status</th>
              <th className="text-left px-6 py-3 text-white font-medium">Date</th>
              <th className="text-left px-6 py-3 text-white font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs">{req.trackingCode}</td>
                  <td className="px-6 py-4">{req.documentType}</td>
                  <td className="px-6 py-4">{req.requester?.email ?? 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: statusColors[req.status]?.bg,
                        color: statusColors[req.status]?.text,
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(req.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelected(req)}
                      className="text-xs px-3 py-1 rounded border font-medium hover:bg-gray-50"
                      style={{ color: '#800000', borderColor: '#800000' }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Update Request Status
            </h2>
            <p className="text-sm text-gray-500 mb-4">{selected.trackingCode}</p>
            <div className="space-y-2">
              {['PENDING', 'ON_PROCESS', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(selected.id, status)}
                  disabled={updating || selected.status === status}
                  className="w-full py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40"
                  style={{
                    backgroundColor: selected.status === status ? '#800000' : 'white',
                    color: selected.status === status ? 'white' : '#800000',
                    borderColor: '#800000',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}