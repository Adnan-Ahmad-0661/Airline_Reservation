import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "http://localhost:8080";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // GET BOOKING DATA
  // =====================================================

  const bookingData = location.state || {};

  const flight = bookingData.flight || null;

  const flightId = Number(
    bookingData.flightId ||
      flight?.id ||
      0
  );

  const from =
    bookingData.from ||
    flight?.source ||
    "";

  const to =
    bookingData.to ||
    flight?.destination ||
    "";

  const travelDate =
    bookingData.travelDate ||
    "";

  const passengers =
    Number(bookingData.passengers) || 1;

  const passengerId =
    Number(bookingData.passengerId) || 0;

  const passengerName =
    bookingData.passengerName || "";

  const passengerAge =
    bookingData.passengerAge || "";

  const passengerGender =
    bookingData.passengerGender || "";

  const passportNumber =
    bookingData.passportNumber || "";

  const selectedSeats =
    Array.isArray(bookingData.selectedSeats)
      ? bookingData.selectedSeats
      : [];

  // =====================================================
  // PAYMENT STATE
  // =====================================================

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // PRICE
  // =====================================================

  const pricePerSeat =
    Number(flight?.price || 0);

  const totalPrice =
    pricePerSeat * selectedSeats.length;

  // =====================================================
  // DEBUG
  // =====================================================

  console.log("==========================================");
  console.log("PAYMENT PAGE");
  console.log("==========================================");

  console.log("Flight:", flight);
  console.log("Flight ID:", flightId);
  console.log("Passenger ID:", passengerId);
  console.log("Passenger Name:", passengerName);
  console.log("From:", from);
  console.log("To:", to);
  console.log("Travel Date:", travelDate);
  console.log("Passengers:", passengers);
  console.log("Selected Seats:", selectedSeats);
  console.log("Price Per Seat:", pricePerSeat);
  console.log("Total Price:", totalPrice);

  console.log("==========================================");

  // =====================================================
  // BOOKING DATA CHECK
  // =====================================================

  if (
    !flight ||
    !flightId ||
    !passengerId ||
    selectedSeats.length === 0
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
          fontFamily: "Arial, sans-serif",
          padding: "20px"
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.10)",
            maxWidth: "500px",
            width: "100%"
          }}
        >
          <h2>
            Booking Information Missing
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: "10px"
            }}
          >
            Your booking session is incomplete.
            Please select the flight and complete
            passenger and seat selection again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              marginTop: "20px",
              padding: "12px 25px",
              background: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAYMENT / BOOKING
  // =====================================================

  const handlePayment = async () => {

    // ===================================================
    // CARD VALIDATION
    // ===================================================

    if (!cardName.trim()) {
      alert("Please enter card holder name.");
      return;
    }

    if (!cardNumber.trim()) {
      alert("Please enter card number.");
      return;
    }

    if (!expiry.trim()) {
      alert("Please enter expiry date.");
      return;
    }

    if (!cvv.trim()) {
      alert("Please enter CVV.");
      return;
    }

    // ===================================================
    // GET JWT TOKEN
    // ===================================================

    const token =
      localStorage.getItem("token");

    console.log(
      "JWT Token:",
      token ? "FOUND" : "NOT FOUND"
    );

    if (!token) {

      alert(
        "Access denied. Please login again."
      );

      navigate("/login");

      return;
    }

    // ===================================================
    // FLIGHT CHECK
    // ===================================================

    if (!flightId) {

      alert(
        "Flight ID missing."
      );

      return;
    }

    // ===================================================
    // PASSENGER CHECK
    // ===================================================

    if (!passengerId) {

      alert(
        "Passenger ID missing."
      );

      return;
    }

    // ===================================================
    // SEAT CHECK
    // ===================================================

    if (
      selectedSeats.length === 0
    ) {

      alert(
        "Please select at least one seat."
      );

      return;
    }

    // ===================================================
    // START BOOKING
    // ===================================================

    try {

      setLoading(true);

      console.log(
        "=========================================="
      );

      console.log(
        "STARTING BOOKING"
      );

      console.log(
        "Flight ID:",
        flightId
      );

      console.log(
        "Passenger ID:",
        passengerId
      );

      console.log(
        "Selected Seats:",
        selectedSeats
      );

      console.log(
        "Token Present:",
        !!token
      );

      console.log(
        "=========================================="
      );

      const bookings = [];

      // =================================================
      // BOOK EACH SELECTED SEAT
      // =================================================

      for (
        const seat of selectedSeats
      ) {

        console.log(
          "================================"
        );

        console.log(
          "BOOKING SEAT:",
          seat
        );

        // -----------------------------------------------
        // URL
        // -----------------------------------------------

        const url =
          `${API_URL}/api/bookings` +
          `?flightId=${encodeURIComponent(
            flightId
          )}` +
          `&passengerId=${encodeURIComponent(
            passengerId
          )}` +
          `&seatNumber=${encodeURIComponent(
            seat
          )}`;

        console.log(
          "BOOKING URL:",
          url
        );

        // -----------------------------------------------
        // API REQUEST
        // -----------------------------------------------

        const response =
          await fetch(
            url,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "Authorization":
                  `Bearer ${token}`
              }
            }
          );

        // -----------------------------------------------
        // RESPONSE
        // -----------------------------------------------

        const responseText =
          await response.text();

        console.log(
          "HTTP STATUS:",
          response.status
        );

        console.log(
          "RESPONSE:",
          responseText
        );

        // -----------------------------------------------
        // 401 / 403
        // -----------------------------------------------

        if (
          response.status === 401 ||
          response.status === 403
        ) {

          console.error(
            "JWT / AUTHORIZATION ERROR"
          );

          throw new Error(
            `Access denied (${response.status}). Please login again.`
          );
        }

        // -----------------------------------------------
        // OTHER ERROR
        // -----------------------------------------------

        if (!response.ok) {

          throw new Error(
            responseText ||
            `Booking failed for seat ${seat}`
          );
        }

        // -----------------------------------------------
        // PARSE BOOKING
        // -----------------------------------------------

        let booking;

        try {

          booking =
            JSON.parse(
              responseText
            );

        } catch (error) {

          console.error(
            "JSON PARSE ERROR:",
            error
          );

          throw new Error(
            "Invalid response received from booking API.", { cause: error }
          );
        }

        console.log(
          "BOOKING CREATED:",
          booking
        );

        bookings.push(
          booking
        );
      }

      // =================================================
      // ALL BOOKINGS SUCCESSFUL
      // =================================================

      console.log(
        "=========================================="
      );

      console.log(
        "ALL BOOKINGS CREATED SUCCESSFULLY"
      );

      console.log(
        "Bookings:",
        bookings
      );

      console.log(
        "=========================================="
      );

      alert(
        `${selectedSeats.length} seat(s) booked successfully!`
      );

      // =================================================
      // GO TO CONFIRMATION
      // =================================================

      navigate(
        "/confirmation",
        {
          state: {

            bookings,

            flight,

            flightId,

            from,

            to,

            travelDate,

            passengers,

            passengerId,

            passengerName,

            passengerAge,

            passengerGender,

            passportNumber,

            selectedSeats,

            pricePerSeat,

            totalPrice
          }
        }
      );

    } catch (error) {

      console.error(
        "Payment / Booking Error:",
        error
      );

      alert(
        error.message ||
        "Payment/Booking failed. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef4ff, #f8fafc)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >

      <div
        style={{
          maxWidth: "1050px",
          margin: "auto"
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <h1>
          Payment
        </h1>

        <p
          style={{
            color: "#666"
          }}
        >
          Complete your payment to confirm your booking.
        </p>


        {/* =================================================
            MAIN
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "25px",
            marginTop: "30px"
          }}
        >

          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)"
            }}
          >

            <h2>
              Booking Summary
            </h2>

            <hr />

            <p>
              <strong>
                Passenger:
              </strong>{" "}
              {passengerName || "--"}
            </p>

            <p>
              <strong>
                Passenger ID:
              </strong>{" "}
              {passengerId}
            </p>

            <p>
              <strong>
                Airline:
              </strong>{" "}
              {flight.airlineName ||
                flight.airline ||
                "--"}
            </p>

            <p>
              <strong>
                Flight Number:
              </strong>{" "}
              {flight.flightNumber ||
                "--"}
            </p>

            <p>
              <strong>
                Flight ID:
              </strong>{" "}
              {flightId}
            </p>

            <p>
              <strong>
                From:
              </strong>{" "}
              {from ||
                flight.source ||
                "--"}
            </p>

            <p>
              <strong>
                To:
              </strong>{" "}
              {to ||
                flight.destination ||
                "--"}
            </p>

            <p>
              <strong>
                Departure:
              </strong>{" "}
              {flight.departureTime ||
                "--"}
            </p>

            <p>
              <strong>
                Arrival:
              </strong>{" "}
              {flight.arrivalTime ||
                "--"}
            </p>

            <p>
              <strong>
                Travel Date:
              </strong>{" "}
              {travelDate || "--"}
            </p>

            <p>
              <strong>
                Passengers:
              </strong>{" "}
              {passengers}
            </p>

            <hr />

            <p>
              <strong>
                Selected Seats:
              </strong>
            </p>

            <div
              style={{
                background: "#eef4ff",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontWeight: "bold"
              }}
            >
              {selectedSeats.join(", ")}
            </div>

            <p>
              <strong>
                Number of Seats:
              </strong>{" "}
              {selectedSeats.length}
            </p>

            <p>
              <strong>
                Price Per Seat:
              </strong>{" "}
              ₹{pricePerSeat}
            </p>

            <hr />

            <div
              style={{
                background: "#f0f7ff",
                padding: "18px",
                borderRadius: "10px"
              }}
            >

              <p
                style={{
                  margin: 0,
                  color: "#666"
                }}
              >
                Total Amount
              </p>

              <h2
                style={{
                  margin: "5px 0 0",
                  color: "#0066ff"
                }}
              >
                ₹{totalPrice}
              </h2>

            </div>

          </div>


          {/* =================================================
              PAYMENT FORM
          ================================================= */}

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)"
            }}
          >

            <h2>
              Payment Details
            </h2>

            <hr />

            {/* CARD HOLDER */}

            <label>
              <strong>
                Card Holder Name
              </strong>
            </label>

            <input
              type="text"
              placeholder="Enter card holder name"
              value={cardName}
              onChange={(e) =>
                setCardName(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                margin:
                  "8px 0 20px",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            />


            {/* CARD NUMBER */}

            <label>
              <strong>
                Card Number
              </strong>
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                margin:
                  "8px 0 20px",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            />


            {/* EXPIRY */}

            <label>
              <strong>
                Expiry Date
              </strong>
            </label>

            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) =>
                setExpiry(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                margin:
                  "8px 0 20px",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            />


            {/* CVV */}

            <label>
              <strong>
                CVV
              </strong>
            </label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={cvv}
              onChange={(e) =>
                setCvv(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "13px",
                margin:
                  "8px 0 25px",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px"
              }}
            />


            {/* =================================================
                PAY BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background:
                  loading
                    ? "#9ca3af"
                    : "#0066ff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${totalPrice}`}
            </button>


            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                background: "#e5e7eb",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              ← Back
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Payment;