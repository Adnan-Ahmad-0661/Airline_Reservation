import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Home.css";


function Home() {
  const navigate = useNavigate();

  // =====================================================
  // LOGIN STATUS
  // =====================================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // =====================================================
  // USER ROLE
  // =====================================================

  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    isLoggedIn &&
    ["ADMIN", "ROLE_ADMIN"].includes(
      userRole.trim().toUpperCase()
    );

  // =====================================================
  // AIRPORT / CITY LIST
  // =====================================================

  const airports = [
    "Delhi",
    "Ayodhya",
    "Gorakhpur",
    "Bangalore",
    "Lucknow",
    "Mumbai",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Ahmedabad",
    "Pune",
    "Jaipur",
    "Patna",
    "Varanasi",
    "Goa",
  ];

  // =====================================================
  // SEARCH STATES
  // =====================================================

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [flights, setFlights] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searched, setSearched] = useState(false);

  // =====================================================
  // ROUTE STATES
  // =====================================================

  const [showRoute, setShowRoute] = useState(false);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [routeStops, setRouteStops] = useState([]);

  const [routeLoading, setRouteLoading] = useState(false);

  // =====================================================
  // LOGIN CHECK
  // =====================================================

 
  // const requireLogin = async (action) => {
  //   const token = localStorage.getItem("token");

  //   // Token hi nahi hai
  //   if (!token) {
  //     setIsLoggedIn(false);
  //     setUserRole("");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/api/auth/profile",
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // Token invalid/expired
  //     if (response.status === 401 || response.status === 403) {
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("userRole");

  //       setIsLoggedIn(false);
  //       setUserRole("");

  //       navigate("/login");
  //       return;
  //     }

  //     const user = await response.json();

  //     // Backend ke according user offline hai
  //     if (!user.online) {
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("userRole");

  //       setIsLoggedIn(false);
  //       setUserRole("");

  //       alert("Your session has expired. Please login again.");
  //       navigate("/login");
  //       return;
  //     }

  //     // User actually online hai
  //     setIsLoggedIn(true);
  //     setUserRole(user.role);

  //     if (action) {
  //       action();
  //     }

  //   } catch (error) {
  //     console.error("Login verification failed:", error);

  //     localStorage.removeItem("token");
  //     localStorage.removeItem("userRole");

  //     setIsLoggedIn(false);
  //     setUserRole("");

  //     navigate("/login");
  //   }
  // };
 
  const requireLogin = async (action) => {
  try {
    // Axios interceptor automatically handles expired access tokens
    const response = await API.get("/api/auth/profile");

    const user = response.data;

    // Check whether backend reports the user as offline
    if (user?.online === false) {
      alert("Your session has expired. Please login again.");

      [
        "token",
        "accessToken",
        "refreshToken",
        "userId",
        "userName",
        "userEmail",
        "userRole",
        "user",
      ].forEach((key) => localStorage.removeItem(key));

      setIsLoggedIn(false);
      setUserRole("");
      navigate("/login");
      return;
    }

    // Update login state
    setIsLoggedIn(true);

    if (user?.role) {
      setUserRole(user.role);
      localStorage.setItem("userRole", user.role);
    }

    // Run the requested action after successful verification
    if (typeof action === "function") {
      action();
    }
  } catch (error) {
    console.error(
      "Login verification failed:",
      error.response?.status,
      error.response?.data || error.message
    );

    // Do not delete tokens for network/server errors.
    // If refresh fails with 401/403, handle the session here.
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      [
        "token",
        "accessToken",
        "refreshToken",
        "userId",
        "userName",
        "userEmail",
        "userRole",
        "user",
      ].forEach((key) => localStorage.removeItem(key));

      setIsLoggedIn(false);
      setUserRole("");
      navigate("/login");
    }
  }
};

  // =====================================================
  // EASY BOOKING
  // =====================================================

  const handleEasyBooking = () => {
    requireLogin(() => {
      const searchSection =
        document.querySelector(".search-card");

      if (searchSection) {
        searchSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  // =====================================================
  // SECURE
  // =====================================================

  const handleSecure = () => {
    requireLogin(() => {
      alert(
        "🔒 Your account and booking information is protected with JWT authentication."
      );
    });
  };

  // =====================================================
  // MY BOOKINGS
  // =====================================================

  const handleMyBookings = () => {
    requireLogin(() => {
      navigate("/my-bookings");
    });
  };

 
  // =====================================================
  // TODAY DATE
  // =====================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // MAX BOOKING DATE
  // TODAY + 3 MONTHS
  // =====================================================

  const getMaxBookingDate = () => {
    const today = new Date();

    const maxDate = new Date(
      today.getFullYear(),
      today.getMonth() + 3,
      today.getDate()
    );

    const year = maxDate.getFullYear();

    const month = String(
      maxDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      maxDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Backend me user ko OFFLINE karo
      if (token) {
        await fetch("http://localhost:8080/api/auth/offline", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Offline API error:", error);
    }

    // Browser se login data remove karo
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");

    // React state reset
    setIsLoggedIn(false);
    setUserRole("");

    setFlights([]);
    setSearched(false);

    navigate("/");

    alert("Logout successful.");
  };


  // =====================================================
  // SEARCH FLIGHTS
  // =====================================================

  const searchFlights = async () => {
    const source = from.trim();
    const destination = to.trim();

    // SOURCE
    if (!source) {
      alert("Please select departure city.");
      return;
    }

    // DESTINATION
    if (!destination) {
      alert("Please select destination city.");
      return;
    }

    // SAME CITY
    if (
      source.toLowerCase() ===
      destination.toLowerCase()
    ) {
      alert(
        "Source and destination cannot be same."
      );
      return;
    }

    // PASSENGERS
    if (passengers < 1 || passengers > 10) {
      alert(
        "Passengers must be between 1 and 10."
      );
      return;
    }

    // DATE
    if (!date) {
      alert("Please select a travel date.");
      return;
    }

    // DATE RANGE
    const today = getTodayDate();
    const maxDate = getMaxBookingDate();

    if (date < today) {
      alert("Past date is not allowed.");

      setDate("");

      return;
    }

    if (date > maxDate) {
      alert(
        "You can book flights only within the next 3 months."
      );

      setDate("");

      return;
    }

    // =================================================
    // API CALL
    // =================================================

    try {
      setLoading(true);

      setSearched(true);

      setFlights([]);

      const params = {
        source: source,
        destination: destination,
        date: date,
      };

      const response = await API.get(
        "/api/flights/search",
        {
          params: params,
        }
      );

      console.log(
        "FLIGHT SEARCH RESPONSE:",
        response.data
      );

      const result = Array.isArray(response.data)
        ? response.data
        : [];

      setFlights(result);

    } catch (error) {
      console.error(
        "Flight Search Error:",
        error
      );

      setFlights([]);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Unable to search flights."
        );
      } else {
        alert(
          "Unable to connect to backend."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VIEW ROUTE
  // =====================================================

  const viewRoute = async (flight) => {
    console.log(
      "VIEW ROUTE FLIGHT:",
      flight
    );

    // -------------------------------------------------
    // ROUTE CHECK
    // -------------------------------------------------

    if (
      !flight ||
      !flight.route ||
      !flight.route.id
    ) {
      alert(
        "Route information is not available for this flight."
      );

      return;
    }

    const routeId = flight.route.id;

    console.log(
      "ROUTE ID:",
      routeId
    );

    // -------------------------------------------------
    // OPEN MODAL
    // -------------------------------------------------

    setSelectedRoute(flight.route);

    setRouteStops([]);

    setShowRoute(true);

    setRouteLoading(true);

    // -------------------------------------------------
    // LOAD ROUTE STOPS
    // -------------------------------------------------

    try {
      const response = await API.get(
        `/api/routes/${routeId}/stops`
      );

      console.log(
        "ROUTE STOPS RESPONSE:",
        response.data
      );

      const stops = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      // Sort according to stop order
      stops.sort(
        (a, b) =>
          Number(a.stopOrder || 0) -
          Number(b.stopOrder || 0)
      );

      setRouteStops(stops);

    } catch (error) {
      console.error(
        "Route Load Error:",
        error
      );

      setRouteStops([]);

      if (error.response) {
        console.error(
          "Route API Error:",
          error.response.data
        );
      }

      alert(
        "Unable to load route stops."
      );

    } finally {
      setRouteLoading(false);
    }
  };

  // =====================================================
  // CLOSE / BACK ROUTE
  // =====================================================

  const closeRoute = () => {
    setShowRoute(false);

    setSelectedRoute(null);

    setRouteStops([]);

    setRouteLoading(false);
  };

  // =====================================================
  // BOOK FLIGHT
  // =====================================================

  const bookFlight = (flight) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);

      setUserRole("");

      alert(
        "Please login first to continue booking."
      );

      navigate("/login");

      return;
    }

    setIsLoggedIn(true);

    if (!flight) {
      alert(
        "Flight information is missing."
      );

      return;
    }

    if (!flight.id) {
      console.error(
        "Flight does not contain ID:",
        flight
      );

      alert("Flight ID is missing.");

      return;
    }

    // =================================================
    // NORMALIZE FLIGHT
    // =================================================

    const selectedFlight = {
      ...flight,

      id: Number(flight.id),

      airlineName:
        flight.airlineName ||
        flight.airline ||
        "Airline",

      flightNumber:
        flight.flightNumber ||
        flight.flightNo ||
        "--",

      source:
        flight.source ||
        flight.sourceAirport?.city ||
        from,

      destination:
        flight.destination ||
        flight.destinationAirport?.city ||
        to,

      departureTime:
        flight.departureTime ||
        flight.departure ||
        "--",

      arrivalTime:
        flight.arrivalTime ||
        flight.arrival ||
        "--",

      price: Number(
        flight.price ??
        flight.economyPrice ??
        0
      ),

      economyPrice: Number(
        flight.economyPrice ??
        flight.price ??
        0
      ),

      premiumEconomyPrice: Number(
        flight.premiumEconomyPrice ?? 0
      ),

      businessPrice: Number(
        flight.businessPrice ?? 0
      ),

      firstClassPrice: Number(
        flight.firstClassPrice ?? 0
      ),

      availableSeats:
        flight.availableSeats ??
        flight.seatsAvailable ??
        0,

      totalSeats:
        flight.totalSeats ?? 52,
    };

    console.log(
      "Selected Flight:",
      selectedFlight
    );

    // =================================================
    // GO TO BOOKING
    // =================================================

    navigate("/booking", {
      state: {
        flight: selectedFlight,

        flightId: selectedFlight.id,

        from: selectedFlight.source,

        to: selectedFlight.destination,

        travelDate: date,

        passengers: Number(passengers),
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="home">

      {/* =================================================
          NAVBAR
      ================================================= */}

	  <nav className="navbar">

	    {/* LOGO */}
	    <div className="logo">
	      ✈ Airline Reservation
	    </div>

	    {/* PROFILE BUTTON */}
	    {localStorage.getItem("token") && (
	      <button
	        type="button"
	        className="profile-circle"
	        onClick={() => navigate("/profile")}
	        title="My Profile"
	      >
	        👤
	      </button>
	    )}

	    {/* NAVIGATION BUTTONS */}
	    <div className="nav-links">

	      {/* HOME */}
	      <button
	        type="button"
	        onClick={() => navigate("/")}
	        style={{
	          ...navButtonStyle,
	          background: "#2563eb",
	          color: "white",
	        }}
	      >
	        🏠 Home
	      </button>

	      {/* MY BOOKINGS */}
	      <button
	        type="button"
	        onClick={handleMyBookings}
	        style={{
	          ...navButtonStyle,
	          background: "#7c3aed",
	          color: "white",
	        }}
	      >
	        📋 My Bookings
	      </button>

	      {/* CREATE USER */}
	      <button
	        type="button"
	        onClick={() => navigate("/create-user")}
	        style={{
	          ...navButtonStyle,
	          background: "#16a34a",
	          color: "white",
	        }}
	      >
	        👤 Create User
	      </button>

	      {/* ADMIN DASHBOARD */}
	      {isAdmin && (
	        <button
	          type="button"
	          onClick={() => navigate("/admin/dashboard")}
	          style={{
	            ...navButtonStyle,
	            background: "#111827",
	            color: "white",
	          }}
	        >
	          📊 Admin Dashboard
	        </button>
	      )}

	      {/* LOGIN / LOGOUT */}
	      {!isLoggedIn ? (
	        <button
	          type="button"
	          onClick={() => navigate("/login")}
	          style={{
	            ...navButtonStyle,
	            background: "#0066ff",
	            color: "white",
	          }}
	        >
	          Login
	        </button>
	      ) : (
	        <button
	          type="button"
	          onClick={handleLogout}
	          style={{
	            ...navButtonStyle,
	            background: "#dc2626",
	            color: "white",
	          }}
	        >
	          Logout
	        </button>
	      )}

	    </div>
	  </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <h1
            style={{
              marginBottom: "12px",
              color: "#1d4ed8",
            }}
          >
            Book Your Flight
          </h1>

          <p
            style={{
              marginTop: "0",
              color: "#4b5563",
            }}
          >
            Search and book flights easily with
            our Airline Reservation System
          </p>

          {/* =================================================
              SEARCH CARD
          ================================================= */}

          <div className="search-card">

            {/* FROM */}

            <div
              className="field"
              style={fieldStyle}
            >
              <label style={labelStyle}>
                From
              </label>

              <select
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                style={selectStyle}
              >
                <option value="">
                  Select departure city
                </option>

                {airports.map(
                  (airport) => (
                    <option
                      key={airport}
                      value={airport}
                    >
                      {airport}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* TO */}

            <div
              className="field"
              style={fieldStyle}
            >
              <label style={labelStyle}>
                To
              </label>

              <select
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                style={selectStyle}
              >
                <option value="">
                  Select destination city
                </option>

                {airports.map(
                  (airport) => (
                    <option
                      key={airport}
                      value={airport}
                    >
                      {airport}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* DATE */}

            <div
              className="field"
              style={fieldStyle}
            >
              <label style={labelStyle}>
                Date
              </label>

              <input
                type="date"
                value={date}
                min={getTodayDate()}
                max={getMaxBookingDate()}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                style={inputStyle}
              />
            </div>

            {/* PASSENGERS */}

            <div
              className="field"
              style={fieldStyle}
            >
              <label style={labelStyle}>
                Passengers
              </label>

              <select
                value={passengers}
                onChange={(e) =>
                  setPassengers(
                    Number(e.target.value)
                  )
                }
                style={selectStyle}
              >
                {Array.from(
                  { length: 10 },
                  (_, index) =>
                    index + 1
                ).map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SEARCH */}

            <button
              type="button"
              className="search-btn"
              onClick={searchFlights}
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Flights"}
            </button>

          </div>
        </div>
      </section>

      {/* =================================================
          FEATURES
      ================================================= */}

      {!searched && (
        <section className="features">

          {/* EASY BOOKING */}

          <div className="feature-card">

            <h3>
              ✈ Easy Booking
            </h3>

            <p>
              Search and book your preferred
              flights quickly and easily.
            </p>

            <button
              type="button"
              onClick={handleEasyBooking}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: "#0066ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✈ Start Booking
            </button>

          </div>

          {/* SECURE */}

          <div className="feature-card">

            <h3>
              🔒 Secure
            </h3>

            <p>
              Your account and booking information
              is protected with JWT authentication.
            </p>

            <button
              type="button"
              onClick={handleSecure}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔒 View Security
            </button>

          </div>

          {/* MY BOOKINGS */}

          <div className="feature-card">

            <h3>
              📋 My Bookings
            </h3>

            <p>
              View and manage your flight
              bookings in one place.
            </p>

            <button
              type="button"
              onClick={handleMyBookings}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📋 View Bookings
            </button>

          </div>

          {/* CREATE ACCOUNT */}

          <div className="feature-card">

            <h3>
              👤 Create Account
            </h3>

            <p>
              Create your airline reservation
              account to book flights.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/create-user")
              }
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              👤 Create User
            </button>

          </div>

        </section>
      )}

      {/* =================================================
          FLIGHT RESULTS
      ================================================= */}

      {searched && (
        <section className="flight-results">

          <h2>
            Available Flights
          </h2>

          <p className="route">
            {from || "--"}
            {" → "}
            {to || "--"}

            {date && (
              <>
                {" | "}
                {date}
              </>
            )}

            {" | "}
            {passengers}
            {" Passenger(s)"}
          </p>

          {/* LOADING */}

          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
              }}
            >
              <p>
                Searching flights...
              </p>
            </div>
          )}

          {/* NO FLIGHTS */}

          {!loading &&
            flights.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                <h3>
                  No flights available
                </h3>

                <p>
                  No flights found from{" "}
                  <strong>
                    {from}
                  </strong>
                  {" "}to{" "}
                  <strong>
                    {to}
                  </strong>
                  {" "}for{" "}
                  <strong>
                    {date}
                  </strong>.
                </p>
              </div>
            )}

          {/* FLIGHT LIST */}

          {!loading &&
            flights.length > 0 && (
              <div className="flight-list">

                {flights.map(
                  (flight) => {

                    const airlineName =
                      flight.airlineName ||
                      flight.airline ||
                      "Airline";

                    const flightNumber =
                      flight.flightNumber ||
                      flight.flightNo ||
                      "--";

                    const source =
                      flight.source ||
                      flight.sourceAirport?.city ||
                      from ||
                      "--";

                    const destination =
                      flight.destination ||
                      flight.destinationAirport?.city ||
                      to ||
                      "--";

                    const departureTime =
                      flight.departureTime ||
                      flight.departure ||
                      "--";

                    const arrivalTime =
                      flight.arrivalTime ||
                      flight.arrival ||
                      "--";

                    const availableSeats =
                      flight.availableSeats ??
                      flight.seatsAvailable ??
                      0;

                    const hasRoute =
                      flight.route &&
                      flight.route.id;

                    return (
                      <div
                        className="flight-card"
                        key={flight.id}
                      >

                        {/* AIRLINE */}

                        <div>
                          <h3>
                            {airlineName}
                          </h3>

                          <p>
                            {flightNumber}
                          </p>
                        </div>

                        {/* SOURCE */}

                        <div>
                          <h3>
                            {departureTime}
                          </h3>

                          <p>
                            {source}
                          </p>
                        </div>

                        {/* ARROW */}

                        <div className="arrow">
                          →
                        </div>

                        {/* DESTINATION */}

                        <div>
                          <h3>
                            {arrivalTime}
                          </h3>

                          <p>
                            {destination}
                          </p>
                        </div>

                        {/* FARE / BUTTONS */}

                        <div
                          className="flight-fare-section"
                          style={{
                            textAlign: "center",
                            minWidth: "210px",
                          }}
                        >

                          <div
                            style={{
                              color: "#6b7280",
                              fontSize: "15px",
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            Select seat to view fare
                          </div>

                          <div
                            style={{
                              color: "#555",
                              fontSize: "13px",
                              marginBottom: "12px",
                            }}
                          >
                            Seats:{" "}
                            {availableSeats}
                          </div>

                          {/* BUTTONS */}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >

                            {/* VIEW ROUTE */}

                            <button
                              type="button"
                              onClick={() =>
                                viewRoute(
                                  flight
                                )
                              }
                              disabled={
                                !hasRoute
                              }
                              style={{
                                background:
                                  hasRoute
                                    ? "#7c3aed"
                                    : "#9ca3af",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                padding: "10px 13px",
                                cursor:
                                  hasRoute
                                    ? "pointer"
                                    : "not-allowed",
                                fontWeight: "600",
                              }}
                            >
                              🗺️ View Route
                            </button>

                            {/* BOOK NOW */}

                            <button
                              type="button"
                              className="book-btn"
                              onClick={() =>
                                bookFlight(
                                  flight
                                )
                              }
                            >
                              ✈ Book Now
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </section>
      )}

      {/* =================================================
          ROUTE MODAL
      ================================================= */}

      {showRoute && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >

          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "550px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "14px",
              padding: "60px 30px 30px 30px",
              boxShadow:
                "0 10px 35px rgba(0,0,0,0.25)",
              position: "relative",
              boxSizing: "border-box",
            }}
          >

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={closeRoute}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "9px 16px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              ← Back
            </button>

            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={closeRoute}
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                border: "none",
                background: "#f3f4f6",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            {/* =================================================
                TITLE
            ================================================= */}

            <h2
              style={{
                marginTop: 0,
                color: "#1d4ed8",
                textAlign: "center",
              }}
            >
              ✈️ Flight Route
            </h2>

            {/* =================================================
                ROUTE NAME
            ================================================= */}

            {selectedRoute &&
              selectedRoute.routeName && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    marginBottom: "25px",
                    fontWeight: "600",
                  }}
                >
                  {selectedRoute.routeName}
                </p>
              )}

            {/* =================================================
                ROUTE
            ================================================= */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >

              {/* SOURCE */}

              {selectedRoute &&
                selectedRoute.sourceAirport && (
                  <RoutePoint
                    city={
                      selectedRoute
                        .sourceAirport
                        .city
                    }
                    code={
                      selectedRoute
                        .sourceAirport
                        .airportCode
                    }
                    type="SOURCE"
                  />
                )}

              {/* SOURCE LINE */}

              {selectedRoute && (
                <RouteLine />
              )}

              {/* LOADING */}

              {routeLoading && (
                <div
                  style={{
                    padding: "15px",
                    color: "#6b7280",
                  }}
                >
                  Loading route...
                </div>
              )}

              {/* STOPS */}

              {!routeLoading &&
                routeStops.length > 0 &&
                routeStops.map(
                  (stop, index) => (
                    <div
                      key={
                        stop.id ||
                        index
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >

                      <RoutePoint
                        city={
                          stop.city ||
                          "Unknown City"
                        }
                        type={`STOP ${
                          stop.stopOrder ||
                          index + 1
                        }`}
                      />

                      <RouteLine />

                    </div>
                  )
                )}

              {/* DESTINATION */}

              {selectedRoute &&
                selectedRoute.destinationAirport && (
                  <RoutePoint
                    city={
                      selectedRoute
                        .destinationAirport
                        .city
                    }
                    code={
                      selectedRoute
                        .destinationAirport
                        .airportCode
                    }
                    type="DESTINATION"
                  />
                )}

              {/* NO STOPS MESSAGE */}

              {!routeLoading &&
                routeStops.length === 0 && (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "14px",
                      margin: "0 0 15px 0",
                    }}
                  >
                    No intermediate stops.
                  </p>
                )}

            </div>

            {/* =================================================
                BOTTOM BACK BUTTON
            ================================================= */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
              }}
            >

              <button
                type="button"
                onClick={closeRoute}
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 30px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                ← Back
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// =====================================================
// ROUTE POINT COMPONENT
// =====================================================

function RoutePoint({
  city,
  code,
  type,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px 20px",
        minWidth: "220px",
      }}
    >

      {/* DOT */}

      <div
        style={{
          width: "18px",
          height: "18px",
          background: "#2563eb",
          borderRadius: "50%",
          margin: "0 auto 8px",
          border: "4px solid #dbeafe",
          boxSizing: "content-box",
        }}
      />

      {/* CITY */}

      <div
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {city}
      </div>

      {/* AIRPORT CODE */}

      {code && (
        <div
          style={{
            color: "#6b7280",
            fontSize: "14px",
            marginTop: "3px",
          }}
        >
          {code}
        </div>
      )}

      {/* TYPE */}

      {type && (
        <div
          style={{
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: "700",
            marginTop: "4px",
            textTransform: "uppercase",
          }}
        >
          {type}
        </div>
      )}

    </div>
  );
}

// =====================================================
// ROUTE LINE
// =====================================================

function RouteLine() {
  return (
    <div
      style={{
        height: "35px",
        borderLeft: "3px dashed #93c5fd",
        margin: "0 auto",
      }}
    />
  );
}

// =====================================================
// NAV BUTTON STYLE
// =====================================================

const navButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  padding: "8px 12px",
};

// =====================================================
// FIELD STYLE
// =====================================================

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  minHeight: "80px",
  flex: "1",
};

// =====================================================
// LABEL STYLE
// =====================================================

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "24px",
};

// =====================================================
// SELECT STYLE
// =====================================================

const selectStyle = {
  width: "100%",
  height: "52px",
  padding: "0 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "16px",
  boxSizing: "border-box",
  background: "white",
  cursor: "pointer",
  outline: "none",
};

// =====================================================
// DATE INPUT STYLE
// =====================================================

const inputStyle = {
  width: "100%",
  height: "52px",
  padding: "0 12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "16px",
  boxSizing: "border-box",
  background: "white",
  cursor: "pointer",
  outline: "none",
};

export default Home;