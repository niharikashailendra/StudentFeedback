"use client"
import { useState, useEffect } from "react";
import AdminRoute from "@/components/auth/admin-route";
import { adminApi } from "@/lib/api";
import Link from "next/link";

export default function AdminPage() {
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, studentsRes, feedbackRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getStudents(currentPage, 10),
        adminApi.getFeedbackStats(),
      ]);

      setStats(statsRes.data);
      setStudents(studentsRes.data.students);
      setTotalPages(studentsRes.data.totalPages);
      setFeedbackStats(feedbackRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockStudent = async (studentId, blocked) => {
    try {
      await adminApi.blockStudent(studentId, blocked);
      setStudents(
        students.map((student) =>
          student._id === studentId ? { ...student, blocked } : student
        )
      );
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This will also delete all their feedback."
      )
    )
      return;

    try {
      await adminApi.deleteStudent(studentId);
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await adminApi.exportFeedback();
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "feedback-export.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
            <p className="text-slate-600 text-sm font-medium">Loading dashboard...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Administration Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Manage students, courses, and monitor system analytics
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Statistics Overview */}
          <div className="mb-10">
            <h2 className="text-lg font-medium text-slate-900 mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Students
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                      {stats.totalStudents?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Total Feedback
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                      {stats.totalFeedback?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Active Courses
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                      {stats.totalCourses?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      Restricted Access
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                      {stats.blockedStudents?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Students Management */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900">Student Management</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Manage student accounts and permissions
                      </p>
                    </div>
                    <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {students.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <p className="text-slate-500 text-sm">No students found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div
                          key={student._id}
                          className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-slate-600">
                                    {student.name?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900">{student.name}</h4>
                                  <p className="text-sm text-slate-500">{student.email}</p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    Member since {new Date(student.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                                {student.blocked && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                    Access Restricted
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                              <button
                                onClick={() =>
                                  handleBlockStudent(student._id, !student.blocked)
                                }
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                  student.blocked
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-600/25"
                                    : "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-lg shadow-amber-600/25"
                                }`}
                              >
                                {student.blocked ? (
                                  <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Restore Access
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    Restrict Access
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student._id)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => Math.abs(page - currentPage) <= 2)
                          .map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                page === currentPage
                                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                      </div>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Course Analytics */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">Quick Actions</h3>
                  <p className="text-sm text-slate-500 mt-1">Common administrative tasks</p>
                </div>
                <div className="p-6 space-y-3">
                  <Link
                    href="/admin/courses"
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Manage Courses
                  </Link>
                  <button
                    onClick={exportCSV}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/25"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Data
                  </button>
                  <Link
                    href="/admin/analytics"
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/25"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Analytics
                  </Link>
                </div>
              </div>

              {/* Course Performance */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">Course Performance</h3>
                  <p className="text-sm text-slate-500 mt-1">Recent feedback statistics</p>
                </div>
                <div className="p-6">
                  {feedbackStats.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-slate-500 text-sm">No feedback data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbackStats.map((stat) => (
                        <div
                          key={stat.courseCode}
                          className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 truncate pr-2">
                              {stat.courseName}
                            </h4>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {stat.courseCode}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-slate-600">Rating:</span>
                              <span className="font-medium text-slate-900">
                                {stat.avgRating}
                              </span>
                              <div className="flex items-center ml-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(stat.avgRating)
                                        ? "text-amber-400"
                                        : "text-slate-200"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="text-slate-500">
                              {stat.feedbackCount} reviews
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}