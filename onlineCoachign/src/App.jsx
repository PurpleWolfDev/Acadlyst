import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./App.css";
import {Login} from './Login.jsx';
import { Home } from "./Home.jsx";
import { ForgotPassword } from "./ForgotPass.jsx";
import { TeacherDashboard } from "./TeacherDashboard.jsx";
import { TeacherSettings } from "./TeacherSettings.jsx";
import { JoinBatchLanding } from "./JoinBatchLanding.jsx";
import { StudentDashboard } from "./StudentDashboard.jsx";
import { StudentSettings } from "./StudentSettings.jsx";
import { StudentBatch } from "./StudentBatch.jsx";
// import { Chat } from "./Chat.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/dashboardv1" element={<TeacherDashboard />} />
            <Route path="/dashboardv2" element={<StudentDashboard />} />
            <Route path="/settingsv1" element={<TeacherSettings />} />
            <Route path="/settingsv2" element={<StudentSettings />} />
            <Route path="/batchJoin" element={<JoinBatchLanding />} />
            <Route path="/batch" element={<StudentBatch />} />
            {/* <Route path="/chatv1" element={<Chat />} /> */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;