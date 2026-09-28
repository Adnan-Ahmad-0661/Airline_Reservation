import { useLocation, useNavigate } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================
  // GET DATA FROM NAVIGATION STATE
  // =========================================

  const state = location.state || {};

  const bookings = state.bookings || [];

  // Single booking fallback
  const booking = state.booking || bookings[0];

  // =========================================
  // FLIGHT DATA
  // =========================================

  const flight = state.flight || booking?.flight || {};

  const flightNumber =
    flight.flightNumber ||
    booking?.flightNumber ||
    "-";

  const airline =
    flight.airlineName ||
    flight.airline ||
    booking?.airlineName ||
    booking?.airline ||
    "-";

  const flightId =
    flight.id ||
    booking?.flightId ||
    "-";

  // =========================================
  // ROUTE
  // =========================================

  const from =
    state.from ||
    flight.sourceAirport?.name ||
    flight.sourceAirport?.airportName ||
    flight.sourceAirport?.code ||
    "-";

  const to =
    state.to ||
    flight.destinationAirport?.name ||
    flight.destinationAirport?.airportName ||
    flight.destinationAirport?.code ||
    "-";

  // =========================================
  // DATE
  // =========================================

  const travelDate =
    state.travelDate ||
    booking?.travelDate ||
    "-";

  // =========================================
  // PASSENGER
  // =========================================

  const passengerName =
    state.passengerName ||
    booking?.passenger?.name ||
    booking?.passengerName ||
    "-";

  const passengerAge =
    state.passengerAge ||
    booking?.passenger?.age ||
    "-";

  const passengerGender =
    state.passengerGender ||
    booking?.passenger?.gender ||
    "-";

  const passportNumber =
    state.passportNumber ||
    booking?.passenger?.passportNumber ||
    "-";

  // =========================================
  // IF NO BOOKING DATA
  // =========================================

  if (!booking && bookings.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "50px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1 style={{ color: "#dc2626" }}>
            No Booking Found
          </h1>

          <p>
            Booking information is not available.
            Please complete a booking first.
          </p>

          <button
            onClick={() => navigate("/")}
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
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // TICKETS
  // =========================================

  const ticketList =
    bookings.length > 0
      ? bookings
      : [booking];

  // =========================================
  // TOTAL AMOUNT
  // =========================================

  const totalAmount = ticketList.reduce(
    (total, item) =>
      total + Number(item?.amount || 0),
    0
  );

  // =========================================
  // UI
  // =========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "auto",
        }}
      >

        {/* =========================================
            SUCCESS HEADER
        ========================================= */}

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "15px",
            textAlign: "center",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              color: "#16a34a",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              color: "#16a34a",
              marginBottom: "10px",
            }}
          >
            Booking Confirmed
          </h1>

          <p
            style={{
              color: "#555",
              fontSize: "16px",
            }}
          >
            Your flight booking has been confirmed
            successfully.
          </p>
        </div>

        {/* =========================================
            FLIGHT DETAILS
        ========================================= */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "30px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Flight Details</h2>

          <hr />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "15px",
            }}
          >

            <p>
              <strong>Airline:</strong>{" "}
              {airline}
            </p>

            <p>
              <strong>Flight Number:</strong>{" "}
              {flightNumber}
            </p>

            <p>
              <strong>Flight ID:</strong>{" "}
              {flightId}
            </p>

            <p>
              <strong>Travel Date:</strong>{" "}
              {travelDate}
            </p>

            <p>
              <strong>From:</strong>{" "}
              {from}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {to}
            </p>
          </div>
        </div>

        {/* =========================================
            PASSENGER DETAILS
        ========================================= */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "30px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Passenger Details</h2>

          <hr />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "15px",
            }}
          >
            <p>
              <strong>Name:</strong>{" "}
              {passengerName}
            </p>

            <p>
              <strong>Age:</strong>{" "}
              {passengerAge}
            </p>

            <p>
              <strong>Gender:</strong>{" "}
              {passengerGender}
            </p>

            <p>
              <strong>Passport:</strong>{" "}
              {passportNumber}
            </p>
          </div>
        </div>

        {/* =========================================
            TICKET SECTION
        ========================================= */}

        <div
          style={{
            background: "white",
            marginTop: "25px",
            padding: "30px",
            borderRadius: "15px",
            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            Your Ticket
            {ticketList.length > 1
              ? `s (${ticketList.length})`
              : ""}
          </h2>

          <hr />

          {ticketList.map(
            (item, index) => {

              const itemPassengerName =
                item?.passenger?.name ||
                item?.passengerName ||
                passengerName ||
                "-";

              const itemFlightNumber =
                item?.flight?.flightNumber ||
                item?.flightNumber ||
                flightNumber ||
                "-";

              const itemAirline =
                item?.flight?.airlineName ||
                item?.flight?.airline ||
                item?.airlineName ||
                item?.airline ||
                airline ||
                "-";

              const itemSeat =
                item?.seatNumber ||
                "-";

              const itemPnr =
                item?.pnr ||
                "-";

              const itemAmount =
                Number(item?.amount || 0);

              const itemStatus =
                item?.status ||
                "CONFIRMED";

              return (
                <div
                  key={
                    item?.id ||
                    index
                  }
                  style={{
                    border:
                      "1px solid #d1d5db",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "20px",
                    background: "#ffffff",
                  }}
                >

                  {/* TICKET HEADER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#0066ff",
                      }}
                    >
                      Ticket #{index + 1}
                    </h3>

                    <span
                      style={{
                        padding:
                          "6px 12px",
                        borderRadius:
                          "20px",
                        background:
                          itemStatus ===
                          "CONFIRMED"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          itemStatus ===
                          "CONFIRMED"
                            ? "#16a34a"
                            : "#dc2626",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {itemStatus}
                    </span>
                  </div>

                  {/* PNR */}

                  <div
                    style={{
                      background:
                        "#eef4ff",
                      padding: "15px",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "20px",
                    }}
                  >
                    <strong>
                      PNR:
                    </strong>{" "}
                    <span
                      style={{
                        fontSize:
                          "18px",
                        fontWeight:
                          "bold",
                        color:
                          "#0066ff",
                      }}
                    >
                      {itemPnr}
                    </span>
                  </div>

                  {/* TICKET DATA */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px",
                    }}
                  >

                    <p>
                      <strong>
                        Passenger:
                      </strong>{" "}
                      {itemPassengerName}
                    </p>

                    <p>
                      <strong>
                        Airline:
                      </strong>{" "}
                      {itemAirline}
                    </p>

                    <p>
                      <strong>
                        Flight:
                      </strong>{" "}
                      {itemFlightNumber}
                    </p>

                    <p>
                      <strong>
                        Seat:
                      </strong>{" "}
                      <span
                        style={{
                          background:
                            "#0066ff",
                          color:
                            "white",
                          padding:
                            "5px 10px",
                          borderRadius:
                            "5px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {itemSeat}
                      </span>
                    </p>

                    <p>
                      <strong>
                        Amount:
                      </strong>{" "}
                      ₹{itemAmount}
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}
                      {itemStatus}
                    </p>
                  </div>

                </div>
              );
            }
          )}

          {/* =========================================
              TOTAL
          ========================================= */}

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "10px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <strong>
              Total Amount
            </strong>

            <strong
              style={{
                fontSize: "22px",
                color: "#0066ff",
              }}
            >
              ₹{totalAmount}
            </strong>
          </div>
        </div>

        {/* =========================================
            BUTTONS
        ========================================= */}

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            gap: "15px",
            justifyContent:
              "center",
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={() =>
              navigate("/my-bookings")
            }
            style={{
              padding:
                "13px 25px",
              background:
                "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            My Bookings
          </button>

          <button
            onClick={() =>
              navigate("/")
            }
            style={{
              padding:
                "13px 25px",
              background:
                "#e5e7eb",
              color: "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Back to Home
          </button>

        </div>

      </div>
    </div>
  );
}

export default Confirmation;