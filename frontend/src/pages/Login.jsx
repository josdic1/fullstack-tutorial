import { useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
    console.log(result)
  }

  const setUserLogin = () => {
    setUsername('josh');
    setPassword('pass');
    setLoginType('user');
  }

  const setAdminLogin = () => {
    setUsername('admin');
    setPassword('pass');
    setLoginType('admin');
  }

  return (
    <>
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        {/* Clean Toggle Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '0',
          marginBottom: '24px',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          overflow: 'hidden',
          width: 'fit-content'
        }}>
          <button
            type='button'
            onClick={setUserLogin}
            style={{
              padding: '10px 24px',
              backgroundColor: loginType === 'user' ? '#007bff' : 'white',
              color: loginType === 'user' ? 'white' : '#495057',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
              borderRight: '1px solid #dee2e6'
            }}
          >
            User Login
          </button>
          <button
            type='button'
            onClick={setAdminLogin}
            style={{
              padding: '10px 24px',
              backgroundColor: loginType === 'admin' ? '#007bff' : 'white',
              color: loginType === 'admin' ? 'white' : '#495057',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Admin Login
          </button>
        </div>

        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            Login
          </button>
        </form>
      </div>
    </>
  )
}

export default Login;