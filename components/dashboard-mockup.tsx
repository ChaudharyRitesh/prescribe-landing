'use client';

import { BarChart3, TrendingUp, Users, Package, Clock, AlertCircle } from 'lucide-react';

export function DashboardMockup({ variant = 'pharmacy' }: { variant?: 'pharmacy' | 'hospital' | 'reception' | 'lab' }) {
  const configs = {
    pharmacy: {
      title: 'Pharmacy Dashboard',
      stats: [
        { label: 'Stock Items', value: '2,847', icon: Package, color: 'bg-blue-100 text-blue-600' },
        { label: 'Low Stock', value: '12', icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
        { label: 'Orders Today', value: '156', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
        { label: 'Revenue', value: '$12.4K', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
      ],
      chart: [45, 52, 48, 65, 72, 68, 75],
    },
    hospital: {
      title: 'Hospital Dashboard',
      stats: [
        { label: 'Patients', value: '1,247', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Beds Occupied', value: '89%', icon: Package, color: 'bg-red-100 text-red-600' },
        { label: 'Appointments', value: '342', icon: Clock, color: 'bg-green-100 text-green-600' },
        { label: 'Revenue', value: '$45.2K', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
      ],
      chart: [60, 65, 70, 75, 80, 78, 85],
    },
    reception: {
      title: 'Reception Dashboard',
      stats: [
        { label: 'Queue Length', value: '23', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Avg Wait', value: '12 min', icon: Clock, color: 'bg-orange-100 text-orange-600' },
        { label: 'Check-ins', value: '287', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
        { label: 'No-shows', value: '3', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
      ],
      chart: [30, 35, 28, 42, 38, 45, 40],
    },
    lab: {
      title: 'Lab Dashboard',
      stats: [
        { label: 'Tests Pending', value: '156', icon: Package, color: 'bg-blue-100 text-blue-600' },
        { label: 'Completed', value: '423', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
        { label: 'Avg Turnaround', value: '4.2h', icon: Clock, color: 'bg-purple-100 text-purple-600' },
        { label: 'Quality Score', value: '98.5%', icon: BarChart3, color: 'bg-blue-100 text-blue-600' },
      ],
      chart: [55, 60, 58, 70, 75, 72, 80],
    },
  };

  const config = configs[variant];

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white overflow-hidden">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold">{config.title}</h3>
        <p className="text-xs text-slate-400 mt-1">Real-time analytics & insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {config.stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                <Icon size={16} />
              </div>
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Mini Chart */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-end justify-between h-16 gap-1">
          {config.chart.map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${(value / 100) * 100}%` }}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Last 7 days performance</p>
      </div>
    </div>
  );
}

export function HeroDashboardShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DashboardMockup variant="pharmacy" />
      <DashboardMockup variant="hospital" />
    </div>
  );
}

export function ModulesDashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardMockup variant="pharmacy" />
      <DashboardMockup variant="hospital" />
      <DashboardMockup variant="reception" />
      <DashboardMockup variant="lab" />
    </div>
  );
}
