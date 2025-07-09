import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Phone, 
  Target, 
  Award,
  Plus,
  Eye,
  Trash2,
  BarChart3,
  UserCheck,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { User, TeamPerformance, TimePeriod } from '@/types';
import { authService } from '@/services/authService';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ExportMenu from '@/components/common/ExportMenu';
import { TeamActivityFeed } from '@/components/analytics/TeamActivityFeed';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [salespeople, setSalespeople] = useState<User[]>([]);
  const [teamMetrics, setTeamMetrics] = useState<TeamPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

  // Mock performance data for demo
  const mockPerformanceData = [
    { name: 'Week 1', calls: 45, meetings: 12, success: 27 },
    { name: 'Week 2', calls: 52, meetings: 15, success: 29 },
    { name: 'Week 3', calls: 38, meetings: 8, success: 21 },
    { name: 'Week 4', calls: 61, meetings: 18, success: 34 },
  ];

  const mockUserPerformance = [
    { name: 'John Smith', calls: 48, meetings: 14, successRate: 68 },
    { name: 'Maria Garcia', calls: 52, meetings: 16, successRate: 72 },
    { name: 'Alex Chen', calls: 43, meetings: 11, successRate: 61 },
  ];

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const users = await authService.getAllUsers();
      setSalespeople(users);

      // Mock team performance data
      const mockTeamData: TeamPerformance = {
        teamSize: users.length,
        totalCalls: 196,
        totalMeetings: 53,
        avgSuccessRate: 67,
        topPerformer: {
          userId: '3',
          name: 'Maria Garcia',
          successRate: 72
        },
        memberPerformance: [] // Would be populated with real data
      };

      setTeamMetrics(mockTeamData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportComplete = (format: string) => {
    console.log(`Team report exported in ${format} format`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}. Here's how your team is performing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <ExportMenu
            data={{
              teamData: teamMetrics,
              analytics: {
                performanceData: mockPerformanceData,
                userPerformance: mockUserPerformance,
                outcomeDistribution: [
                  { name: 'Meeting Booked', value: 35 },
                  { name: 'Follow-up', value: 25 },
                  { name: 'Nurture', value: 30 },
                  { name: 'Disqualified', value: 10 }
                ]
              }
            }}
            dataType="analytics"
            filename={`team-performance-${selectedPeriod}`}
            onExportComplete={handleExportComplete}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Team Size</p>
                <p className="text-3xl font-bold">{teamMetrics?.teamSize || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Calls</p>
                <p className="text-3xl font-bold">{teamMetrics?.totalCalls || 0}</p>
              </div>
              <Phone className="w-8 h-8 text-green-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Meetings Booked</p>
                <p className="text-3xl font-bold">{teamMetrics?.totalMeetings || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Success Rate</p>
                <p className="text-3xl font-bold">{teamMetrics?.avgSuccessRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-200" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Team Performance Trend" subtitle="Calls, meetings, and success over time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="meetings" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="success" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Individual Performance" subtitle="Success rates by team member">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockUserPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="successRate" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Performer Highlight */}
      {teamMetrics?.topPerformer && (
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 text-white rounded-full p-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900">Top Performer</h3>
              <p className="text-yellow-800">
                <span className="font-medium">{teamMetrics.topPerformer.name}</span> is leading 
                with {teamMetrics.topPerformer.successRate}% success rate
              </p>
            </div>
            <Button variant="secondary" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </Card>
      )}

      {/* Team Members Management */}
      <Card title="Team Members" subtitle="Manage your sales team">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {salespeople.length} team members
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          <div className="space-y-3">
            {salespeople.map((person) => (
              <div key={person.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  {person.avatar ? (
                    <img 
                      src={person.avatar} 
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{person.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{person.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {person.lastLogin ? 
                      `Last active: ${new Date(person.lastLogin).toLocaleDateString()}` : 
                      'Never logged in'
                    }
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{person.role}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Team Activity Feed */}
      <Card 
        title="Team Activity Feed" 
        subtitle="Real-time view of what your team is doing"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary-600" />
          <span className="text-sm text-gray-600">Live updates from your sales team</span>
        </div>
        <TeamActivityFeed 
          limit={50}
          compact={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;