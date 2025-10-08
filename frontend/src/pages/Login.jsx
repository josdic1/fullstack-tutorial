import { useState, useContext } from "react";
import { useNavigate} from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
  }

    const setAdminLogin = () => {
    setUsername('admin');
    setPassword('pass');
  }



return (
  <>
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <button type='button' onClick={setUserLogin}>User Login</button>
            <button type='button' onClick={setAdminLogin}>Admin Login</button>
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