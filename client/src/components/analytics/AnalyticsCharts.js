
'use client';

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

// Register ChartJS components
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

export default function AnalyticsCharts({ feedbackStats, timeRange }) {
  // Prepare data for charts
  const courseNames = feedbackStats.map(stat => stat.courseName);
  const averageRatings = feedbackStats.map(stat => stat.avgRating);
  const feedbackCounts = feedbackStats.map(stat => stat.feedbackCount);

  // Doughnut Chart Data (Feedback Distribution)
  const doughnutData = {
    labels: courseNames,
    datasets: [
      {
        data: feedbackCounts,
        backgroundColor: [
          '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B',
          '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  // Bar Chart Data (Average Ratings)
  const barData = {
    labels: courseNames,
    datasets: [
      {
        label: 'Average Rating',
        data: averageRatings,
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data (Mock data for feedback over time)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Feedback Submissions',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 42, 38, 45, 50],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Doughnut Chart - Feedback Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Feedback Distribution</h3>
        <div className="h-80">
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>

      {/* Bar Chart - Average Ratings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Average Ratings by Course</h3>
        <div className="h-80">
          <Bar data={barData} options={{
            ...chartOptions,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }} />
        </div>
      </div>

      {/* Line Chart - Feedback Trend */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h3 className="text-xl font-semibold mb-4">Feedback Trends ({timeRange})</h3>
        <div className="h-96">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}