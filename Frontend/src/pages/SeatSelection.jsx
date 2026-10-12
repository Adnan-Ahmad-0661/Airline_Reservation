
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // BOOKING DATA
  // =====================================================

  const bookingData = location.state || {};
  const flight = bookingData.flight;

  const flightId = Number(bookingData.flightId || flight?.id || 0);
  const passengers = Math.max(1, Number(bookingData.passengers) || 1);

  const from =
    bookingData.from ||
    flight?.source ||
    flight?.sourceAirport?.airportName ||
    flight?.sourceAirport?.airportCode ||
    "";

  const to =
    bookingData.to ||
    flight?.destination ||
    flight?.destinationAirport?.airportName ||
    flight?.destinationAirport?.airportCode ||
    "";

  const travelDate = bookingData.travelDate || "";

  // Each passenger must have their own ID.
  const passengerDetails = Array.isArray(bookingData.passengerDetails)
    ? bookingData.passengerDetails
    : [];

  const allPassengersHaveIds =
    passengerDetails.length === passengers &&
    passengerDetails.every((passenger) => Number(passenger.passengerId) > 0);

  // =====================================================
  // SEAT STATE
  // =====================================================

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  // =====================================================
  // STYLES — ORIGINAL THEME PRESERVED
  // =====================================================

  const primaryButtonStyle = {
    padding: "13px 18px",
    background: "#0866ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  };

  const secondaryButtonStyle = {
    padding: "13px 18px",
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  };

  // =====================================================
  // SEAT LAYOUT
  // =====================================================

  const seats = Array.from({ length: 52 }, (_, index) => {
    const row = Math.floor(index / 4) + 1;
    const column = ["A", "B", "C", "D"][index % 4];
    return `${row}${column}`;
  });

  // =====================================================
  // SEAT PRICE
  // =====================================================

  const getSeatPrice = (seatNumber) => {
    const seat = seatData.find(
      (item) =>
        String(item.seatNumber).toUpperCase() ===
        String(seatNumber).toUpperCase()
    );

    if (!seat || !flight) return 0;

    const seatClass = String(seat.seatClass || "")
      .trim()
      .toUpperCase();

    switch (seatClass) {
      case "ECONOMY":
        return Number(flight.economyPrice || 0);

      case "PREMIUM_ECONOMY":
        return Number(flight.premiumEconomyPrice || 0);

      case "BUSINESS":
        return Number(flight.businessPrice || 0);

      case "FIRST_CLASS":
        return Number(flight.firstClassPrice || 0);

      default:
        return 0;
    }
  };

  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + getSeatPrice(seat),
    0
  );

  // =====================================================
  // LOAD SEATS
  // =====================================================

  useEffect(() => {
    if (!flightId) {
      setLoadingSeats(false);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/seats/flight/${flightId}`,
          {
            method: "GET",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Seat API failed: ${response.status}`);
        }

        const data = await response.json();
        const allSeats = Array.isArray(data) ? data : [];

        setSeatData(allSeats);

        setBookedSeats(
          allSeats
            .filter(
              (seat) =>
                String(seat.status || "").toUpperCase() === "BOOKED"
            )
            .map((seat) => String(seat.seatNumber).toUpperCase())
        );
      } catch (error) {
        console.error("Error loading seats:", error);
        setSeatData([]);
        setBookedSeats([]);
        alert("Unable to load seat information. Please try again.");
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [flightId]);

  const availableSeats = Math.max(0, seats.length - bookedSeats.length);

  // =====================================================
  // SELECT / DESELECT SEATS
  // =====================================================

  const handleSeatClick = (seat) => {
    const normalizedSeat = String(seat).toUpperCase();

    if (bookedSeats.includes(normalizedSeat)) {
      alert(`Seat ${normalizedSeat} is already booked.`);
      return;
    }

    if (selectedSeats.includes(normalizedSeat)) {
      setSelectedSeats((previous) =>
        previous.filter((item) => item !== normalizedSeat)
      );
      return;
    }

    if (selectedSeats.length >= passengers) {
      alert(`You can select a maximum of ${passengers} seat(s).`);
      return;
    }

    if (getSeatPrice(normalizedSeat) <= 0) {
      alert(`Price is not available for seat ${normalizedSeat}.`);
      return;
    }

    setSelectedSeats((previous) => [...previous, normalizedSeat]);
  };

  // =====================================================
  // CONTINUE TO PAYMENT
  // =====================================================

  const handleContinue = () => {
    if (!flight || !flightId) {
      alert("Flight information is missing. Please select your flight again.");
      navigate("/");
      return;
    }

    if (!allPassengersHaveIds) {
      alert("Passenger information is missing. Please enter all passenger details again.");

      navigate("/booking", {
        state: {
          flight,
          flightId,
          from,
          to,
          travelDate,
          passengers,
        },
      });

      return;
    }

    if (selectedSeats.length !== passengers) {
      alert(`Please select exactly ${passengers} seat(s).`);
      return;
    }

    const invalidSeat = selectedSeats.find(
      (seat) => getSeatPrice(seat) <= 0
    );

    if (invalidSeat) {
      alert(`Price is not available for seat ${invalidSeat}.`);
      return;
    }

    if (totalPrice <= 0) {
      alert("Total fare is not available.");
      return;
    }

    // Assign seats in selection order:
    // Passenger 1 -> selectedSeats[0]
    // Passenger 2 -> selectedSeats[1], and so on.
    const passengersWithSeats = passengerDetails.map(
      (passenger, index) => ({
        ...passenger,
        passengerId: Number(passenger.passengerId),
        name: String(passenger.name || "").trim(),
        age: Number(passenger.age),
        gender: passenger.gender,
        passportNumber: passenger.passportNumber || "",
        seatNumber: selectedSeats[index],
        seatPrice: getSeatPrice(selectedSeats[index]),
      })
    );

    navigate("/payment", {
      state: {
        flight,
        flightId,
        from,
        to,
        travelDate,
        passengers,

        // Backward compatibility for existing payment code.
        passengerId: passengersWithSeats[0].passengerId,
        passengerName: passengersWithSeats[0].name,
        passengerAge: passengersWithSeats[0].age,
        passengerGender: passengersWithSeats[0].gender,
        passportNumber: passengersWithSeats[0].passportNumber,

        // Important: individual passenger IDs and seats.
        passengerDetails: passengersWithSeats,
        selectedSeats,

        seatPrices: passengersWithSeats.map((passenger) => ({
          passengerId: passenger.passengerId,
          passengerName: passenger.name,
          seatNumber: passenger.seatNumber,
          price: passenger.seatPrice,
        })),

        totalPrice,
      },
    });
  };

  // =====================================================
  // MISSING BOOKING DATA
  // =====================================================

  if (!flight || !flightId || !allPassengersHaveIds) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fa",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "35px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            maxWidth: "450px",
            width: "100%",
          }}
        >
          <h2>Booking Information Missing</h2>

          <p>
            Please enter the details of all passengers before selecting seats.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/booking", {
                state: {
                  flight,
                  flightId,
                  from,
                  to,
                  travelDate,
                  passengers,
                },
              })
            }
            style={primaryButtonStyle}
          >
            Enter Passenger Details
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI — SEAT MAP AND SUMMARY ONLY
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff, #f8fafc)",
        padding: "30px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <header style={{ marginBottom: "25px" }}>
          <h1 style={{ marginBottom: "8px", color: "#172554" }}>
            Select Your Seats
          </h1>

          <p style={{ color: "#64748b" }}>
            Choose {passengers} seat(s), one for each passenger, before payment.
          </p>
        </header>

        {/* FLIGHT INFORMATION */}

        <section
          style={{
            background: "#fff",
            padding: "22px",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
            marginBottom: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <small style={{ color: "#64748b" }}>Airline</small>
            <strong style={{ display: "block", marginTop: "5px" }}>
              {flight.airlineName || flight.airline || "Airline"}
            </strong>
          </div>

          <div>
            <small style={{ color: "#64748b" }}>Flight Number</small>
            <strong style={{ display: "block", marginTop: "5px" }}>
              {flight.flightNumber || flight.flightNo || "--"}
            </strong>
          </div>

          <div>
            <small style={{ color: "#64748b" }}>Route</small>
            <strong style={{ display: "block", marginTop: "5px" }}>
              {from} → {to}
            </strong>
          </div>

          <div>
            <small style={{ color: "#64748b" }}>Travel Date</small>
            <strong style={{ display: "block", marginTop: "5px" }}>
              {travelDate || "--"}
            </strong>
          </div>

          <div>
            <small style={{ color: "#64748b" }}>Passengers</small>
            <strong style={{ display: "block", marginTop: "5px" }}>
              {passengers}
            </strong>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* SEAT MAP */}

          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              minWidth: 0,
            }}
          >
            <h2 style={{ marginTop: 0 }}>✈ Aircraft Seats</h2>

            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                margin: "15px 0 25px",
                color: "#475569",
              }}
            >
              <span>
                Available: <strong>{availableSeats}</strong>
              </span>

              <span>
                Booked: <strong>{bookedSeats.length}</strong>
              </span>

              <span>
                Selected: <strong>{selectedSeats.length}/{passengers}</strong>
              </span>
            </div>

            {loadingSeats ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h3>Loading seats...</h3>
              </div>
            ) : (
              <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                <div
                  style={{
                    textAlign: "center",
                    background: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "50% 50% 10px 10px",
                    marginBottom: "20px",
                    fontWeight: "bold",
                  }}
                >
                  ✈ COCKPIT
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1fr) minmax(0, 1fr) 20px minmax(0, 1fr) minmax(0, 1fr)",
                    gap: "8px",
                  }}
                >
                  {seats.map((seat, index) => {
                    const selected = selectedSeats.includes(seat);
                    const booked = bookedSeats.includes(seat);
                    const seatPrice = getSeatPrice(seat);
                    const position = index % 4;

                    const gridColumn =
                      position === 0
                        ? 1
                        : position === 1
                        ? 2
                        : position === 2
                        ? 4
                        : 5;

                    const selectedIndex = selectedSeats.indexOf(seat);

                    return (
                      <button
                        key={seat}
                        type="button"
                        disabled={booked || loadingSeats}
                        onClick={() => handleSeatClick(seat)}
                        title={
                          booked
                            ? `${seat} is booked`
                            : selected
                            ? `Assigned to Passenger ${selectedIndex + 1}`
                            : `Select ${seat}`
                        }
                        style={{
                          gridColumn,
                          padding: "10px 3px",
                          border: selected
                            ? "2px solid #0047b3"
                            : booked
                            ? "1px solid #999"
                            : "1px solid #cbd5e1",
                          borderRadius: "7px",
                          cursor:
                            booked || loadingSeats ? "not-allowed" : "pointer",
                          background: booked
                            ? "#d1d5db"
                            : selected
                            ? "#0866ff"
                            : "#e8f0ff",
                          color: booked
                            ? "#666"
                            : selected
                            ? "#fff"
                            : "#333",
                          fontWeight: "bold",
                          opacity: booked ? 0.7 : 1,
                          minWidth: 0,
                        }}
                      >
                        <div>{seat}</div>

                        <div
                          style={{
                            fontSize: "10px",
                            marginTop: "3px",
                            fontWeight: "normal",
                          }}
                        >
                          {selected
                            ? `P${selectedIndex + 1}`
                            : seatPrice > 0
                            ? `₹${seatPrice}`
                            : "--"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span>⬜ Available</span>
              <span>🟦 Selected</span>
              <span>⬛ Booked</span>
            </div>
          </section>

          {/* BOOKING SUMMARY */}

          <section
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              minWidth: 0,
            }}
          >
            <h2 style={{ marginTop: 0 }}>Booking Summary</h2>
            <hr />

            <p>
              <strong>Total Passengers:</strong> {passengers}
            </p>

            {passengerDetails.map((passenger, index) => (
              <div
                key={passenger.passengerId}
                style={{
                  background: "#f0f7ff",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  overflowWrap: "anywhere",
                }}
              >
                <strong>Passenger {index + 1}</strong>

                <p style={{ margin: "8px 0 5px" }}>
                  Name: {passenger.name}
                </p>

               

               

              

                <p style={{ margin: "0 0 5px" }}>
                  Seat: {selectedSeats[index] || "--"}
                </p>

                <p style={{ margin: 0 }}>
                  Fare:{" "}
                  {selectedSeats[index]
                    ? `₹${getSeatPrice(selectedSeats[index])}`
                    : "--"}
                </p>
              </div>
            ))}

            <p>
              <strong>Flight:</strong>{" "}
              {flight.flightNumber || flight.flightNo || "--"}
            </p>

            <p>
              <strong>Route:</strong> {from} → {to}
            </p>

            <p>
              <strong>Travel Date:</strong> {travelDate || "--"}
            </p>

            <hr />

            <h3>Selected Seats</h3>

            {selectedSeats.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {selectedSeats.map((seat, index) => (
                  <div
                    key={seat}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      background: "#f0f7ff",
                      padding: "9px 12px",
                      borderRadius: "6px",
                    }}
                  >
                    <strong>
                      Passenger {index + 1}: {seat}
                    </strong>

                    <span>₹{getSeatPrice(seat)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#777" }}>No seat selected</p>
            )}

            <div
              style={{
                background: "#f0f7ff",
                padding: "15px",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              <p style={{ margin: 0, color: "#64748b" }}>Total Fare</p>

              <h2 style={{ margin: "5px 0 0", color: "#0866ff" }}>
                {selectedSeats.length
                  ? `₹${totalPrice.toLocaleString("en-IN")}`
                  : "Select seat(s)"}
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ ...secondaryButtonStyle, flex: 1 }}
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  loadingSeats || selectedSeats.length !== passengers
                }
                style={{
                  ...primaryButtonStyle,
                  flex: 2,
                  background:
                    !loadingSeats && selectedSeats.length === passengers
                      ? "#0866ff"
                      : "#9ca3af",
                  cursor:
                    !loadingSeats && selectedSeats.length === passengers
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Continue to Payment →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
