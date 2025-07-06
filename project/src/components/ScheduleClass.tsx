import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Edit2, Trash2 } from 'lucide-react';
import type { ClassSchedule } from '../types';
import Loader from './Loader';

const ScheduleClass: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoad, updateLoad] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    type: 'lecture' as const,
    meetingLink: '',
  });

  const [classes, setClasses] = useState([
    {
      id: '1',
      title: 'Calculus - Derivatives Introduction',
      date: '2024-12-28',
      time: '10:00',
      duration: 90,
      type: 'lecture',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: '2', 
      title: 'Algebra - Problem Solving Session',
      date: '2024-12-29',
      time: '14:00',
      duration: 60,
      type: 'lab'
    },
    {
      id: '3',
      title: 'Geometry - Group Discussion',
      date: '2024-12-30',
      time: '11:00',
      duration: 45,
      type: 'discussion'
    }
  ]);
// console.log(classes)
  useEffect(() => {
    try {
      let a:any  = localStorage.getItem("userData");
      let b  = JSON.parse(a).sId;
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/getScheduledCls?batchId=${localStorage.getItem("batchId")}&sId=${b}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        console.log(dat)
        if(dat.status==200) {
          console.log("this is called")
          setClasses(dat.cls);
        }
        else {
          alert("Error!!");
        }
      })
    } catch(err) {
      alert("Error occured!!");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassSchedule = {
      id: editingClass?.id || Date.now().toString(),
      ...formData
    };
    
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? newClass : c));
      let clsId = localStorage.getItem("currentEdit");
      let myData = JSON.stringify(formData);
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/createClsSchedule?mainBody=${myData}&batchId=${localStorage.getItem("batchId")}&sId=${localStorage.getItem("sId")}&isUpdate=1&clsId=${clsId}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          // setClasses([...classes, newClass]);
          localStorage.removeItem("currentEdit")
        }
        else {
          console.log(dat);
          alert("Error!");

        }
      });
      setEditingClass(null);
    } else {
      let myData = JSON.stringify(formData);
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/createClsSchedule?mainBody=${myData}&batchId=${localStorage.getItem("batchId")}&sId=${localStorage.getItem("sId")}&isUpdate=0&clsId=no`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        if(dat.status==200) {
          setClasses([...classes, newClass]);
        }
        else {
          console.log(dat);
          alert("Error!");

        }
      });
    }

    setFormData({
      title: '',
      date: '',
      time: '',
      duration: 60,
      type: 'lecture',
      meetingLink: ''
    });
    setShowForm(false);
  };

  const handleEdit = () => {
    let classItem = JSON.parse(localStorage.getItem("currentEdit") || "{}")
    setEditingClass(classItem);
    let clsId:any = classItem.clsId
    localStorage.setItem("currentEdit", clsId);
    setFormData({
      title: classItem.title,
      date: classItem.date,
      time: classItem.time,
      duration: classItem.duration,
      type: classItem.type,
      meetingLink: classItem.meetingLink || ''
    });
    setShowForm(true);
  };

  const handleDelete = (clsItem:any) => {
    console.log(clsItem);
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/removeScheduleCls?adminId=${localStorage.getItem("sId")}&batchId=${localStorage.getItem("batchId")}&clsId=${clsItem.clsId}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setClasses(classes.filter(c => c.id !== clsItem.id));
      }
      else {
        console.log(dat);
      }
    })
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-purple-100 text-purple-800';
      case 'discussion': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if(isLoad) {
    return (<Loader />);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Schedule Classes</h1>
          <p className="text-xl text-gray-900/80 font-medium mt-2">
            Manage and schedule classes for your batch
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Schedule New Class</span>
        </button>
      </div>

      {/* Class Form */}
      {showForm && (
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {editingClass ? 'Edit Class' : 'Schedule New Class'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Class Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                  placeholder="Enter class title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Class Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                >
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab Session</option>
                  <option value="discussion">Discussion</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="15"
                  max="300"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 border border-blue-800/20 rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
                  placeholder="https://meet.google.com/..."
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-8 py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40"
              >
                {editingClass ? 'Update Class' : 'Schedule Class'}
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("currentEdit");
                  setShowForm(false);
                  setEditingClass(null);
                  setFormData({
                    title: '',
                    date: '',
                    time: '',
                    duration: 60,
                    type: 'lecture',
                    meetingLink: ''
                  });
                }}
                className="px-8 py-4 border-2 border-blue-800 text-blue-800 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scheduled Classes */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <Calendar className="text-blue-800" size={28} />
          <span>Scheduled Classes</span>
        </h2>
        
        {classes.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-xl text-gray-900/60">No classes scheduled yet</p>
            <p className="text-gray-900/40 mt-2">Schedule your first class to get started</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {classes.map((classItem) => (
              <div key={classItem.id} className="bg-white/50 border border-gray-900/10 rounded-2xl hover:border-blue-800/30 hover:bg-blue-300/10 transition-all duration-300 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{classItem.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(classItem.type)}`}>
                        {classItem.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center space-x-6 text-gray-900/70">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(classItem.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{classItem.time} ({classItem.duration} min)</span>
                      </div>
                      {classItem.meetingLink && (
                        <div className="flex items-center space-x-2">
                          <Video size={16} />
                          <a 
                            href={classItem.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-800 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {localStorage.setItem("currentEdit", JSON.stringify(classItem));handleEdit()}}
                      className="p-2 text-blue-800 hover:bg-blue-800/10 rounded-lg transition-all duration-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default ScheduleClass;