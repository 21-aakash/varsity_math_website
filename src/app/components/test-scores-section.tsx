import { TrendingUp, Award, Target, BarChart3, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

interface TestScore {
  testName: string;
  date: string;
  score: number;
  maxScore: number;
  subject: string;
}

interface TestScoresSectionProps {
  studentName: string;
}

export function TestScoresSection({ studentName }: TestScoresSectionProps) {
  // Will be populated from API (Google Sheets) in future
  const testScores: TestScore[] = [];

  const totalStudents = 0;
  const studentRank = 0;

  // Calculate stats
  const totalTests = testScores.length;
  const averageScore = totalTests > 0
    ? Math.round(testScores.reduce((sum, test) => sum + (test.score / test.maxScore) * 100, 0) / totalTests)
    : 0;

  // Prepare data for charts
  const chartData = testScores.map(test => ({
    name: test.testName,
    score: Math.round((test.score / test.maxScore) * 100),
    date: test.date
  }));

  // Subject-wise performance
  const subjectPerformance = testScores.reduce((acc, test) => {
    const percentage = Math.round((test.score / test.maxScore) * 100);
    if (!acc[test.subject]) {
      acc[test.subject] = { subject: test.subject, totalScore: 0, count: 0 };
    }
    acc[test.subject].totalScore += percentage;
    acc[test.subject].count += 1;
    return acc;
  }, {} as Record<string, { subject: string; totalScore: number; count: number }>);

  const subjectChartData = Object.values(subjectPerformance).map(item => ({
    subject: item.subject,
    avgScore: Math.round(item.totalScore / item.count)
  }));

  // State for filtering - separate for each component
  const [trendFilter, setTrendFilter] = useState<string>('All');
  const [subjectPerfFilter, setSubjectPerfFilter] = useState<string>('All');
  const [tableFilter, setTableFilter] = useState<string>('All');

  // Get unique subjects
  const subjects = ['All', ...Array.from(new Set(testScores.map(test => test.subject)))];

  // Filter for Score Trend Chart
  const trendFilteredScores = trendFilter === 'All'
    ? testScores
    : testScores.filter(test => test.subject === trendFilter);

  const trendChartData = trendFilteredScores.map(test => ({
    name: test.testName,
    score: Math.round((test.score / test.maxScore) * 100),
    date: test.date,
    subject: test.subject
  }));

  // Filter for Subject Performance Chart
  const subjectPerfFilteredScores = subjectPerfFilter === 'All'
    ? testScores
    : testScores.filter(test => test.subject === subjectPerfFilter);

  const subjectPerfData = subjectPerfFilteredScores.reduce((acc, test) => {
    const percentage = Math.round((test.score / test.maxScore) * 100);
    if (!acc[test.subject]) {
      acc[test.subject] = { subject: test.subject, totalScore: 0, count: 0 };
    }
    acc[test.subject].totalScore += percentage;
    acc[test.subject].count += 1;
    return acc;
  }, {} as Record<string, { subject: string; totalScore: number; count: number }>);

  const subjectPerfChartData = Object.values(subjectPerfData).map(item => ({
    subject: item.subject,
    avgScore: Math.round(item.totalScore / item.count)
  }));

  // Filter for Table
  const tableFilteredScores = tableFilter === 'All'
    ? testScores
    : testScores.filter(test => test.subject === tableFilter);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tests</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{totalTests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Score</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Class Rank */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Class Rank</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">#{studentRank}</p>
              <p className="text-xs text-gray-500 mt-1">out of {totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Improvement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Improvement</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-500 mt-1">—</p>
              <p className="text-xs text-gray-500 mt-1">no data yet</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {totalTests === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Test Scores Yet</h3>
          <p className="text-gray-600">Your test scores and performance analytics will appear here once your teacher publishes results.</p>
        </div>
      ) : (
      <>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-gray-900">Score Trend</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0066cc" 
                strokeWidth={3}
                dot={{ fill: '#0066cc', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject-wise Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-gray-900">Subject-wise Performance</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={subjectPerfFilter}
                onChange={(e) => setSubjectPerfFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectPerfChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="subject" 
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="avgScore" 
                fill="#0066cc" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Test Scores Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">Recent Test Scores</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="md:hidden divide-y divide-gray-200">
          {tableFilteredScores.map((test, index) => {
            const percentage = Math.round((test.score / test.maxScore) * 100);
            return (
              <div key={index} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-gray-900 text-sm leading-5">{test.testName}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                    {test.subject}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {new Date(test.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">{test.score}/{test.maxScore}</p>
                  <span className={`font-semibold text-sm ${
                    percentage >= 90 ? 'text-green-600' :
                    percentage >= 75 ? 'text-blue-600' :
                    percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percentage >= 90 ? 'bg-green-500' :
                      percentage >= 75 ? 'bg-blue-500' :
                      percentage >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableFilteredScores.map((test, index) => {
                const percentage = Math.round((test.score / test.maxScore) * 100);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{test.testName}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {test.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(test.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {test.score}/{test.maxScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              percentage >= 90 ? 'bg-green-500' :
                              percentage >= 75 ? 'bg-blue-500' :
                              percentage >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className={`font-semibold text-sm ${
                          percentage >= 90 ? 'text-green-600' :
                          percentage >= 75 ? 'text-blue-600' :
                          percentage >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insight */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Insight</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Great job, {studentName}! You're performing exceptionally well with an average score of {averageScore}%. 
              Your rank is #{studentRank} out of {totalStudents} students. Keep up the excellent work! 
              {averageScore >= 90 && " You're in the top tier of performers! 🌟"}
              {averageScore >= 75 && averageScore < 90 && " You're doing great! Focus on consistent practice to reach the top tier."}
              {averageScore < 75 && " Keep practicing and you'll see improvement. Don't hesitate to reach out to your instructor for help."}
            </p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}