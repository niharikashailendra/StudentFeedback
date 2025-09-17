'use client';

import { useState, useEffect } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { adminApi } from '@/lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function EnhancedAnalyticsCharts({ feedbackStats, timeRange }) {
  const [trendData, setTrendData] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, [timeRange]);

  const fetchRealData = async () => {
    try {
      const daysMap = { '7days': 7, '30days': 30, '90days': 90 };
      const days = daysMap[timeRange] || 30;
      
      const [trendRes, distributionRes] = await Promise.all([
        adminApi.getFeedbackTrend(days),
        adminApi.getRatingDistribution()
      ]);

      setTrendData(trendRes.data);
      setRatingDistribution(distributionRes.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare real data for charts
  const courseNames = feedbackStats.map(stat => stat.courseName);
  const averageRatings = feedbackStats.map(stat => stat.avgRating);
  const feedbackCounts = feedbackStats.map(stat => stat.feedbackCount);

  // Rating Distribution Data
  const ratingDistData = {
    labels: ratingDistribution.map(item => `${item._id} ⭐`),
    datasets: [
      {
        data: ratingDistribution.map(item => item.count),
        backgroundColor: ['#EF4444', '#F59E0B', '#84CC16', '#3B82F6', '#8B5CF6'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  // Feedback Trend Data
  const trendChartData = {
    labels: trendData.map(item => item._id.date),
    datasets: [
      {
        label: 'Daily Feedback Count',
        data: trendData.map(item => item.count),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Rating',
        data: trendData.map(item => item.avgRating),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Rating Distribution</h3>
        <div className="h-80">
          <Doughnut 
            data={ratingDistData} 
            options={chartOptions} 
          />
        </div>
      </div>

      {/* Feedback Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Feedback Trend</h3>
        <div className="h-80">
          <Line 
            data={trendChartData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Feedback Count'
                  }
                },
                y1: {
                  beginAtZero: true,
                  max: 5,
                  position: 'right',
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                    text: 'Average Rating'
                  }
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}