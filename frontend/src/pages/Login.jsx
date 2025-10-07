import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

function Login() {
  const { user, login, logout } = useContext(AuthContext);

  const handleLogin = () => {

  };

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Please log in</h2>
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  )
}  

export default Login