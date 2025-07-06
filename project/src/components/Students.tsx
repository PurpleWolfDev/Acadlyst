import React, { useEffect, useState } from 'react';
import { Users, MessageCircle, UserMinus, Search, Filter, User, Mail, Calendar, LucideDownloadCloud, Phone } from 'lucide-react';
import type { Student } from '../types';
import Loader from './Loader';

const Students: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoad, updateLoad] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showRemoveModal, setShowRemoveModal] = useState<Student | null>(null);

  const [students, setStudents] = useState<Student[]>([
    {
      sId: "1",
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      pfp: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      phone: 9999999999,
      enrollmentTime: 345346,
      chatId:'ff'
    }]);
  useEffect(() => {
    try {
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/loadBatchStudents?batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        console.log(dat)
        if(dat.status==200) {
          setStudents(dat.data);
        }
      });
    } catch(err) {
      alert("Error!!");
    }
  }, []);
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleRemoveStudent = (sId: string, name: string) => {
    updateLoad(true);
    fetch(`https://homebackend-3y7i.onrender.com/removeStudent?sId=${sId}&batchId=${localStorage.getItem("batchId")}&adminId=${localStorage.getItem("sId")}&name=${name}`)
    .then(res => res.json())
    .then(dat => {
      updateLoad(false);
      if(dat.status==200) {
        setStudents(students.filter(s => s.sId !== sId));
        setShowRemoveModal(null);
      }
      else {
        alert("Error!!");
      }
    });
  };

  const handleChat = (student: Student) => {
    // This would integrate with a chat system
    alert(`Opening chat with ${student.name}`);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // const activeStudents = students.filter(s => s.status === 'active').length;
  // const inactiveStudents = students.filter(s => s.status === 'inactive').length;
if(isLoad) {
    return (<Loader />);
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">Manage Students</h1>
        <p className="text-lg sm:text-xl text-gray-900/80 font-medium mt-2">
          View and manage students in your batch
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900/60 font-medium">Total Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{students.length}</p>
            </div>
            {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3">
              <Users className="text-white" size={20} sm:size={24} />
            </div> */}
          </div>
        </div>
       {/* <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6">
           <div className="flex items-center justify-between">
            {/* <div>
              <p className="text-sm text-gray-900/60 font-medium">Active Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{activeStudents}</p>
            </div> 
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3">
              <User className="text-white" size={20} sm:size={24} />
            </div> 
          </div> 
        </div>*/}
        {/* <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            {/* <div>
              <p className="text-sm text-gray-900/60 font-medium">Inactive Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{inactiveStudents}</p>
            </div> */}
            {/*<div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-3">
              <User className="text-white" size={20} sm:size={24} />
            </div>
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} sm:size={20} />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
            />
          </div>
          {/* <div className="flex items-center space-x-3">
            <Filter className="text-gray-600" size={18} sm:size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border border-blue-800/20 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all duration-300"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-800/10 p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center space-x-3">
          <Users className="text-blue-800" size={24} sm:size={28} />
          <span>Students ({filteredStudents.length})</span>
        </h2>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={40} sm:size={48} />
            <p className="text-lg sm:text-xl text-gray-900/60">
              {searchTerm || statusFilter !== 'all' ? 'No students found' : 'No students enrolled yet'}
            </p>
            <p className="text-gray-900/40 mt-2">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Students will appear here once they enroll'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredStudents.map((student) => (
              <div key={student.sId} className="bg-white/50 border border-gray-900/10 rounded-xl sm:rounded-2xl hover:border-blue-800/30 hover:bg-blue-300/10 transition-all duration-300 p-4 sm:p-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <img
                      src={student.pfp=="sample"?'https://images.steamusercontent.com/ugc/2264814781684993160/A0F24791025DF8AA866CD2FF33FEE4AF464CE094/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false':student.pfp}
                      alt={student.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{student.name}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-900/70">
                          <Mail size={12} sm:size={14} />
                          <span className="text-xs sm:text-sm">{student.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-900/70">
                          <Calendar size={12} sm:size={14} />
                          <span className="text-xs sm:text-sm">
                            Enrolled: {`${new Date(student.enrollmentTime).getDate()}-${new Date(student.enrollmentTime).getMonth()+1}-${new Date(student.enrollmentTime).getFullYear()}`}
                          </span>
                        </div>
                        {/* <div className="flex items-center space-x-2 text-gray-900/70">
                          <User size={12} sm:size={14} />
                          <span className="text-xs sm:text-sm">
                            Last active: {new Date(student.lastActive).toLocaleDateString()}
                          </span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* <span className={`px-3 py-1 rounded-full text-sm font-medium text-center ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span> */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {window.location.href = `tel:${student.phone}`}}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                      >
                        
                        <Phone size={14} sm:size={16} />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => setShowRemoveModal(student)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                      >
                        <UserMinus size={14} sm:size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove Student Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Remove Student</h3>
            <p className="text-gray-900/70 mb-6 text-sm sm:text-base">
              Are you sure you want to remove <strong>{showRemoveModal.name}</strong> from this batch? 
              This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => handleRemoveStudent(showRemoveModal.sId, showRemoveModal.name)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-red-700 transition-all duration-300"
              >
                Remove Student
              </button>
              <button
                onClick={() => setShowRemoveModal(null)}
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

export default Students;