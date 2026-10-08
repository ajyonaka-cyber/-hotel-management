
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        setLoggedIn(true);
        setPage("dashboard");
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      alert("Failed to connect to backend");
      console.error(error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPage("dashboard");
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div>
        <h1>Hotel Management System</h1>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              name="username"
              required
            />
          </div>

          <br />

          <div>
            <label>Password: </label>
            <input
              type="password"
              name="password"
              required
            />
          </div>

          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // ROOMS PAGE
  if (page === "rooms") {
    return (
      <div>
        <h1>Hotel Management System</h1>

        <h2>Manage Rooms</h2>

        <p>Room management section</p>

        <hr />

        <h3>Room Management</h3>

        <button>Add Room</button>

        <button>View Rooms</button>

        <button>Update Room</button>

        <button>Delete Room</button>

        <br />
        <br />

        <button onClick={() => setPage("dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div>
      <h1>Hotel Management System</h1>

      <h2>Dashboard</h2>

      <p>Welcome to the Hotel Management System!</p>

      <hr />

      <h3>Hotel Management</h3>

      <button onClick={() => setPage("rooms")}>
        Manage Rooms
      </button>

      <button>
        Manage Customers
      </button>

      <button>
        Manage Bookings
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
