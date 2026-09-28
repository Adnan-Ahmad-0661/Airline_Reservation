
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ViewTicket() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH BOOKING
  // =========================================

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        console.log("========== VIEW TICKET ==========");
        console.log("Booking ID:", bookingId);

        if (!bookingId) {
          setError("Booking ID not found");
          return;
        }

        // IMPORTANT:
        // API instance use kar rahe hain.
        // api.js interceptor automatically JWT token
        // Authorization header me attach karega.

        const response = await API.get(
          `/api/bookings/${bookingId}`
        );

        console.log(
          "Response Status:",
          response.status
        );

        console.log(
          "Booking Data:",
          response.data
        );

        setBooking(response.data);
      } catch (err) {
        console.error(
          "View Ticket Error:",
          err
        );

        // =====================================
        // 401 UNAUTHORIZED
        // =====================================

        if (err.response?.status === 401) {
          alert(
            "Session expired. Please login again."
          );

          localStorage.clear();

          navigate("/login");

          return;
        }

        // =====================================
        // 403 FORBIDDEN
        // =====================================

        if (err.response?.status === 403) {
          setError(
            "You are not allowed to view this booking."
          );

          return;
        }

        // =====================================
        // 404 NOT FOUND
        // =====================================

        if (err.response?.status === 404) {
          setError("Booking not found.");

          return;
        }

        // =====================================
        // OTHER ERROR
        // =====================================

        setError(
          err.response?.data?.message ||
            "Unable to load ticket"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  // =========================================
  // PRINT TICKET
  // =========================================

  const handlePrint = () => {
    window.print();
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Loading Ticket...</h2>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !booking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow:
              "0 3px 15px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h2>Ticket Not Found</h2>

          <p
            style={{
              color: "#666",
              marginBottom: "25px",
            }}
          >
            {error ||
              "Booking information is not available."}
          </p>

          <button
            onClick={() =>
              navigate("/my-bookings")
            }
            style={{
              padding: "12px 25px",
              background: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // BOOKING DATA
  // =========================================

  const passenger = booking.passenger;
  const flight = booking.flight;

  // =========================================
  // FLIGHT DATA
  // =========================================

  const airlineName =
    flight?.airlineName ||
    flight?.airline ||
    "-";

  const flightNumber =
    flight?.flightNumber || "-";

  const sourceAirport =
    flight?.sourceAirport?.name ||
    flight?.sourceAirport?.airportName ||
    flight?.sourceAirport?.code ||
    flight?.sourceAirport ||
    "-";

  const destinationAirport =
    flight?.destinationAirport?.name ||
    flight?.destinationAirport?.airportName ||
    flight?.destinationAirport?.code ||
    flight?.destinationAirport ||
    "-";

  // =========================================
  // STATUS
  // =========================================

  const isConfirmed =
    booking.status === "CONFIRMED";

  const isCancelled =
    booking.status === "CANCELLED";

  // =========================================
  // RETURN UI
  // =========================================

  return (
    <>
      {/* =====================================
          PRINT CSS
      ===================================== */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
              margin: 0;
              padding: 0;
            }

            .no-print {
              display: none !important;
            }

            .ticket-page {
              background: white !important;
              padding: 0 !important;
              min-height: auto !important;
            }

            .ticket-container {
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 !important;
            }

            .ticket {
              box-shadow: none !important;
              border: 1px solid #ccc !important;
              border-radius: 0 !important;
              padding: 25px !important;
            }

            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `}
      </style>

      {/* =====================================
          PAGE
      ===================================== */}

      <div
        className="ticket-page"
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          className="ticket-container"
          style={{
            maxWidth: "850px",
            margin: "0 auto",
          }}
        >
          {/* =====================================
              TICKET
          ===================================== */}

          <div
            className="ticket"
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "35px",
              boxShadow:
                "0 3px 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* =====================================
                HEADER
            ===================================== */}

            <div
              style={{
                textAlign: "center",
                borderBottom:
                  "2px dashed #ccc",
                paddingBottom: "25px",
              }}
            >
              <h1
                style={{
                  color: "#0066ff",
                  marginBottom: "10px",
                }}
              >
                ✈ Flight Ticket
              </h1>

              <h2
                style={{
                  color: isConfirmed
                    ? "#16a34a"
                    : isCancelled
                    ? "#dc2626"
                    : "#f59e0b",
                  marginBottom: "10px",
                }}
              >
                {booking.status || "-"}
              </h2>

              <p
                style={{
                  color: "#666",
                  margin: 0,
                }}
              >
                {isConfirmed
                  ? "Your flight booking is confirmed."
                  : isCancelled
                  ? "This booking has been cancelled."
                  : "This booking is not confirmed."}
              </p>
            </div>

            {/* =====================================
                FLIGHT DETAILS
            ===================================== */}

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "10px",
              }}
            >
              <h2>✈ Flight Details</h2>

              <hr />

              <h2
                style={{
                  textAlign: "center",
                  margin: "25px 0",
                }}
              >
                {sourceAirport} →{" "}
                {destinationAirport}
              </h2>

              <p>
                <strong>Airline:</strong>{" "}
                {airlineName}
              </p>

              <p>
                <strong>Flight Number:</strong>{" "}
                {flightNumber}
              </p>

              <p>
                <strong>Flight ID:</strong>{" "}
                {flight?.id || "-"}
              </p>
            </div>

            {/* =====================================
                PASSENGER DETAILS
            ===================================== */}

            <div
              style={{
                marginTop: "30px",
              }}
            >
              <h2>Passenger Details</h2>

              <hr />

              <p>
                <strong>Name:</strong>{" "}
                {passenger?.name || "-"}
              </p>

              <p>
                <strong>Passenger ID:</strong>{" "}
                {passenger?.id ||
                  booking.passengerId ||
                  "-"}
              </p>

              <p>
                <strong>Age:</strong>{" "}
                {passenger?.age ?? "-"}
              </p>

              <p>
                <strong>Gender:</strong>{" "}
                {passenger?.gender || "-"}
              </p>
            </div>

            {/* =====================================
                BOOKING DETAILS
            ===================================== */}

            <div
              style={{
                marginTop: "30px",
              }}
            >
              <h2>Booking Details</h2>

              <hr />

              <p>
                <strong>PNR:</strong>{" "}
                {booking.pnr || "-"}
              </p>

              <p>
                <strong>Seat Number:</strong>{" "}
                {booking.seatNumber || "-"}
              </p>

              <p>
                <strong>Booking ID:</strong>{" "}
                {booking.id || "-"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                ₹{booking.amount ?? 0}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: isConfirmed
                      ? "#16a34a"
                      : isCancelled
                      ? "#dc2626"
                      : "#f59e0b",
                    fontWeight: "bold",
                  }}
                >
                  {booking.status || "-"}
                </span>
              </p>

              <p>
                <strong>Booking Date:</strong>{" "}
                {booking.bookingDate
                  ? new Date(
                      booking.bookingDate
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>

            {/* =====================================
                BUTTONS
            ===================================== */}

            <div
              className="no-print"
              style={{
                marginTop: "35px",
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* PRINT */}

              <button
                onClick={handlePrint}
                style={{
                  padding: "13px 25px",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                🖨 Print / Save PDF
              </button>

              {/* MY BOOKINGS */}

              <button
                onClick={() =>
                  navigate("/my-bookings")
                }
                style={{
                  padding: "13px 25px",
                  background: "#0066ff",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                My Bookings
              </button>

              {/* HOME */}

              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "13px 25px",
                  background: "#e5e7eb",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewTicket;