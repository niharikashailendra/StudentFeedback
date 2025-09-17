'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import FeedbackForm from '@/components/forms/feedbackform';
import FeedbackItem from '@/components/feedback/FeedBackItem';
import { feedbackApi, coursesApi } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    avgRating: 0,
    coursesRated: 0
  });

  // Use the custom hook for API calls
  const { callApi: fetchFeedbacksApi, loading: feedbacksLoading } = useApi();
  const { callApi: fetchCoursesApi, loading: coursesLoading } = useApi();

  const loading = feedbacksLoading || coursesLoading;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = () => {
    // Fetch feedbacks
    fetchFeedbacksApi(
      () => feedbackApi.getMyFeedback(currentPage, 5),
      (data) => {
        setFeedbacks(data.feedbacks);
        setTotalPages(data.totalPages);
        
        // Calculate stats
        const totalFeedbacks = data.feedbacks.length;
        const avgRating = totalFeedbacks > 0 
          ? data.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / totalFeedbacks 
          : 0;
        const coursesRated = new Set(data.feedbacks.map(fb => fb.course._id)).size;
        
        setStats({
          totalFeedbacks,
          avgRating: avgRating.toFixed(1),
          coursesRated
        });
      },
      (err) => {
        if (err.response?.status !== 403) {
          toast.error('Failed to load feedbacks');
        }
      }
    );

    // Fetch courses
    fetchCoursesApi(
      () => coursesApi.getAll(),
      (data) => setCourses(data),
      (err) => {
        if (err.response?.status !== 403) {
          toast.error('Failed to load courses');
        }
      }
    );
  };

  const handleDeleteFeedback = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await feedbackApi.delete(id);
      setFeedbacks(feedbacks.filter(fb => fb._id !== id));
      toast.success('Feedback deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      if (error.response?.status !== 403) {
        toast.error('Failed to delete feedback');
      }
    }
  };

  const handleEditFeedback = async (id, updatedData) => {
    try {
      const response = await feedbackApi.update(id, updatedData);
      setFeedbacks(feedbacks.map(fb => 
        fb._id === id ? response.data : fb
      ));
      toast.success('Feedback updated successfully');
    } catch (error) {
      console.error('Error updating feedback:', error);
      if (error.response?.status !== 403) {
        toast.error('Failed to update feedback');
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 text-sm font-medium">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Welcome back, {user?.name}
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage your course feedback and track your submissions
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                    showForm 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white shadow-slate-600/25'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                  }`}
                >
                  {showForm ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Submit New Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Total Feedback
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {stats.totalFeedbacks}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Average Rating
                  </p>
                  <div className="flex items-center mt-2">
                    <p className="text-2xl font-semibold text-slate-900 mr-2">
                      {stats.avgRating}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(stats.avgRating) ? 'text-amber-400' : 'text-slate-200'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Courses Rated
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 mt-2">
                    {stats.coursesRated}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          {showForm && (
            <div className="mb-8">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                  <h3 className="text-lg font-medium text-slate-900">Submit New Feedback</h3>
                  <p className="text-sm text-slate-600 mt-1">Share your thoughts about a course</p>
                </div>
                <div className="p-6">
                  <FeedbackForm
                    courses={courses}
                    onSuccess={() => {
                      setShowForm(false);
                      fetchData();
                      toast.success('Feedback submitted successfully');
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Feedback List */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-slate-900">My Feedback</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    View and manage your course feedback submissions
                  </p>
                </div>
                {feedbacks.length > 0 && (
                  <div className="text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                    {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {feedbacks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No feedback yet</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                    Get started by submitting your first course feedback. Your input helps improve the learning experience for everyone.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Submit Your First Feedback
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {feedbacks.map((feedback) => (
                      <FeedbackItem
                        key={feedback._id}
                        feedback={feedback}
                        onDelete={handleDeleteFeedback}
                        onEdit={handleEditFeedback}
                      />
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        Showing page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}