import React, {useState, useEffect} from 'react';
import { Calendar, Users, FileText, Clock, TrendingUp, BookOpen, Loader } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [isLoad, updateLoad] = useState(false);
  const [stats, updateStats] = useState([{ icon: Users, label: 'Total Students', value: '24', color: 'from-blue-500 to-blue-600' },
    { icon: FileText, label: 'Active Assignments', value: '3', color: 'from-purple-500 to-purple-600' },
    // { icon: Calendar, label: 'Classes This Week', value: '5', color: 'from-green-500 to-green-600' },
    { icon: Clock, label: 'Pending Submissions', value: '8', color: 'from-orange-500 to-orange-600' },]);


    const [recentActivities, updateActivities] = useState([{type: 'submission', headerName: 'Alice Johnson', title: 'submitted Assignment 3', timeOfCreation: 230974 }]);

    const [upcomingClasses, updateClass] = useState([{ id: 1, title: 'Calculus - Derivatives', date: 'Tomorrow', time: '10:00 AM', type: 'lecture' },
    { id: 2, title: 'Algebra - Practice Session', date: 'Dec 28', time: '2:00 PM', type: 'lab' },
    { id: 3, title: 'Geometry - Discussion', date: 'Dec 30', time: '11:00 AM', type: 'discussion' }]);

    const [batchName, updateName] = useState("");
    

  useEffect(() => {
    try {
      // console.log(`BRUHs`)
      updateLoad(true);
      fetch(`https://homebackend-3y7i.onrender.com/loadBatchHome?bId=${localStorage.getItem("batchId")}&sId=${localStorage.getItem("sId")}`)
      .then(res => res.json())
      .then(dat => {
        updateLoad(false);
        console.log(dat)
        if(dat.status==200) {
          localStorage.setItem("inviteLink", dat.data.inviteLink)
          updateStats([
            { icon: Users, label: 'Total Students', value: dat.data.totalStd, color: 'from-blue-500 to-blue-600' },
      { icon: FileText, label: 'Active Assignments', value: dat.data.activeAssign, color: 'from-purple-500 to-purple-600' },
    // { icon: Calendar, label: 'Classes This Week', value: '5', color: 'from-green-500 to-green-600' },
      { icon: Clock, label: 'Pending Submissions', value: dat.data.pendingAssign, color: 'from-orange-500 to-orange-600' },
          ]);
          updateActivities(dat.data.activities);
          updateClass(dat.data.cls);
          updateName(dat.data.batchName);
        }
        else {
          alert("Error Occured!!");
        }
      });
    } catch(err) {

    }
  }, []);
function getTimeAgo(timestamp:number) {
  const now = Date.now();
  const diffMs = now - timestamp;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 60 * 60 * 1000) {
    return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffMs < 24 * 60 * 60 * 1000) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}
if(isLoad) {
    return (<Loader />);
  }
  return (<>
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-900/80 font-medium">
              Here's what's happening with your '{batchName}' batch today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-full p-4">
              <BookOpen className="text-white" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900/60 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activities</h2>
            <TrendingUp className="text-blue-800" size={24} />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-xl hover:bg-blue-300/10 transition-all duration-300">
                <div className="w-2 h-2 bg-blue-800 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    <span className="text-blue-800">{activity.headerName}</span> {activity.title}
                  </p>
                  <p className="text-sm text-gray-900/60 mt-1">{getTimeAgo(activity.timeOfCreation)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white/70 backdrop-blur-lg border-2 border-blue-800/20 rounded-3xl shadow-xl shadow-blue-800/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Classes</h2>
            <Calendar className="text-blue-800" size={24} />
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="p-4 bg-white/50 rounded-xl hover:bg-blue-300/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{class_.title}</h3>
                    <p className="text-sm text-gray-900/60 mt-1">
                      {class_.date} at {class_.time}
                    </p>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${class_.type === 'lecture' ? 'bg-blue-100 text-blue-800' : ''}
                    ${class_.type === 'lab' ? 'bg-purple-100 text-purple-800' : ''}
                    ${class_.type === 'discussion' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {class_.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div></>
  );
};

export default Dashboard;