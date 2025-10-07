import { useState } from 'react'

function Home() {
  const [token, setToken] = useState('')

  const testLogin = async () => {
    const response = await fetch('http://localhost:5555/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'storres',
        password: 'password123'
      })
    })
    const data = await response.json()
    setToken(data.access_token)
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Home</h1>
      <button onClick={testLogin}>Test Login</button>
      {token && <p>Token: {token.slice(0, 30)}...</p>}
    </div>
  )
}

export default Home