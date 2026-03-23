import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const StatCard = ({ label, value, icon, iconBg, sub }) => (
  <div className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl" style={{ backgroundColor: iconBg }}>
      {icon}
    </div>
  </div>
);

const DONUT_COLORS = ['#800000', '#FFD700', '#1a1a2e', '#e74c3c', '#3498db', '#2ecc71'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [byType, setByType] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overviewRes, typeRes, dailyRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/requests/by-type'),
          api.get('/analytics/requests/daily'),
        ]);
        setStats(overviewRes.data);
        setByType(typeRes.data.map((d) => ({ name: d.documentType, value: parseInt(d.count) })));
        setDaily(dailyRes.data.map((d) => ({ 
            date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            count: parseInt(d.count) 
          })).reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
      <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
        <p className="text-gray-400 text-sm">Welcome back to the Registrar Dashboard</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats?.totalRequests ?? 0}
          icon="📄"
          iconBg="#800000"
          sub="All time"
        />
        <StatCard
          label="Pending"
          value={stats?.pendingRequests ?? 0}
          icon="⏳"
          iconBg="#F59E0B"
          sub="Needs action"
        />
        <StatCard
          label="Completed"
          value={stats?.completedRequests ?? 0}
          icon="✅"
          iconBg="#10B981"
          sub="Processed"
        />
        <StatCard
          label="Visitors"
          value={stats?.totalVisitors ?? 0}
          icon="👥"
          iconBg="#3B82F6"
          sub="Total logged"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Daily Requests</h2>
          {daily.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#800000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">By Document Type</h2>
          {byType.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconSize={10} iconType="circle" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}