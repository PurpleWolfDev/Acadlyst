// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import {Batch} from './Batch.jsx';
// import {TeacherHome} from './TeacherHome.jsx';
// import {TeacherSettings} from './TeacherSettings.jsx';
// function App() {

//   return(
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<TeacherHome />} />
//           <Route path="/settings" element={<TeacherSettings />} />
//           <Route path="/batchView" element={<Batch />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );

// }

// export default App;
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleClass from './components/ScheduleClass';
import Notices from './components/Notices';
import Assignments from './components/Assignments';
import Students from './components/Students';
import { Calendar, Users, FileText, Clock, TrendingUp, BookOpen } from 'lucide-react';
import BatchSettings from './components/BatchSettings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [load, updateLoad] = useState(true);
   const [valid, setValid] = useState("null");
  const [session, setSession] = useState("null");

  


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    
  }, []);


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'schedule':
        return <ScheduleClass />;
      case 'notices':
        return <Notices />;
      case 'assignments':
        return <Assignments />;
      case 'students':
        return <Students />;
      case 'settings':
        return <BatchSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-green-100 to-blue-800">
      {load?
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          toggleMobile={toggleMobileMenu}
        />
        
        <main className="flex-1 lg:ml-0 max-w-[100%]">
          <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-[100%] overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>:null}
    </div>
  );
}

export default App;