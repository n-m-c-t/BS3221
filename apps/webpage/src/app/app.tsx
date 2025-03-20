import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './screens/login/login';
import Home from './screens/home/home';
import Settings from './screens/settings/settings';
import Users from "./screens/users/users";
import Submission from "./screens/submission/submission";
import SideNav from "./layouts/sidenav";
import Error from "./screens/error/error";

export function App() {
  return (
    // FIX ROUTES TO HAVE PROTECTED ROUTES (minus login / error / unathorised)
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<SideNav><Login /></SideNav>} />
        <Route path="/home" element={<SideNav><Home /></SideNav>} />
        <Route path="/submission" element={<SideNav><Submission /></SideNav>} />
        <Route path="/users" element={<SideNav><Users /></SideNav>} />
        <Route path="/settings" element={<SideNav><Settings /></SideNav>} />
        <Route path="*" element={<Error />} />
      </Routes>
  );
}

export default App;
