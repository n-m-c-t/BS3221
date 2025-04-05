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
import { AuthContextProvider } from "./contexts/AuthContext";
import ProtectedRoute from './components/protectedRoute/protectedRoute';

export function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/error" element={<Error />} />
        <Route path="/unauthorised" element={<Unauthorised />} />

        {/* Wrap all protected routes here */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/submission" element={<Submission />} />
            {/* <Route path="/audit" element={<Audit />} /> */}
            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/audit" element={<Audit />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>


        <Route path="*" element={<Error />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
