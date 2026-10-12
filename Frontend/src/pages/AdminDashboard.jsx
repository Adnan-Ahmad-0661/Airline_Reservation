import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
const API_URL = "http://localhost:8080";

function AdminDashboard() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // EDIT USER
  // ==============================

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER"
  });

  const [savingUser, setSavingUser] = useState(false);


  // ==============================
  // LOAD ADMIN DATA
  // ==============================

  useEffect(() => {

    const loadAdminData = async () => {

      try {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        };


        // ==============================
        // USERS
        // ==============================
try {
  const usersResponse = await API.get(
    "/api/admin/users-status"
  );

  const usersData = usersResponse.data;

  setUsers(
    Array.isArray(usersData) ? usersData : []
  );
} catch (error) {
  console.error(
    "Users Status API Error:",
    error.response?.status,
    error.response?.data || error.message
  );

  if (
    error.response?.status === 401 ||
    error.response?.status === 403
  ) {
    // Do not manually remove tokens here.
    // The shared Axios interceptor should handle refresh.
    console.error(
      "Authentication failed. Check the refresh API response."
    );
    return;
  }

  throw error;
}
        // const usersResponse = await fetch(
        //   `${API_URL}/api/admin/users-status`,
        //   {
        //     method: "GET",
        //     headers
        //   }
        // );

        // if (!usersResponse.ok) {

        //   if (
        //     usersResponse.status === 401 ||
        //     usersResponse.status === 403
        //   ) {
        //     localStorage.removeItem("token");
        //     navigate("/login");
        //     return;
        //   }

        //   throw new Error(
        //     `Users API failed: ${usersResponse.status}`
        //   );
        // }

        // const usersData =
        //   await usersResponse.json();

        // setUsers(
        //   Array.isArray(usersData)
        //     ? usersData
        //     : []
        // );


        // ==============================
        // FLIGHTS
        // ==============================

        const flightsResponse = await fetch(
          `${API_URL}/api/admin/flights`,
          {
            method: "GET",
            headers
          }
        );

        if (!flightsResponse.ok) {

          throw new Error(
            `Flights API failed: ${flightsResponse.status}`
          );
        }

        const flightsData =
          await flightsResponse.json();

        setFlights(
          Array.isArray(flightsData)
            ? flightsData
            : []
        );


        // ==============================
        // BOOKINGS
        // ==============================

        const bookingsResponse = await fetch(
          `${API_URL}/api/admin/bookings`,
          {
            method: "GET",
            headers
          }
        );

        if (!bookingsResponse.ok) {

          throw new Error(
            `Bookings API failed: ${bookingsResponse.status}`
          );
        }

        const bookingsData =
          await bookingsResponse.json();

        setBookings(
          Array.isArray(bookingsData)
            ? bookingsData
            : []
        );


        // ==============================
        // PAYMENTS
        // ==============================

        const paymentsResponse = await fetch(
          `${API_URL}/api/admin/payments`,
          {
            method: "GET",
            headers
          }
        );

        if (!paymentsResponse.ok) {

          throw new Error(
            `Payments API failed: ${paymentsResponse.status}`
          );
        }

        const paymentsData =
          await paymentsResponse.json();

        setPayments(
          Array.isArray(paymentsData)
            ? paymentsData
            : []
        );


        // ==============================
        // TICKETS
        // ==============================

        const ticketsResponse = await fetch(
          `${API_URL}/api/admin/tickets`,
          {
            method: "GET",
            headers
          }
        );

        if (!ticketsResponse.ok) {

          throw new Error(
            `Tickets API failed: ${ticketsResponse.status}`
          );
        }

        const ticketsData =
          await ticketsResponse.json();

        setTickets(
          Array.isArray(ticketsData)
            ? ticketsData
            : []
        );

      } catch (err) {

        console.error(
          "ADMIN DASHBOARD ERROR:",
          err
        );

        setError(
          err.message ||
          "Unable to load admin dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    loadAdminData();

  }, [navigate]);


  // ==============================
  // DELETE USER / ADMIN
  // ==============================

  const handleDeleteUser = async (userId) => {

    const user = users.find(
      (item) => item.id === userId
    );

    if (!user) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user.name || user.email}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const message =
        await response.text();

      if (!response.ok) {

        throw new Error(
          message ||
          "Unable to delete user"
        );
      }

      alert(
        "Account deleted successfully!"
      );

      setUsers((previousUsers) =>
        previousUsers.filter(
          (item) => item.id !== userId
        )
      );

    } catch (error) {

      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to delete account"
      );

    }

  };


  // ==============================
  // OPEN EDIT MODAL
  // ==============================

  const handleEditUser = (user) => {

    setEditingUser(user);

    setEditForm({

      name: user.name || "",

      email: user.email || "",

      phone: user.phone || "",

      role:
        String(user.role || "USER")
          .replace("ROLE_", "")
          .toUpperCase()

    });

  };


  // ==============================
  // UPDATE USER
  // ==============================

  const handleUpdateUser = async () => {

    if (!editingUser) {
      return;
    }

    if (!editForm.name.trim()) {

      alert("Name is required.");

      return;
    }

    if (!editForm.email.trim()) {

      alert("Email is required.");

      return;
    }

    if (!editForm.role) {

      alert("Role is required.");

      return;
    }

    try {

      setSavingUser(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/users/${editingUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({

            name: editForm.name.trim(),

            email: editForm.email.trim(),

            phone: editForm.phone.trim(),

            role: editForm.role

          })
        }
      );


      const responseText =
        await response.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message: responseText
        };
      }


      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          responseText ||
          "Unable to update user"
        );

      }


      alert(
        "User updated successfully!"
      );


      // Update table immediately

      setUsers((previousUsers) =>

        previousUsers.map((user) =>

          user.id === editingUser.id

            ? {
                ...user,

                name:
                  data.name ??
                  editForm.name,

                email:
                  data.email ??
                  editForm.email,

                phone:
                  data.phone ??
                  editForm.phone,

                role:
                  data.role ??
                  editForm.role
              }

            : user

        )

      );


      setEditingUser(null);

    } catch (error) {

      console.error(
        "UPDATE USER ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to update user"
      );

    } finally {

      setSavingUser(false);

    }

  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (

      <div style={pageStyle}>

        <div style={messageBoxStyle}>

          <h2>
            Loading Admin Dashboard...
          </h2>

          <p style={{ color: "#666" }}>
            Please wait
          </p>

        </div>

      </div>

    );

  }


  // ==============================
  // ERROR
  // ==============================

  if (error) {

    return (

      <div style={pageStyle}>

        <div style={messageBoxStyle}>

          <h2>
            Admin Dashboard Error
          </h2>

          <p
            style={{
              color: "#dc2626",
              fontWeight: "bold"
            }}
          >
            {error}
          </p>


          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "20px"
            }}
          >

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              style={buttonStyle}
            >
              Retry
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              style={{
                ...buttonStyle,
                background: "#6b7280"
              }}
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ==============================
  // DASHBOARD
  // ==============================

  return (

    <div style={pageContainerStyle}>

      <div style={containerStyle}>


        {/* =========================
            HEADER
        ========================== */}

        <div style={headerStyle}>

          <div
            style={{
              flex: 1,
              textAlign: "center"
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginBottom: "8px"
              }}
            >

              <span
                style={{
                  fontSize: "50px",
                  lineHeight: "1"
                }}
              >
                ✈️
              </span>

              <h1
                style={{
                  margin: 0,
                  fontSize: "45px",
                  fontWeight: "800",
                  color: "#111827",
                  letterSpacing: "1px"
                }}
              >
                Admin Dashboard
              </h1>

            </div>


            <p
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#6b7280",
                fontWeight: "500"
              }}
            >
              Airline Reservation System
            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >

            <button
              type="button"
              onClick={() =>
                navigate("/admin/flights")
              }
              style={buttonStyle}
            >
              ✈️ Manage Flights
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              style={{
                ...buttonStyle,
                background: "#6b7280"
              }}
            >
              Home
            </button>

          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================== */}

        <div style={statsGridStyle}>

          <div style={cardStyle}>

            <p style={labelStyle}>
              Total Users
            </p>

            <h2 style={numberStyle}>
              👥 {users.length}
            </h2>

          </div>


          <div style={cardStyle}>

            <p style={labelStyle}>
              Total Flights
            </p>

            <h2 style={numberStyle}>
              ✈️ {flights.length}
            </h2>

          </div>


          <div style={cardStyle}>

            <p style={labelStyle}>
              Total Bookings
            </p>

            <h2 style={numberStyle}>
              🎫 {bookings.length}
            </h2>

          </div>


          <div style={cardStyle}>

            <p style={labelStyle}>
              Total Payments
            </p>

            <h2 style={numberStyle}>
              💳 {payments.length}
            </h2>

          </div>


          <div style={cardStyle}>

            <p style={labelStyle}>
              Total Tickets
            </p>

            <h2 style={numberStyle}>
              🎟️ {tickets.length}
            </h2>

          </div>

        </div>


        {/* =========================
            FLIGHTS
        ========================== */}

        <div style={sectionStyle}>

          <div style={sectionHeaderStyle}>

            <h2>
              ✈️ All Flights
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/flights")
              }
              style={smallButtonStyle}
            >
              Manage Flights
            </button>

          </div>


          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table style={tableStyle}>

              <thead>

                <tr style={tableHeaderStyle}>

                  <th style={thStyle}>
                    ID
                  </th>

                  <th style={thStyle}>
                    Flight
                  </th>

                  <th style={thStyle}>
                    Airline
                  </th>

                  <th style={thStyle}>
                    Source
                  </th>

                  <th style={thStyle}>
                    Destination
                  </th>

                  <th style={thStyle}>
                    Economy Price
                  </th>

                  <th style={thStyle}>
                    Seats
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {flights.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      style={emptyStyle}
                    >
                      No flights found
                    </td>

                  </tr>

                ) : (

                  flights.map((flight) => {

                    const source =
                      flight.sourceAirport;

                    const destination =
                      flight.destinationAirport;


                    return (

                      <tr key={flight.id}>

                        <td style={tdStyle}>
                          {flight.id}
                        </td>


                        <td style={tdStyle}>
                          {flight.flightNumber || "--"}
                        </td>


                        <td style={tdStyle}>
                          {flight.airlineName || "--"}
                        </td>


                        <td style={tdStyle}>

                          {source
                            ? `${source.city || "--"} (${source.airportCode || "--"})`
                            : "--"}

                        </td>


                        <td style={tdStyle}>

                          {destination
                            ? `${destination.city || "--"} (${destination.airportCode || "--"})`
                            : "--"}

                        </td>


                        <td style={tdStyle}>
                          ₹{flight.economyPrice ?? 0}
                        </td>


                        <td style={tdStyle}>

                          {flight.availableSeats ?? 0}
                          {" / "}
                          {flight.totalSeats ?? 0}

                        </td>


                        <td style={tdStyle}>

                          <span
                            style={{
                              padding: "5px 9px",
                              borderRadius: "20px",

                              background:
                                String(
                                  flight.status ||
                                  "ACTIVE"
                                ).toUpperCase() ===
                                "CANCELLED"
                                  ? "#fee2e2"
                                  : "#dcfce7",

                              color:
                                String(
                                  flight.status ||
                                  "ACTIVE"
                                ).toUpperCase() ===
                                "CANCELLED"
                                  ? "#b91c1c"
                                  : "#166534",

                              fontWeight: "bold",
                              fontSize: "12px"
                            }}
                          >
                            {flight.status || "ACTIVE"}
                          </span>

                        </td>

                      </tr>

                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =========================
            BOOKINGS
        ========================== */}

        <div style={sectionStyle}>

          <h2>
            🎫 All Bookings
          </h2>


          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table style={tableStyle}>

              <thead>

                <tr style={tableHeaderStyle}>

                  <th style={thStyle}>
                    ID
                  </th>

                  <th style={thStyle}>
                    PNR
                  </th>

                  <th style={thStyle}>
                    Seat
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Flight
                  </th>

                </tr>

              </thead>


              <tbody>

                {bookings.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      style={emptyStyle}
                    >
                      No bookings found
                    </td>

                  </tr>

                ) : (

                  bookings.map((booking) => (

                    <tr key={booking.id}>

                      <td style={tdStyle}>
                        {booking.id}
                      </td>

                      <td style={tdStyle}>
                        {booking.pnr || "--"}
                      </td>

                      <td style={tdStyle}>

                        {booking.seatNumber ||
                          booking.seat?.seatNumber ||
                          "--"}

                      </td>

                      <td style={tdStyle}>
                        {booking.status || "--"}
                      </td>

                      <td style={tdStyle}>

                        {booking.flight?.flightNumber ||
                          booking.flightId ||
                          "--"}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* =========================
            USERS
        ========================== */}

        <div style={sectionStyle}>

          <div style={sectionHeaderStyle}>

            <h2>
              👥 All Users
            </h2>

            <span
              style={{
                background: "#eef2ff",
                color: "#3730a3",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "bold"
              }}
            >
              {users.length} Accounts
            </span>

          </div>


          <div
            style={{
              overflowX: "auto"
            }}
          >

            <table style={tableStyle}>

              <thead>

                <tr style={tableHeaderStyle}>

                  <th style={thStyle}>
                    ID
                  </th>

                  <th style={thStyle}>
                    Name
                  </th>

                  <th style={thStyle}>
                    Email
                  </th>

                  <th style={thStyle}>
                    Phone
                  </th>

                  <th style={thStyle}>
                    Role
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Last Active
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      style={emptyStyle}
                    >
                      No users found
                    </td>

                  </tr>

                ) : (

                  users.map((user) => (

                    <tr
                      key={
                        user.id ||
                        user.email
                      }
                    >

                      {/* ID */}

                      <td style={tdStyle}>
                        {user.id || "--"}
                      </td>


                      {/* NAME */}

                      <td style={tdStyle}>

                        <strong>
                          {user.name || "--"}
                        </strong>

                      </td>


                      {/* EMAIL */}

                      <td style={tdStyle}>
                        {user.email || "--"}
                      </td>


                      {/* PHONE */}

                      <td style={tdStyle}>
                        {user.phone || "--"}
                      </td>


                      {/* ROLE */}

                      <td style={tdStyle}>

                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 10px",
                            borderRadius: "20px",

                            background:
                              String(
                                user.role ||
                                "USER"
                              )
                                .toUpperCase()
                                .includes("ADMIN")
                                ? "#ede9fe"
                                : "#dbeafe",

                            color:
                              String(
                                user.role ||
                                "USER"
                              )
                                .toUpperCase()
                                .includes("ADMIN")
                                ? "#6d28d9"
                                : "#1d4ed8",

                            fontWeight: "bold",
                            fontSize: "12px"
                          }}
                        >

                          {String(
                            user.role ||
                            "USER"
                          )
                            .replace("ROLE_", "")
                            .toUpperCase()}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td style={tdStyle}>

                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 10px",
                            borderRadius: "20px",

                            background:
                              user.status ===
                              "Online"
                                ? "#dcfce7"
                                : "#f3f4f6",

                            color:
                              user.status ===
                              "Online"
                                ? "#15803d"
                                : "#6b7280",

                            fontWeight: "bold",
                            fontSize: "12px"
                          }}
                        >

                          {user.status || "--"}

                        </span>

                      </td>


                      {/* LAST ACTIVE */}

                      <td style={tdStyle}>

                        {user.status ===
                        "Online"

                          ? "--"

                          : user.lastActive

                          ? new Date(
                              user.lastActive
                            ).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                              }
                            )

                          : "Never"}

                      </td>


                      {/* ACTION */}

                      <td style={tdStyle}>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            flexWrap: "nowrap"
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              handleEditUser(user)
                            }
                            style={
                              editButtonStyle
                            }
                          >
                            ✏️ Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                            style={
                              deleteButtonStyle
                            }
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>


      {/* =========================
          EDIT USER MODAL
      ========================== */}

      {editingUser && (

        <div
          style={modalOverlayStyle}
        >

          <div
            style={modalStyle}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px"
              }}
            >

              <h2
                style={{
                  margin: 0,
                  color: "#111827"
                }}
              >
                ✏️ Edit Account
              </h2>


              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
                style={
                  closeButtonStyle
                }
              >
                ×
              </button>

            </div>


            <p
              style={{
                color: "#6b7280",
                marginTop: "8px",
                marginBottom: "25px"
              }}
            >
              Update user account information
            </p>


            {/* NAME */}

            <label
              style={inputLabelStyle}
            >
              Name
            </label>

            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value
                })
              }
              style={inputStyle}
              placeholder="Enter name"
            />


            {/* EMAIL */}

            <label
              style={inputLabelStyle}
            >
              Email
            </label>

            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  email: e.target.value
                })
              }
              style={inputStyle}
              placeholder="Enter email"
            />


            {/* PHONE */}

            <label
              style={inputLabelStyle}
            >
              Phone
            </label>

            <input
              type="text"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  phone: e.target.value
                })
              }
              style={inputStyle}
              placeholder="Enter phone"
            />


            {/* ROLE */}

            <label
              style={inputLabelStyle}
            >
              Role
            </label>

            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  role: e.target.value
                })
              }
              style={inputStyle}
            >

              <option value="USER">
                USER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>


            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px"
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
                style={
                  cancelButtonStyle
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleUpdateUser}
                disabled={savingUser}
                style={{
                  ...saveButtonStyle,

                  opacity:
                    savingUser
                      ? 0.7
                      : 1,

                  cursor:
                    savingUser
                      ? "not-allowed"
                      : "pointer"
                }}
              >

                {savingUser
                  ? "Saving..."
                  : "💾 Save Changes"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


// =====================================================
// STYLES
// =====================================================

const pageContainerStyle = {

  minHeight: "100vh",

  background:
    "linear-gradient(135deg, #eef4ff, #f8fafc)",

  padding: "30px",

  fontFamily:
    "Arial, sans-serif"
};


const containerStyle = {

  maxWidth: "1400px",

  margin: "auto"
};


const headerStyle = {

  background: "white",

  padding: "25px 30px",

  borderRadius: "15px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.08)",

  marginBottom: "25px",

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: "20px",

  flexWrap: "wrap"
};


const statsGridStyle = {

  display: "grid",

  gridTemplateColumns:
    "repeat(5, 1fr)",

  gap: "18px",

  marginBottom: "30px",

  width: "100%"
};


const cardStyle = {

  background: "white",

  padding: "22px",

  borderRadius: "14px",

  boxShadow:
    "0 5px 15px rgba(0,0,0,0.07)"
};


const labelStyle = {

  color: "#777",

  margin: 0
};


const numberStyle = {

  marginBottom: 0
};


const sectionStyle = {

  background: "white",

  padding: "25px",

  borderRadius: "15px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.08)",

  marginBottom: "25px"
};


const sectionHeaderStyle = {

  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  gap: "15px",

  marginBottom: "15px",

  flexWrap: "wrap"
};


const buttonStyle = {

  padding: "12px 20px",

  background: "#0066ff",

  color: "white",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "bold"
};


const smallButtonStyle = {

  padding: "10px 16px",

  background: "#0066ff",

  color: "white",

  border: "none",

  borderRadius: "7px",

  cursor: "pointer",

  fontWeight: "bold"
};


const tableStyle = {

  width: "100%",

  borderCollapse: "collapse"
};


const tableHeaderStyle = {

  background: "#eef4ff"
};


const thStyle = {

  padding: "12px",

  textAlign: "left",

  borderBottom:
    "1px solid #ddd",

  whiteSpace: "nowrap"
};


const tdStyle = {

  padding: "12px",

  borderBottom:
    "1px solid #eee",

  whiteSpace: "nowrap"
};


const emptyStyle = {

  textAlign: "center",

  padding: "25px",

  color: "#777"
};


const pageStyle = {

  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  background: "#f5f7fa",

  fontFamily:
    "Arial, sans-serif",

  padding: "20px"
};


const messageBoxStyle = {

  background: "white",

  padding: "40px",

  borderRadius: "15px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.10)",

  textAlign: "center",

  maxWidth: "550px",

  width: "100%"
};


// =====================================================
// ACTION BUTTONS
// =====================================================

const editButtonStyle = {

  background: "#2563eb",

  color: "white",

  border: "none",

  padding: "5px 9px",

  borderRadius: "5px",

  cursor: "pointer",

  fontSize: "12px",

  fontWeight: "600",

  whiteSpace: "nowrap"
};


const deleteButtonStyle = {

  background: "#dc2626",

  color: "white",

  border: "none",

  padding: "5px 9px",

  borderRadius: "5px",

  cursor: "pointer",

  fontSize: "12px",

  fontWeight: "600",

  whiteSpace: "nowrap"
};


// =====================================================
// EDIT MODAL
// =====================================================

const modalOverlayStyle = {

  position: "fixed",

  inset: 0,

  background:
    "rgba(0,0,0,0.55)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 9999,

  padding: "20px"
};


const modalStyle = {

  background: "white",

  width: "100%",

  maxWidth: "500px",

  borderRadius: "18px",

  padding: "30px",

  boxShadow:
    "0 25px 70px rgba(0,0,0,0.25)"
};


const closeButtonStyle = {

  border: "none",

  background: "#f3f4f6",

  color: "#374151",

  width: "35px",

  height: "35px",

  borderRadius: "50%",

  fontSize: "24px",

  cursor: "pointer",

  lineHeight: "1"
};


const inputLabelStyle = {

  display: "block",

  marginBottom: "6px",

  fontWeight: "600",

  color: "#374151"
};


const inputStyle = {

  width: "100%",

  boxSizing: "border-box",

  padding: "11px 13px",

  marginBottom: "16px",

  border:
    "1px solid #d1d5db",

  borderRadius: "8px",

  fontSize: "15px",

  outline: "none"
};


const cancelButtonStyle = {

  padding: "11px 20px",

  background: "#6b7280",

  color: "white",

  border: "none",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "bold"
};


const saveButtonStyle = {

  padding: "11px 20px",

  background: "#2563eb",

  color: "white",

  border: "none",

  borderRadius: "8px",

  fontWeight: "bold"
};


export default AdminDashboard;