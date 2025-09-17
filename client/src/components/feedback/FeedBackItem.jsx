'use client';

import { useState } from 'react';

export default function FeedbackItem({ feedback, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    rating: feedback.rating,
    message: feedback.message || ''
  });

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const handleSave = () => {
    onEdit(feedback._id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      rating: feedback.rating,
      message: feedback.message || ''
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <h4 className="font-semibold text-lg mb-3">
          {feedback.course.title} ({feedback.course.code})
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5)
            </label>
            <select
              value={editData.rating}
              onChange={(e) => setEditData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 ⭐ (Excellent)</option>
              <option value={4}>4 ⭐ (Very Good)</option>
              <option value={3}>3 ⭐ (Good)</option>
              <option value={2}>2 ⭐ (Fair)</option>
              <option value={1}>1 ⭐ (Poor)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Message
            </label>
            <textarea
              value={editData.message}
              onChange={(e) => setEditData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts about the course..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">
            {feedback.course.title} ({feedback.course.code})
          </h4>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500 text-lg mr-2">
              {renderStars(feedback.rating)}
            </span>
            <span className="text-gray-600">({feedback.rating}/5)</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </span>
      </div>

      {feedback.message && (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">
          {feedback.message}
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(feedback._id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}