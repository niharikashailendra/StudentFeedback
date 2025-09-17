"use client";

import { useState, useEffect } from "react";
import AdminRoute from "@/components/auth/admin-route";
import { adminApi } from "@/lib/api";

import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import toast from "react-hot-toast";
import EnhancedAnalyticsCharts from "@/components/analytics/EnhancedAnalyticsCharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({});
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [timeRange, setTimeRange] = useState("7days"); // 7days, 30days, 90days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const [statsRes, feedbackRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getFeedbackStats(),
      ]);

      setStats(statsRes.data);
      setFeedbackStats(feedbackRes.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchAnalyticsData();
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">Comprehensive insights and metrics</p>
          </div>

          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>

            <button
              onClick={refreshData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalStudents || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Feedback
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalFeedback || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Total Courses
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalCourses || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-600">
                  Blocked Users
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {stats.blockedStudents || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}

        <EnhancedAnalyticsCharts
          feedbackStats={feedbackStats}
          timeRange={timeRange}
        />

        {/* Feedback Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            Feedback Distribution by Course
          </h2>

          {feedbackStats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No feedback data available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbackStats.map((stat) => (
                <div
                  key={stat.courseCode}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {stat.courseName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Rating:</span>
                      <span className="font-semibold text-yellow-600">
                        {stat.avgRating} ⭐
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Feedback:</span>
                      <span className="font-semibold text-blue-600">
                        {stat.feedbackCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Course Code:</span>
                      <span className="font-mono text-gray-600">
                        {stat.courseCode}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
