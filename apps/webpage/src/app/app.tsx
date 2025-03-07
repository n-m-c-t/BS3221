import { Route, Routes } from 'react-router-dom';
import Login from './screens/login/login';
import Home from './screens/home/home';

export function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
    </Routes>
    
  );
}

export default App;
