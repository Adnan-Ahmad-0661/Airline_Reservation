import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          "Authorization": `Bearer ${token}`
        };


        // =====================================================
        // USERS
        // =====================================================

        const usersResponse = await fetch(
          `${API_URL}/api/admin/users`,
          {
            method: "GET",
            headers
          }
        );

        if (!usersResponse.ok) {
          throw new Error(
            `Users API failed: ${usersResponse.status}`
          );
        }

        const usersData = await usersResponse.json();


        // =====================================================
        // FLIGHTS
        // =====================================================

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

        const flightsData = await flightsResponse.json();


        // =====================================================
        // BOOKINGS
        // =====================================================

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

        const bookingsData = await bookingsResponse.json();


        // =====================================================
        // PAYMENTS
        // =====================================================

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

        const paymentsData = await paymentsResponse.json();


        // =====================================================
        // TICKETS
        // =====================================================

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

        const ticketsData = await ticketsResponse.json();


        // =====================================================
        // SAVE DATA
        // =====================================================

        setUsers(
          Array.isArray(usersData)
            ? usersData
            : []
        );

        setFlights(
          Array.isArray(flightsData)
            ? flightsData
            : []
        );

        setBookings(
          Array.isArray(bookingsData)
            ? bookingsData
            : []
        );

        setPayments(
          Array.isArray(paymentsData)
            ? paymentsData
            : []
        );

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


  // =====================================================
  // LOADING
  // =====================================================

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


  // =====================================================
  // ERROR
  // =====================================================

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


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (

    <div style={pageContainerStyle}>

      <div style={containerStyle}>


        {/* =================================================
            HEADER
        ================================================= */}

        <div style={headerStyle}>

          <div>

            <h1 style={{ margin: 0 }}>
              ✈️ Admin Dashboard
            </h1>

            <p
              style={{
                marginBottom: 0,
                color: "#666"
              }}
            >
              Airline Reservation System
            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
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


        {/* =================================================
            STAT CARDS
        ================================================= */}

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


        {/* =================================================
            FLIGHTS
        ================================================= */}

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


          <div style={{ overflowX: "auto" }}>

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
                                  flight.status || "ACTIVE"
                                ).toUpperCase() ===
                                "CANCELLED"
                                  ? "#fee2e2"
                                  : "#dcfce7",
                              color:
                                String(
                                  flight.status || "ACTIVE"
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


        {/* =================================================
            BOOKINGS
        ================================================= */}

        <div style={sectionStyle}>

          <h2>
            🎫 All Bookings
          </h2>

          <div style={{ overflowX: "auto" }}>

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


        {/* =================================================
            USERS
        ================================================= */}

        <div style={sectionStyle}>

          <h2>
            👥 All Users
          </h2>

          <div style={{ overflowX: "auto" }}>

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
                    Role
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      style={emptyStyle}
                    >
                      No users found
                    </td>

                  </tr>

                ) : (

                  users.map((user) => (

                    <tr key={user.id}>

                      <td style={tdStyle}>
                        {user.id}
                      </td>

                      <td style={tdStyle}>
                        {user.name ||
                          user.username ||
                          "--"}
                      </td>

                      <td style={tdStyle}>
                        {user.email || "--"}
                      </td>

                      <td style={tdStyle}>
                        {user.role || "--"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>

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
  fontFamily: "Arial, sans-serif"
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
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "18px",
  marginBottom: "30px"
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
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee"
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
  fontFamily: "Arial, sans-serif",
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

export default AdminDashboard;