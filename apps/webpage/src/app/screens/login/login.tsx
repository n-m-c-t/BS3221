import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication logic
    if (email === 'admin@example.com' && password === 'password') {
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen">
        <div className="login-box">
          <h2 className="title">Sign in</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                type="email" 
                value={email} 
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="password"
                value={password} 
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="button">
              Submit  
            </button>
          </form>
        </div>
    </div>
  );
}

export default Login;