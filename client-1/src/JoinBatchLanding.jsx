import React, { useState, useEffect } from 'react';
import { Users, BookOpen, X, Check, ArrowRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Loader from './Loader';

export const JoinBatchLanding = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isLoad, updateLoad] = useState(false);
  const [redirHome, updateHome] = useState(false);
  const [searchParams] = useSearchParams();
  const [loginRedir, updateLogin] = useState(false);
  const [batchInfo, updateInfo] = useState({
    name:'',
    cls:'',
    subject:'',
    teacherName:'',
    students:0
  })

  // Sample batch data
  const batchData = {
    name: "Mathematics Advanced - Class 10",
    teacher: "Prof. Sarah Johnson",
    subject: "Mathematics",
    class: "Class 10A",
    students: 24,
    description: "Advanced mathematics covering algebra, geometry, and trigonometry with practical problem-solving techniques."
  };

  const handleJoinBatch = () => {
    setIsJoining(true);
   
      let userData = JSON.parse(localStorage.getItem("userData"));
      console.log('Joined batch successfully!');
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/acceptBatchInvite?token=${userData.token}&inviteId=${searchParams.get('inviteId')}&phone=${userData.phone}&email=${userData.email}&name=${userData.name}&sId=${userData.sId}&chatId=${userData.chatId}&pfp=${userData.pfp}&bId=${batchInfo.bId}`)
      .then(res => res.json())
      .then((dat) => {
        updateLoad(false);
        console.log(dat)
        if(dat.status==200) { 
          setIsJoining(false);
          alert("Successfully Joined!");
          updateLogin(true)
        }
        else if(dat.status==400) {
          alert("Failed to verify!");
          setIsJoining(false);

        }
        else {
          alert("Some internal error occured!");
          setIsJoining(false);
        }
      })
      // Redirect to dashboard or batch page
    
  };

  const handleCancel = () => {
    console.log('User cancelled batch join');
    // Redirect back or close
    updateHome(true);
  };

  useEffect(() => {
    try {
        let userData = JSON.parse(localStorage.getItem("userData"));
        if(userData.role=="student") {
            let inviteId = searchParams.get('inviteId');
            updateLoad(true);
            let url = `https://homebackend-3y7i.onrender.com/getInviteInfo?inviteId=${inviteId}&token=${userData.token}`;
            fetch(url)
            .then(res => res.json())
            .then(dat => {
              updateLoad(true);
                if(dat.status == 200) {
                    updateInfo(dat.data);
                    console.log(dat.data)
                }
                else {
                    alert("Wrong Invitation Link!")
                }
            });
        } else if(userData.role=="teacher") {
            alert("C'MON you're the teacher");
            updateLogin(true);
        }

    } catch(err) {
        localStorage.clear();
        updateLogin(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-18 bg-[#231F20] rounded-lg mx-auto mb-6"></div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Join Batch
          </h1>
          <p className="text-xl text-gray-900/80 font-medium">
            You've been invited to join a learning batch
          </p>
        </div>

        {/* Batch Information Card */}
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-8 mb-8">
          {loginRedir?<Navigate to="/login" />:null}
          {/* Batch Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-300/20 border-2 border-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-blue-800" size={32} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {batchInfo.name}
            </h2>
            <p className="text-base text-gray-900/70">
              by {batchInfo.adminName}
            </p>
          </div>
          {isLoad?<Loader />:null}
          {/* Batch Details */}
          <div className="space-y-6">
            
            {/* Subject & Class */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="text-blue-800" size={20} />
                  <span className="text-xl font-semibold text-gray-900">Subject</span>
                </div>
                <p className="text-base text-gray-900/70 font-medium">{batchInfo.subject}</p>
              </div>
              
              <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-800" size={20} />
                  <span className="text-xl font-semibold text-gray-900">Class</span>
                </div>
                <p className="text-base text-gray-900/70 font-medium">{batchInfo.cls}</p>
              </div>
            </div>

            {/* Students Count */}
            <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-blue-800" size={20} />
                <span className="text-xl font-semibold text-gray-900">Current Students</span>
              </div>
              <p className="text-base text-gray-900/70 font-medium">{batchInfo.students} students enrolled</p>
            </div>

            {/* Description */}
            {/* <div className="bg-white/50 border border-gray-900/10 rounded-2xl p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Batch</h3>
              <p className="text-base text-gray-900/70 leading-relaxed">{batchData.}</p>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
          {/* Join Button */}
          <button
            onClick={handleJoinBatch}
            disabled={isJoining}
            className="px-8 py-4 bg-blue-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-blue-800/40 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[200px]"
          >
            {isJoining ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Joining...
              </>
            ) : (
              <>
                <Check size={20} />
                Join Batch
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => setShowCancelConfirm(true)}
            disabled={isJoining}
            className="px-8 py-4 border-2 border-blue-800 text-blue-800 rounded-full font-semibold hover:bg-blue-800 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-800/30 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 min-w-[200px]"
          >
            <X size={20} />
            Cancel
          </button>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl max-w-md w-full p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Cancel Batch Join
                </h3>
                <p className="text-base text-gray-900/70 mb-8">
                  Are you sure you want to cancel joining this batch? You can always join later if the batch is still available.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
                  >
                    Stay
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300"
                  >
                    Cancel Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      {redirHome?<Navigate to="/" />:null}
    </div>
  );
};

