import React, { useEffect, useState } from 'react';
import { Bell, Plus, Edit2, Trash2, AlertCircle, Info, CheckCircle } from 'lucide-react';
import type { Notice } from '../types';
import Loader from './Loader';

const Notices: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoad, updateLoad] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as const
  });

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: 'Assignment 3 Due Tomorrow',
      description: 'Please submit your calculus assignment by 11:59 PM tomorrow. Late submissions will be penalized.',
      priority: 'high',
      createdDate: '2024-12-26',
    },
    {
      id: 2,
      title: 'Class Timing Change',
      description: 'Tomorrow\'s class has been moved from 10:00 AM to 2:00 PM due to a scheduling conflict.',
      priority: 'medium',
      createdDate: '2024-12-25',
    },
    {
      id: 3,
      title: 'New Study Material Available',
      description: 'I\'ve uploaded additional practice problems for the upcoming exam. Check the resources section.',
      priority: 'low',
      createdDate: '2024-12-24',
    }
  ]);

  useEffect(() => {
    try {
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/getBatchNotices?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200 ) {
          setNotices(dat.data);
        }
        else {alert("ERROR");console.log(dat)}
      });
      
    } catch(err) {
      alert("Some Error Occured!");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: editingNotice?.id || Date.now(),
      ...formData,
      createdDate: new Date().toISOString().split('T')[0],
    };
    // console.log(newNotice)

    if (editingNotice) {
      setNotices(notices.map(n => n.id === editingNotice.id ? { ...newNotice } : n));
      setEditingNotice(null);
    } else {
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/addNotifs?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}&mainBody=${JSON.stringify(newNotice)}`)
      .then(res => res.json()) 
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          // setNotices(dat.data);
          setNotices([newNotice, ...notices]);
        }
        else {
          console.log(dat)
          alert("Error")
        }
      });
    }

    setFormData({
      title: '',
      description: '',
      priority: 'medium'
    });
    setShowForm(false);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      priority: notice.priority
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    console.log(id);
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/deleteNotif?adminId=${localStorage.getItem("sId")}&batchId=${localStorage.getItem("batchId")}&id=${id}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setNotices(notices.filter(n => n.id !== id));
      } else {
        console.log(dat);
        alert("Error Occured!!");
      }
    });
  };


  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="text-red-600" size={18} />;
      case 'medium': return <Info className="text-orange-600" size={18} />;
      case 'low': return <CheckCircle className="text-green-600" size={18} />;
      default: return <Info className="text-gray-600" size={18} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
if(isLoad) {
    return (<Loader />);
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Notices</h1>
          <p className="text-lg sm:text-xl text-gray-900/80 font-medium mt-2">
            Create and manage notices for your students
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Notice</span>
        </button>
      </div>

      {/* Notice Form */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            {editingNotice ? 'Edit Notice' : 'Create New Notice'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Notice Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                placeholder="Enter notice title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="Enter notice description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40"
              >
                {editingNotice ? 'Update Notice' : 'Publish Notice'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNotice(null);
                  setFormData({
                    title: '',
                    description: '',
                    priority: 'medium'
                  });
                }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-800 text-blue-800 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-3">
          <Bell className="text-blue-800" size={24} sm:size={28} />
          <span>Published Notices</span>
        </h2>
        
        {notices.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={40} sm:size={48} />
            <p className="text-lg sm:text-xl text-gray-900/60">No notices published yet</p>
            <p className="text-gray-900/40 mt-2">Create your first notice to keep students informed</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className={`
                bg-white/50 border rounded-xl sm:rounded-2xl hover:border-blue-800/30 hover:bg-blue-300/10 transition-all duration-300 p-4 sm:p-6
                ${true ? 'border-blue-800/30 bg-blue-300/5' : 'border-gray-900/10'}
              `}>
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(notice.priority)}
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{notice.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                          {notice.priority} priority
                        </span>
                        {/* {!notice.isRead && (
                          <span className="px-2 py-1 bg-blue-800 text-white text-xs rounded-full">
                            New
                          </span>
                        )} */}
                      </div>
                    </div>
                    <p className="text-gray-900/70 mb-3 leading-relaxed text-sm sm:text-base">{notice.description}</p>
                    <p className="text-xs sm:text-sm text-gray-900/50">
                      Published on {new Date(notice.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {/* <button
                      onClick={() => toggleRead(notice.id)}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        notice.isRead 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {notice.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button> */}
                    <div className="flex space-x-2">
                     {/* <button
                        onClick={() => handleEdit(notice)}
                        className="p-2 text-blue-800 hover:bg-blue-800/10 rounded-lg transition-all duration-300"
                      >
                        <Edit2 size={16} sm:size={18} />
                      </button> */}
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                      >
                        <Trash2 size={16} sm:size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;