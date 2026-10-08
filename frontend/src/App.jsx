import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function App() {
    const [token, setToken] = useState(localStorage.getItem("hotelToken"));
    const [role, setRole] = useState(localStorage.getItem("hotelRole"));
    const [username, setUsername] = useState("");

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [activePage, setActivePage] = useState("dashboard");

    const [rooms, setRooms] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [roomNumber, setRoomNumber] = useState("");
    const [roomType, setRoomType] = useState("");
    const [pricePerNight, setPricePerNight] = useState("");
    const [available, setAvailable] = useState(true);

    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    });

    // =========================
    // LOGIN
    // =========================

    const decodeToken = (jwt) => {
        try {
            return JSON.parse(atob(jwt.split(".")[1]));
        } catch (error) {
            console.error("Token decode error:", error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword
                })
            });

            const data = await response.text();

            if (!response.ok) {
                alert("Invalid username or password.");
                return;
            }

            localStorage.setItem("hotelToken", data);

            const payload = decodeToken(data);

            const userRole = payload?.role || "CUSTOMER";
            const userName = payload?.sub || loginUsername;

            localStorage.setItem("hotelRole", userRole);

            setToken(data);
            setRole(userRole);
            setUsername(userName);

            setLoginUsername("");
            setLoginPassword("");

            setActivePage("dashboard");

            alert("Login successful!");

        } catch (error) {
            console.error(error);
            alert("Failed to connect to server.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hotelToken");
        localStorage.removeItem("hotelRole");

        setToken(null);
        setRole(null);
        setUsername("");

        setRooms([]);
        setCustomers([]);
        setBookings([]);
    };

    // =========================
    // ROOMS
    // =========================

    const loadRooms = async () => {
        try {
            const response = await fetch(`${API}/rooms`, {
                headers: authHeaders()
            });

            if (!response.ok) {
                console.error("Failed to load rooms");
                return;
            }

            const data = await response.json();
            setRooms(data);

        } catch (error) {
            console.error("Room loading error:", error);
        }
    };

    const loadRoomsIfPossible = async () => {
        try {
            await loadRooms();
        } catch (error) {
            console.error(error);
        }
    };

    const addRoom = async (e) => {
        e.preventDefault();

        if (!roomNumber || !roomType || !pricePerNight) {
            alert("Please fill all room fields.");
            return;
        }

        try {
            const response = await fetch(`${API}/rooms`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    roomNumber: roomNumber,
                    roomType: roomType,
                    pricePerNight: Number(pricePerNight),
                    available: available
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to add room.");
                return;
            }

            alert("Room added successfully!");

            setRoomNumber("");
            setRoomType("");
            setPricePerNight("");
            setAvailable(true);

            await loadRooms();

        } catch (error) {
            console.error(error);
            alert("Failed to add room.");
        }
    };

    const deleteRoom = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/rooms/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (!response.ok) {
                alert("Failed to delete room.");
                return;
            }

            alert("Room deleted successfully!");
            await loadRooms();

        } catch (error) {
            console.error(error);
            alert("Failed to delete room.");
        }
    };

    const toggleRoomAvailability = async (room) => {
        try {
            const response = await fetch(`${API}/rooms/${room.id}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    roomNumber: room.roomNumber,
                    roomType: room.roomType,
                    pricePerNight: room.pricePerNight,
                    available: !room.available
                })
            });

            if (!response.ok) {
                alert("Failed to update room.");
                return;
            }

            await loadRooms();

        } catch (error) {
            console.error(error);
            alert("Failed to update room.");
        }
    };

    // =========================
    // CUSTOMERS
    // =========================

    const loadCustomers = async () => {
        try {
            const response = await fetch(`${API}/customers`, {
                headers: authHeaders()
            });

            if (!response.ok) {
                console.error("Failed to load customers");
                return;
            }

            const data = await response.json();
            setCustomers(data);

        } catch (error) {
            console.error("Customer loading error:", error);
        }
    };

    const addCustomer = async (e) => {
        e.preventDefault();

        if (!customerName || !customerEmail || !customerPhone) {
            alert("Please fill all customer fields.");
            return;
        }

        try {
            const response = await fetch(`${API}/customers`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to add customer.");
                return;
            }

            alert("Customer added successfully!");

            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");

            await loadCustomers();

        } catch (error) {
            console.error(error);
            alert("Failed to add customer.");
        }
    };

    const deleteCustomer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            const response = await fetch(`${API}/customers/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            if (!response.ok) {
                alert("Failed to delete customer.");
                return;
            }

            alert("Customer deleted successfully!");

            await loadCustomers();

        } catch (error) {
            console.error(error);
            alert("Failed to delete customer.");
        }
    };

    // =========================
    // BOOKINGS
    // =========================

    const loadBookings = async () => {
        try {
            const response = await fetch(`${API}/bookings`, {
                headers: authHeaders()
            });

            if (!response.ok) {
                console.error("Failed to load bookings");
                return;
            }

            const data = await response.json();
            setBookings(data);

        } catch (error) {
            console.error("Booking loading error:", error);
        }
    };

    const openBookings = async () => {
        setActivePage("bookings");

        await Promise.all([
            loadBookings(),
            loadCustomers(),
            loadRoomsIfPossible()
        ]);
    };

    // =========================
    // ADD BOOKING
    // =========================

    const addBooking = async (e) => {
        e.preventDefault();

        if (
            !selectedCustomer ||
            !selectedRoom ||
            !checkInDate ||
            !checkOutDate
        ) {
            alert("Please fill all booking fields.");
            return;
        }

        if (checkOutDate <= checkInDate) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        const room = rooms.find(
            (item) => String(item.id) === String(selectedRoom)
        );

        const customer = customers.find(
            (item) => String(item.id) === String(selectedCustomer)
        );

        if (!room) {
            alert("Selected room was not found.");
            return;
        }

        if (!customer) {
            alert("Selected customer was not found.");
            return;
        }

        if (!room.available) {
            alert("This room is currently unavailable.");
            return;
        }

        const bookingData = {
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            },

            room: {
                id: room.id,
                roomNumber: room.roomNumber,
                roomType: room.roomType,
                pricePerNight: room.pricePerNight,
                available: room.available
            },

            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            status: "CONFIRMED"
        };

        console.log("Sending booking:", bookingData);

        try {
            const bookingResponse = await fetch(`${API}/bookings`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(bookingData)
            });

            const responseText = await bookingResponse.text();

            console.log("Booking response:", responseText);

            if (!bookingResponse.ok) {
                alert(`Failed to create booking.\n${responseText}`);
                return;
            }

            // Make room unavailable
            const roomResponse = await fetch(
                `${API}/rooms/${room.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        roomNumber: room.roomNumber,
                        roomType: room.roomType,
                        pricePerNight: room.pricePerNight,
                        available: false
                    })
                }
            );

            if (!roomResponse.ok) {
                alert(
                    "Booking was created, but the room status could not be updated."
                );

                await loadBookings();
                return;
            }

            alert("Booking created successfully!");

            setSelectedCustomer("");
            setSelectedRoom("");
            setCheckInDate("");
            setCheckOutDate("");

            await loadBookings();
            await loadRoomsIfPossible();

        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to create booking.");
        }
    };

    // =========================
    // CANCEL BOOKING
    // =========================

    const cancelBooking = async (booking) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API}/bookings/${booking.id}`,
                {
                    method: "PUT",
                    headers: authHeaders(),

                    body: JSON.stringify({
                        customer: {
                            id: booking.customer.id
                        },

                        room: {
                            id: booking.room.id
                        },

                        checkInDate: booking.checkInDate,
                        checkOutDate: booking.checkOutDate,
                        status: "CANCELLED"
                    })
                }
            );

            if (!response.ok) {
                const text = await response.text();

                alert(`Failed to cancel booking.\n${text}`);
                return;
            }

            // Make room available again
            const roomResponse = await fetch(
                `${API}/rooms/${booking.room.id}`,
                {
                    method: "PUT",
                    headers: authHeaders(),

                    body: JSON.stringify({
                        roomNumber: booking.room.roomNumber,
                        roomType: booking.room.roomType,
                        pricePerNight: booking.room.pricePerNight,
                        available: true
                    })
                }
            );

            if (!roomResponse.ok) {
                alert(
                    "Booking cancelled, but room status could not be updated."
                );
            } else {
                alert("Booking cancelled successfully!");
            }

            await loadBookings();
            await loadRoomsIfPossible();

        } catch (error) {
            console.error(error);
            alert("Failed to cancel booking.");
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        if (!token) {
            return;
        }

        const payload = decodeToken(token);

        if (payload) {
            setUsername(payload.sub || "");
            setRole(payload.role || "CUSTOMER");
        }

        loadCustomers();
        loadBookings();

        if (payload?.role === "ADMIN") {
            loadRooms();
        }

    }, [token]);

    // =========================
    // LOGIN SCREEN
    // =========================

    if (!token) {
        return (
            <div style={styles.loginPage}>
                <div style={styles.loginBox}>

                    <h1 style={styles.loginTitle}>
                        🏨 Hotel Management System
                    </h1>

                    <p style={styles.loginSubtitle}>
                        Login to continue
                    </p>

                    <form onSubmit={handleLogin}>

                        <input
                            type="text"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={(e) =>
                                setLoginUsername(e.target.value)
                            }
                            style={styles.input}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) =>
                                setLoginPassword(e.target.value)
                            }
                            style={styles.input}
                        />

                        <button
                            type="submit"
                            style={styles.primaryButton}
                        >
                            Login
                        </button>

                    </form>

                </div>
            </div>
        );
    }

    // =========================
    // DASHBOARD DATA
    // =========================

    const availableRooms = rooms.filter(
        (room) => room.available
    );

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "CONFIRMED"
    );

    // =========================
    // MAIN APPLICATION
    // =========================

    return (
        <div style={styles.app}>

            {/* SIDEBAR */}

            <aside style={styles.sidebar}>

                <h2 style={styles.logo}>
                    🏨 Hotel
                </h2>

                <p style={styles.roleText}>
                    {username}
                    <br />
                    <strong>{role}</strong>
                </p>

                <button
                    onClick={() => setActivePage("dashboard")}
                    style={styles.menuButton}
                >
                    🏠 Dashboard
                </button>

                {role === "ADMIN" && (
                    <button
                        onClick={() => {
                            setActivePage("rooms");
                            loadRooms();
                        }}
                        style={styles.menuButton}
                    >
                        🛏️ Manage Rooms
                    </button>
                )}

                <button
                    onClick={() => {
                        setActivePage("customers");
                        loadCustomers();
                    }}
                    style={styles.menuButton}
                >
                    👥 Manage Customers
                </button>

                <button
                    onClick={openBookings}
                    style={styles.menuButton}
                >
                    📅 Manage Bookings
                </button>

                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                >
                    🚪 Logout
                </button>

            </aside>

            {/* MAIN CONTENT */}

            <main style={styles.main}>

                {/* DASHBOARD */}

                {activePage === "dashboard" && (
                    <>
                        <h1>Dashboard</h1>

                        <p>
                            Welcome to the Hotel Management System.
                        </p>

                        <div style={styles.cardContainer}>

                            <div style={styles.card}>
                                <h3>🛏️ Total Rooms</h3>
                                <h2>{rooms.length}</h2>
                            </div>

                            <div style={styles.card}>
                                <h3>✅ Available Rooms</h3>
                                <h2>{availableRooms.length}</h2>
                            </div>

                            <div style={styles.card}>
                                <h3>👥 Customers</h3>
                                <h2>{customers.length}</h2>
                            </div>

                            <div style={styles.card}>
                                <h3>📅 Active Bookings</h3>
                                <h2>{confirmedBookings.length}</h2>
                            </div>

                        </div>
                    </>
                )}

                {/* ROOMS */}

                {activePage === "rooms" && role === "ADMIN" && (
                    <>
                        <h1>Manage Rooms</h1>

                        <form
                            onSubmit={addRoom}
                            style={styles.form}
                        >

                            <input
                                type="text"
                                placeholder="Room Number"
                                value={roomNumber}
                                onChange={(e) =>
                                    setRoomNumber(e.target.value)
                                }
                                style={styles.input}
                            />

                            <select
                                value={roomType}
                                onChange={(e) =>
                                    setRoomType(e.target.value)
                                }
                                style={styles.input}
                            >

                                <option value="">
                                    Select Room Type
                                </option>

                                <option value="Single">
                                    Single
                                </option>

                                <option value="Double">
                                    Double
                                </option>

                                <option value="Deluxe">
                                    Deluxe
                                </option>

                                <option value="Suite">
                                    Suite
                                </option>

                            </select>

                            <input
                                type="number"
                                placeholder="Price Per Night"
                                value={pricePerNight}
                                onChange={(e) =>
                                    setPricePerNight(e.target.value)
                                }
                                style={styles.input}
                            />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={available}
                                    onChange={(e) =>
                                        setAvailable(e.target.checked)
                                    }
                                />

                                {" "}Available
                            </label>

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                Add Room
                            </button>

                        </form>

                        <h2>Rooms</h2>

                        <table style={styles.table}>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Room Number</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {rooms.map((room) => (
                                <tr key={room.id}>

                                    <td>{room.id}</td>

                                    <td>
                                        {room.roomNumber}
                                    </td>

                                    <td>
                                        {room.roomType}
                                    </td>

                                    <td>
                                        ₹{room.pricePerNight}
                                    </td>

                                    <td>
                                        {room.available
                                            ? "Available"
                                            : "Occupied"}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                toggleRoomAvailability(
                                                    room
                                                )
                                            }
                                            style={
                                                styles.smallButton
                                            }
                                        >
                                            {room.available
                                                ? "Mark Occupied"
                                                : "Mark Available"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteRoom(
                                                    room.id
                                                )
                                            }
                                            style={
                                                styles.deleteButton
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>
                    </>
                )}

                {/* CUSTOMERS */}

                {activePage === "customers" && (
                    <>
                        <h1>Manage Customers</h1>

                        <form
                            onSubmit={addCustomer}
                            style={styles.form}
                        >

                            <input
                                type="text"
                                placeholder="Customer Name"
                                value={customerName}
                                onChange={(e) =>
                                    setCustomerName(e.target.value)
                                }
                                style={styles.input}
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={customerEmail}
                                onChange={(e) =>
                                    setCustomerEmail(e.target.value)
                                }
                                style={styles.input}
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={customerPhone}
                                onChange={(e) =>
                                    setCustomerPhone(e.target.value)
                                }
                                style={styles.input}
                            />

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                Add Customer
                            </button>

                        </form>

                        <h2>Customers</h2>

                        <table style={styles.table}>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {customers.map((customer) => (
                                <tr key={customer.id}>

                                    <td>{customer.id}</td>

                                    <td>
                                        {customer.name}
                                    </td>

                                    <td>
                                        {customer.email}
                                    </td>

                                    <td>
                                        {customer.phone}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() =>
                                                deleteCustomer(
                                                    customer.id
                                                )
                                            }
                                            style={
                                                styles.deleteButton
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>
                    </>
                )}

                {/* BOOKINGS */}

                {activePage === "bookings" && (
                    <>
                        <h1>Manage Bookings</h1>

                        <form
                            onSubmit={addBooking}
                            style={styles.form}
                        >

                            <select
                                value={selectedCustomer}
                                onChange={(e) =>
                                    setSelectedCustomer(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            >

                                <option value="">
                                    Select Customer
                                </option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.name}
                                    </option>
                                ))}

                            </select>

                            <select
                                value={selectedRoom}
                                onChange={(e) =>
                                    setSelectedRoom(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            >

                                <option value="">
                                    Select Available Room
                                </option>

                                {rooms
                                    .filter(
                                        (room) =>
                                            room.available
                                    )
                                    .map((room) => (
                                        <option
                                            key={room.id}
                                            value={room.id}
                                        >
                                            Room {room.roomNumber}
                                            {" - "}
                                            {room.roomType}
                                            {" - ₹"}
                                            {room.pricePerNight}
                                        </option>
                                    ))}

                            </select>

                            <label>
                                Check-in Date
                            </label>

                            <input
                                type="date"
                                value={checkInDate}
                                onChange={(e) =>
                                    setCheckInDate(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            />

                            <label>
                                Check-out Date
                            </label>

                            <input
                                type="date"
                                value={checkOutDate}
                                onChange={(e) =>
                                    setCheckOutDate(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            />

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                Add Booking
                            </button>

                        </form>

                        <h2>Bookings</h2>

                        <table style={styles.table}>

                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Room</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>

                            {bookings.map((booking) => (
                                <tr key={booking.id}>

                                    <td>
                                        {booking.id}
                                    </td>

                                    <td>
                                        {booking.customer?.name}
                                    </td>

                                    <td>
                                        Room{" "}
                                        {booking.room?.roomNumber}
                                    </td>

                                    <td>
                                        {booking.checkInDate}
                                    </td>

                                    <td>
                                        {booking.checkOutDate}
                                    </td>

                                    <td>
                                        {booking.status}
                                    </td>

                                    <td>

                                        {booking.status ===
                                            "CONFIRMED" && (
                                                <button
                                                    onClick={() =>
                                                        cancelBooking(
                                                            booking
                                                        )
                                                    }
                                                    style={
                                                        styles.deleteButton
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            )}

                                    </td>

                                </tr>
                            ))}

                            </tbody>

                        </table>
                    </>
                )}

            </main>

        </div>
    );
}

// =========================
// STYLES
// =========================

const styles = {
    app: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f6fa"
    },

    sidebar: {
        width: "230px",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "20px",
        boxSizing: "border-box"
    },

    logo: {
        marginBottom: "20px"
    },

    roleText: {
        fontSize: "14px",
        marginBottom: "25px",
        lineHeight: "1.6"
    },

    menuButton: {
        width: "100%",
        padding: "12px",
        marginBottom: "10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "15px"
    },

    logoutButton: {
        width: "100%",
        padding: "12px",
        marginTop: "20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: "#dc2626",
        color: "white",
        fontSize: "15px"
    },

    main: {
        flex: 1,
        padding: "30px",
        overflowX: "auto"
    },

    loginPage: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f6fa"
    },

    loginBox: {
        width: "380px",
        padding: "35px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
    },

    loginTitle: {
        textAlign: "center",
        marginBottom: "10px"
    },

    loginSubtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "25px"
    },

    input: {
        width: "100%",
        padding: "11px",
        marginBottom: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxSizing: "border-box",
        fontSize: "14px"
    },

    form: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px",
        maxWidth: "600px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },

    primaryButton: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "bold"
    },

    smallButton: {
        padding: "7px 10px",
        marginRight: "5px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "white"
    },

    deleteButton: {
        padding: "7px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#dc2626",
        color: "white"
    },

    cardContainer: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginTop: "30px"
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        marginTop: "15px"
    }
};

export default App;