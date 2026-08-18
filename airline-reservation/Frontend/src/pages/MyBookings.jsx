import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH MY BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      console.log("====================================");
      console.log("FETCHING MY BOOKINGS");
      console.log("API: GET /api/bookings/my");
      console.log("====================================");

      /*
       * IMPORTANT:
       *
       * Backend JWT se logged-in user ko identify karega.
       *
       * Isliye yahan userId bhejne ki zarurat nahi hai.
       *
       * Backend:
       * Authentication authentication
       *        ↓
       * authentication.getName()
       *        ↓
       * email
       *        ↓
       * UserRepository.findByEmail()
       *        ↓
       * user.getId()
       */

      const response = await API.get(
        "/api/bookings/my"
      );

      console.log(
        "MY BOOKINGS STATUS:",
        response.status
      );

      console.log(
        "MY BOOKINGS RESPONSE:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      // =================================================
      // DEBUG BOOKINGS
      // =================================================

      console.log(
        "========== MY BOOKINGS =========="
      );

      data.forEach((booking) => {
        console.log(
          "Booking ID:",
          booking?.id
        );

        console.log(
          "PNR:",
          booking?.pnr
        );

        console.log(
          "Flight ID:",
          booking?.flight?.id
        );

        console.log(
          "Flight Number:",
          booking?.flight?.flightNumber
        );

        console.log(
          "Airline:",
          booking?.flight?.airlineName
        );

        console.log(
          "Source:",
          booking?.flight?.source
        );

        console.log(
          "Destination:",
          booking?.flight?.destination
        );

        console.log(
          "Seat:",
          booking?.seatNumber
        );

        console.log(
          "Passenger:",
          booking?.passenger?.name
        );

        console.log(
          "Amount:",
          booking?.amount
        );

        console.log(
          "Status:",
          booking?.status
        );

        console.log(
          "Booking Date:",
          booking?.bookingDate
        );

        console.log(
          "--------------------------------"
        );
      });

      console.log(
        "================================="
      );

      setBookings(data);

    } catch (error) {

      console.error(
        "Booking fetch error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      // =================================================
      // 401
      // =================================================

      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("token");

        navigate("/login");

        return;
      }

      // =================================================
      // 403
      // =================================================

      if (
        error.response?.status === 403
      ) {

        alert(
          "Access denied. Please login again."
        );

        localStorage.removeItem("token");

        navigate("/login");

        return;
      }

      // =================================================
      // OTHER ERROR
      // =================================================

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Unable to fetch bookings.";

      alert(message);

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // CANCEL BOOKING
  // =====================================================

  const handleCancel = async (
    bookingId
  ) => {

    if (!bookingId) {

      alert(
        "Booking ID is missing."
      );

      return;
    }

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmCancel) {
      return;
    }

    try {

      console.log(
        "===================================="
      );

      console.log(
        "CANCELLING BOOKING"
      );

      console.log(
        "Booking ID:",
        bookingId
      );

      console.log(
        "===================================="
      );

      const response =
        await API.put(
          `/api/bookings/cancel/${bookingId}`
        );

      console.log(
        "CANCEL RESPONSE:",
        response.data
      );

      alert(
        "Booking cancelled successfully."
      );

      // Refresh bookings
      await fetchBookings();

    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("token");

        navigate("/login");

        return;
      }

      if (
        error.response?.status === 403
      ) {

        alert(
          "You are not allowed to cancel this booking."
        );

        return;
      }

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Cancellation failed.";

      alert(message);
    }
  };

  // =====================================================
  // VIEW TICKET
  // =====================================================

  const handleViewTicket = (
    booking
  ) => {

    console.log(
      "===================================="
    );

    console.log(
      "VIEW TICKET"
    );

    console.log(
      "Booking:",
      booking
    );

    console.log(
      "Booking ID:",
      booking?.id
    );

    console.log(
      "PNR:",
      booking?.pnr
    );

    console.log(
      "Seat:",
      booking?.seatNumber
    );

    console.log(
      "Flight:",
      booking?.flight
    );

    console.log(
      "Passenger:",
      booking?.passenger
    );

    console.log(
      "===================================="
    );

    if (!booking?.id) {

      alert(
        "Booking ID is missing."
      );

      return;
    }

    navigate(
      `/view-ticket/${booking.id}`
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
          fontFamily:
            "Arial, sans-serif",
        }}
      >

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >

          <h2>
            Loading bookings...
          </h2>

          <p
            style={{
              color: "#666",
            }}
          >
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // UNIQUE FLIGHTS
  // =====================================================

  const flights = [];

  bookings.forEach(
    (booking) => {

      if (!booking?.flight) {
        return;
      }

      const flightId =
        Number(
          booking.flight.id
        );

      if (!flightId) {
        return;
      }

      const alreadyExists =
        flights.some(
          (flight) =>
            Number(flight.id) ===
            flightId
        );

      if (!alreadyExists) {

        flights.push({
          ...booking.flight,
          id: flightId,
        });

      }
    }
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px 20px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >

          <div>
		  <h1
		    style={{
		      color: "#16a34a",
		      marginBottom: "20px",
		      fontWeight: "600"
		    }}
		  >
		    My Bookings
		  </h1>

		  <p
		    style={{
		      color: "#000000",
		      marginTop: "0",
		      fontSize: "16px"
		    }}
		  >
		    View and manage your flight bookings.
		  </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            style={{
              padding:
                "12px 25px",
              background:
                "#0066ff",
              color: "white",
              border: "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            ← Back to Home
          </button>

        </div>

        {/* =================================================
            TWO COLUMN
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "25px",
            alignItems: "start",
          }}
        >

          {/* =================================================
              LEFT - BOOKINGS
          ================================================= */}

          <div>

            {bookings.length === 0 ? (

              <div
                style={{
                  background:
                    "white",
                  padding:
                    "50px 30px",
                  borderRadius:
                    "12px",
                  textAlign:
                    "center",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "50px",
                    marginBottom:
                      "15px",
                  }}
                >
                  ✈️
                </div>

                <h2>
                  No Bookings Found
                </h2>

                <p
                  style={{
                    color:
                      "#666",
                  }}
                >
                  You haven't booked
                  any flights yet.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/")
                  }
                  style={{
                    marginTop:
                      "15px",
                    padding:
                      "12px 25px",
                    background:
                      "#0066ff",
                    color:
                      "white",
                    border:
                      "none",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold",
                  }}
                >
                  Search Flights
                </button>

              </div>

            ) : (

              <div
                style={{
                  display:
                    "grid",
                  gap: "20px",
                }}
              >

                {bookings.map(
                  (booking) => {

                    const isCancelled =
                      String(
                        booking?.status ||
                        ""
                      ).toUpperCase() ===
                      "CANCELLED";

                    const flight =
                      booking?.flight ||
                      {};

                    const passenger =
                      booking?.passenger ||
                      {};

                    const airline =
                      flight.airlineName ||
                      flight.airline ||
                      "Airline";

                    const flightNumber =
                      flight.flightNumber ||
                      "-";

                    const source =
                      flight.source ||
                      flight.from ||
                      "-";

                    const destination =
                      flight.destination ||
                      flight.to ||
                      "-";

                    const departure =
                      flight.departureTime ||
                      "-";

                    const arrival =
                      flight.arrivalTime ||
                      "-";

                    return (

                      <div
                        key={
                          booking?.id
                        }
                        style={{
                          background:
                            "white",
                          padding:
                            "25px",
                          borderRadius:
                            "12px",
                          boxShadow:
                            "0 4px 15px rgba(0,0,0,0.08)",
                        }}
                      >

                        {/* =================================
                            BOOKING HEADER
                        ================================= */}

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap:
                              "15px",
                            flexWrap:
                              "wrap",
                          }}
                        >

                          <div>

                            <h2
                              style={{
                                margin:
                                  0,
                              }}
                            >
                              ✈️{" "}
                              {airline}
                            </h2>

                            <p
                              style={{
                                margin:
                                  "7px 0 0",
                                color:
                                  "#666",
                              }}
                            >
                              Flight{" "}
                              {flightNumber}
                            </p>

                          </div>

                          <span
                            style={{
                              padding:
                                "7px 14px",
                              borderRadius:
                                "20px",
                              background:
                                isCancelled
                                  ? "#fee2e2"
                                  : "#d1fae5",
                              color:
                                isCancelled
                                  ? "#991b1b"
                                  : "#065f46",
                              fontWeight:
                                "bold",
                              fontSize:
                                "13px",
                            }}
                          >
                            {booking?.status ||
                              "CONFIRMED"}
                          </span>

                        </div>

                        <hr
                          style={{
                            margin:
                              "20px 0",
                            border:
                              "none",
                            borderTop:
                              "1px solid #eee",
                          }}
                        />

                        {/* =================================
                            ROUTE
                        ================================= */}

                        <div
                          style={{
                            background:
                              "#f8fafc",
                            padding:
                              "15px",
                            borderRadius:
                              "10px",
                            marginBottom:
                              "18px",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "space-between",
                              gap:
                                "10px",
                            }}
                          >

                            <div>

                              <div
                                style={{
                                  fontSize:
                                    "20px",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                {source}
                              </div>

                              <small
                                style={{
                                  color:
                                    "#777",
                                }}
                              >
                                Departure
                              </small>

                            </div>

                            <div
                              style={{
                                flex:
                                  1,
                                textAlign:
                                  "center",
                                color:
                                  "#0066ff",
                                fontSize:
                                  "22px",
                              }}
                            >
                              ─────✈─────
                            </div>

                            <div
                              style={{
                                textAlign:
                                  "right",
                              }}
                            >

                              <div
                                style={{
                                  fontSize:
                                    "20px",
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                {destination}
                              </div>

                              <small
                                style={{
                                  color:
                                    "#777",
                                }}
                              >
                                Arrival
                              </small>

                            </div>

                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              marginTop:
                                "10px",
                              color:
                                "#666",
                              fontSize:
                                "14px",
                            }}
                          >

                            <span>
                              {departure}
                            </span>

                            <span>
                              {arrival}
                            </span>

                          </div>

                        </div>

                        {/* =================================
                            DETAILS
                        ================================= */}

                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1fr 1fr",
                            gap:
                              "10px 20px",
                          }}
                        >

                          <p>
                            <strong>
                              PNR:
                            </strong>{" "}
                            {booking?.pnr ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Seat:
                            </strong>{" "}
                            {booking?.seatNumber ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Passenger:
                            </strong>{" "}
                            {passenger?.name ||
                              booking?.passengerName ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Passenger ID:
                            </strong>{" "}
                            {passenger?.id ||
                              booking?.passengerId ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Amount:
                            </strong>{" "}
                            ₹
                            {booking?.amount ||
                              0}
                          </p>

                          <p>
                            <strong>
                              Flight ID:
                            </strong>{" "}
                            {flight?.id ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Travel Date:
                            </strong>{" "}
                            {booking?.travelDate ||
                              flight?.travelDate ||
                              "-"}
                          </p>

                          <p>
                            <strong>
                              Booking Date:
                            </strong>{" "}
                            {booking?.bookingDate
                              ? new Date(
                                  booking.bookingDate
                                ).toLocaleString()
                              : "-"}
                          </p>

                        </div>

                        {/* =================================
                            BUTTONS
                        ================================= */}

                        <div
                          style={{
                            marginTop:
                              "20px",
                            display:
                              "flex",
                            gap:
                              "10px",
                            flexWrap:
                              "wrap",
                          }}
                        >

                          {/* CANCEL */}

                          {!isCancelled && (

                            <button
                              type="button"
                              onClick={() =>
                                handleCancel(
                                  booking?.id
                                )
                              }
                              style={{
                                padding:
                                  "10px 20px",
                                background:
                                  "#dc2626",
                                color:
                                  "white",
                                border:
                                  "none",
                                borderRadius:
                                  "7px",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              Cancel Booking
                            </button>

                          )}

                          {/* VIEW TICKET */}

                          <button
                            type="button"
                            onClick={() =>
                              handleViewTicket(
                                booking
                              )
                            }
                            style={{
                              padding:
                                "10px 20px",
                              background:
                                "#0066ff",
                              color:
                                "white",
                              border:
                                "none",
                              borderRadius:
                                "7px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "bold",
                            }}
                          >
                            🎫 View Ticket
                          </button>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>

          {/* =================================================
              RIGHT - AVAILABLE SEATS
          ================================================= */}

          <div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.08)",
                position:
                  "sticky",
                top:
                  "20px",
              }}
            >

              <h2>
                🪑 Available Seats
              </h2>

              <hr />

              {flights.length === 0 ? (

                <p
                  style={{
                    color:
                      "#666",
                  }}
                >
                  No flight information
                  available.
                </p>

              ) : (

                flights.map(
                  (flight) => {

                    const totalSeats =
                      Number(
                        flight.totalSeats ||
                        0
                      );

                    const availableSeats =
                      Number(
                        flight.availableSeats ||
                        0
                      );

                    const bookedSeats =
                      Math.max(
                        0,
                        totalSeats -
                          availableSeats
                      );

                    return (

                      <div
                        key={
                          flight.id
                        }
                        style={{
                          border:
                            "1px solid #ddd",
                          borderRadius:
                            "10px",
                          padding:
                            "18px",
                          marginBottom:
                            "15px",
                        }}
                      >

                        <h3
                          style={{
                            marginTop:
                              0,
                          }}
                        >
                          {flight.airlineName ||
                            flight.airline ||
                            "Airline"}
                        </h3>

                        <p>
                          <strong>
                            Flight:
                          </strong>{" "}
                          {flight.flightNumber ||
                            "-"}
                        </p>

                        <p>
                          <strong>
                            Flight ID:
                          </strong>{" "}
                          {flight.id}
                        </p>

                        <hr />

                        {/* AVAILABLE */}

                        <div
                          style={{
                            background:
                              "#d1fae5",
                            padding:
                              "15px",
                            borderRadius:
                              "8px",
                            marginBottom:
                              "10px",
                          }}
                        >

                          <div
                            style={{
                              fontSize:
                                "30px",
                              fontWeight:
                                "bold",
                              color:
                                "#047857",
                            }}
                          >
                            {availableSeats}
                          </div>

                          <div
                            style={{
                              color:
                                "#065f46",
                            }}
                          >
                            Available Seats
                          </div>

                        </div>

                        {/* BOOKED */}

                        <div
                          style={{
                            background:
                              "#fee2e2",
                            padding:
                              "15px",
                            borderRadius:
                              "8px",
                            marginBottom:
                              "10px",
                          }}
                        >

                          <div
                            style={{
                              fontSize:
                                "24px",
                              fontWeight:
                                "bold",
                              color:
                                "#b91c1c",
                            }}
                          >
                            {bookedSeats}
                          </div>

                          <div
                            style={{
                              color:
                                "#991b1b",
                            }}
                          >
                            Booked Seats
                          </div>

                        </div>

                        {/* TOTAL */}

                        <div
                          style={{
                            background:
                              "#f3f4f6",
                            padding:
                              "15px",
                            borderRadius:
                              "8px",
                          }}
                        >

                          <strong>
                            Total Seats:
                          </strong>{" "}
                          {totalSeats}

                        </div>

                      </div>

                    );

                  }
                )

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyBookings;