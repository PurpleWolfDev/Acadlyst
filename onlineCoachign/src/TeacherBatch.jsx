import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleClass from './components/ScheduleClass';
import Notices from './components/Notices';
import Assignments from './components/Assignments';
import Students from './components/Students';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Users, FileText, Clock, TrendingUp, BookOpen } from 'lucide-react';
import BatchSettings from './components/BatchSettings';

export function TeacherBatch() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [load, updateLoad] = useState(false);
  const [test] = useSearchParams();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    try {
      let teacherId = test.get("valid");
    } catch(err) {

    }
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
        
        <main className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8 pt-20 lg:pt-8">
            {renderContent()}
          </div>
        </main>
      </div>:null}
    </div>
  );
}

