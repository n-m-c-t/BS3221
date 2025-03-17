import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './screens/login/login';
import Home from './screens/home/home';
import Settings from './screens/settings/settings';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      {/* <Route path="/register" element={<Register />} /> */}
    </Routes>
    
  );
}

export default App;
