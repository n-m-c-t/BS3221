// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './screens/login/login';
import Home from './screens/home/home';
import Settings from './screens/settings/settings';
import Users from "./screens/users/users";
import Submission from "./screens/submission/submission";
import Error from "./screens/error/error";
import Layout from './layouts/layout/layout';
import Unauthorised from './screens/unauthorised/unauthorised'
import Audit from "./screens/audit/audit";

export function App() {
  return (
    <Routes>
      {/* Redirect root to login page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Routes that do not need the sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/unauthorised" element={<Unauthorised />} />
      
      {/* Protected routes that need the sidebar */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all route for errors */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;
