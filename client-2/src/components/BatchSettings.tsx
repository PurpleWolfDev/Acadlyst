import React, { useEffect, useState } from 'react';
import { Settings, Save, Trash2, AlertTriangle, BookOpen, Users, Calendar } from 'lucide-react';
import type { BatchSettings } from '../types';
import Loader from './Loader';
import { Navigate } from 'react-router-dom';

const BatchSettingsComponent: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nav, updateNav] = useState(false);
  const [isLoad, updateLoad] = useState(false);
  const [settings, setSettings] = useState<BatchSettings>({
    name: 'Mathematics 12A',
    cls: 6,
    subject: 'Mathematics',
    studentNo: 24,
    timeOfCreation:324,
    scheduledCls:5
  });

  const [formData, setFormData] = useState(settings);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      updateLoad(true);
        fetch(`https://homebackend-3y7i.onrender.com/loadBatchSettings?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}`)
        .then(res => res.json())
        .then(dat => {
          updateLoad(false);
          if(dat.status==200) {
            setSettings(dat.data);
            setFormData(dat.data)
            console.log(dat.data)
          }
          else {
            alert("Error");
          }
        });
    } catch(err) {
      alert("Error!");
    }
 }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/updateBatchSettings?mainBody=${JSON.stringify(formData)}&batchId=${localStorage.getItem('batchId')}&adminId=${localStorage.getItem("sId")}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setSettings(formData);
        setIsEditing(false);
      }
      else {
        alert("Error");
      }
    });
    // Here you would typically make an API call to save the settings
  };

  const handleDelete = () => {
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/deleteBatch?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setShowDeleteModal(false);
        window.location.href = `http://localhost:5173/dashboardv1`;
      }
      else {
        alert("Error!");
      }
    });
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };
if(isLoad) {
    return (<Loader />);
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Batch Settings</h1>
        <p className="text-lg sm:text-xl text-gray-900/80 font-medium mt-2">
          Manage your batch configuration and preferences
        </p>
      </div>

      {/* Batch Overview */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-800 to-purple-800 rounded-xl sm:rounded-2xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} sm:size={32} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{settings.name}</h2>
              <p className="text-gray-900/70 mt-1">{settings.cls} • {settings.subject}</p>
              <p className="text-sm text-gray-900/50 mt-2">
                Created on {`${new Date(settings.timeOfCreation).getDate()}-${new Date(settings.timeOfCreation).getMonth()+1}-${new Date(settings.timeOfCreation).getFullYear()}`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
            <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <Users className="mx-auto text-blue-800 mb-2" size={20} sm:size={24} />
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{settings.studentNo}</p>
              <p className="text-xs sm:text-sm text-gray-900/60">Students</p>
            </div>
            <div className="bg-white/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <Calendar className="mx-auto text-green-600 mb-2" size={20} sm:size={24} />
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {settings.scheduledCls}
              </p>
              <p className="text-xs sm:text-sm text-gray-900/60">Classes taken</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <Settings className="text-blue-800" size={24} sm:size={28} />
            <span>Batch Configuration</span>
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30"
            >
              Edit Settings
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Batch Name *
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-800/20 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isEditing 
                    ? 'bg-white/50 focus:ring-2 focus:ring-blue-800 focus:border-transparent' 
                    : 'bg-gray-50/50 text-gray-900/70 cursor-not-allowed'
                }`}
                placeholder="Enter batch name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Class *
              </label>
              <input
                type="number"
                required
                disabled={!isEditing}
                value={formData.cls}
                onChange={(e) => {if(Number(e.target.value)>12) {} else setFormData({ ...formData, cls: Number(e.target.value) })}}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-800/20 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isEditing 
                    ? 'bg-white/50 focus:ring-2 focus:ring-blue-800 focus:border-transparent' 
                    : 'bg-gray-50/50 text-gray-900/70 cursor-not-allowed'
                }`}
                placeholder="Enter class level"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subject *
            </label>
            <input
              type="text"
              required
              disabled={!isEditing}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-800/20 rounded-lg sm:rounded-xl transition-all duration-300 ${
                isEditing 
                  ? 'bg-white/50 focus:ring-2 focus:ring-blue-800 focus:border-transparent' 
                  : 'bg-gray-50/50 text-gray-900/70 cursor-not-allowed'
              }`}
              placeholder="Enter subject name"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              disabled={!isEditing}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-800/20 rounded-lg sm:rounded-xl resize-none transition-all duration-300 ${
                isEditing 
                  ? 'bg-white/50 focus:ring-2 focus:ring-blue-800 focus:border-transparent' 
                  : 'bg-gray-50/50 text-gray-900/70 cursor-not-allowed'
              }`}
              placeholder="Enter batch description"
            />
          </div> */}

          {isEditing && (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 flex items-center justify-center space-x-2"
              >
                <Save size={18} sm:size={20} />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-800 text-blue-800 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/70 backdrop-blur-lg border-2 border-red-200/50 rounded-2xl sm:rounded-3xl shadow-xl shadow-red-800/10 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-4 flex items-center space-x-3">
          <AlertTriangle className="text-red-600" size={24} sm:size={28} />
          <span>Danger Zone</span>
        </h2>
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">Delete This Batch</h3>
            <p className="text-red-700 text-sm sm:text-base">
              Once you delete a batch, there is no going back. This will permanently delete the batch, 
              all associated data, assignments, and remove all students.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            <Trash2 size={18} sm:size={20} />
            <span>Delete Batch</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={24} sm:size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Delete Batch</h3>
              <p className="text-gray-900/70 mb-6 text-sm sm:text-base">
                Are you sure you want to delete <strong>{settings.name}</strong>? 
                This action cannot be undone and will permanently remove all batch data, 
                assignments, and student records.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-red-700 transition-all duration-300"
              >
                Yes, Delete Batch
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchSettingsComponent;