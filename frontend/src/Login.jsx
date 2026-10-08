import { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            if (!response.ok) {
                throw new Error('Invalid username or password')
            }

            const token = await response.text()

            localStorage.setItem('token', token)

            alert('Login successful!')
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <div className="login-container">
            <h1>Hotel Management System</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login