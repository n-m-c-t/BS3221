import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from "../../../assets/logo.png";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = { email, password };
    login(user.email, user.password)
      .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.error('Error:', error);
        // setError('Invalid email or password');
      });
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