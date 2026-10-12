
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  // LOGIN
  const token = localStorage.getItem("token");

  // FLIGHT DATA
  const flight = location.state?.flight;
  const from = location.state?.from || "";
  const to = location.state?.to || "";
  const travelDate = location.state?.travelDate || "";
  const passengers = Math.max(
    1,
    Number(location.state?.passengers) || 1
  );

  // ONE FORM PER PASSENGER
  const createEmptyPassenger = () => ({
    name: "",
    age: "",
    gender: "",
    passportNumber: "",
  });

  const [passengerDetails, setPassengerDetails] = useState(
    () => Array.from({ length: passengers }, createEmptyPassenger)
  );

  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPassenger =
    passengerDetails[currentPassengerIndex] || createEmptyPassenger();

  // LOGIN CHECK
  if (!token) {
    navigate("/login", { replace: true });
    return null;
  }

  // UPDATE CURRENT PASSENGER FIELD
  const updatePassenger = (field, value) => {
    setPassengerDetails((previous) =>
      previous.map((passenger, index) =>
        index === currentPassengerIndex
          ? { ...passenger, [field]: value }
          : passenger
      )
    );
    setError("");
  };

  // VALIDATE CURRENT PASSENGER
  const validatePassenger = () => {
    const passenger = passengerDetails[currentPassengerIndex];

    if (!passenger.name.trim()) {
      alert("Please enter passenger name.");
      return false;
    }

    if (!passenger.age) {
      alert("Please enter passenger age.");
      return false;
    }

    const passengerAge = Number(passenger.age);

    if (
      !Number.isInteger(passengerAge) ||
      passengerAge <= 0 ||
      passengerAge > 120
    ) {
      alert("Please enter a valid age.");
      return false;
    }

    if (!passenger.gender) {
      alert("Please select gender.");
      return false;
    }

    if (!passenger.passportNumber.trim()) {
      alert("Please enter passport number.");
      return false;
    }

    return true;
  };

  // NEXT PASSENGER
  const handleNextPassenger = () => {
    setError("");

    if (!validatePassenger()) return;

    if (currentPassengerIndex < passengers - 1) {
      setCurrentPassengerIndex((index) => index + 1);
    }
  };

  // SAVE ALL PASSENGERS AND CONTINUE
  const handleContinue = async () => {
    setError("");

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!flight?.id) {
      alert("Flight information is missing.");
      navigate("/");
      return;
    }

    if (!validatePassenger()) return;

    // Validate every passenger before making API requests.
    for (let index = 0; index < passengerDetails.length; index++) {
      const passenger = passengerDetails[index];

      if (
        !passenger.name.trim() ||
        !passenger.age ||
        !Number.isInteger(Number(passenger.age)) ||
        Number(passenger.age) <= 0 ||
        Number(passenger.age) > 120 ||
        !passenger.gender ||
        !passenger.passportNumber.trim()
      ) {
        alert(`Please complete Passenger ${index + 1} details.`);
        setCurrentPassengerIndex(index);
        return;
      }
    }

    try {
      setLoading(true);

      const savedPassengers = [];

      // Create each passenger separately to receive a unique ID.
      for (let index = 0; index < passengerDetails.length; index++) {
        const passenger = passengerDetails[index];

        const passengerData = {
          name: passenger.name.trim(),
          age: Number(passenger.age),
          gender: passenger.gender,
          passportNumber: passenger.passportNumber
            .trim()
            .toUpperCase(),
        };

        const response = await fetch(
          "http://localhost:8080/api/passengers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentToken}`,
            },
            body: JSON.stringify(passengerData),
          }
        );

        const responseText = await response.text();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          alert("Your login session has expired. Please login again.");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            responseText || `Unable to save Passenger ${index + 1}.`
          );
        }

        let savedPassenger;

        try {
          savedPassenger = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error(
            `Invalid response for Passenger ${index + 1}.`
          );
        }

        if (!savedPassenger?.id) {
          throw new Error(
            `Passenger ${index + 1} ID was not received from the server.`
          );
        }

        savedPassengers.push({
          passengerId: Number(savedPassenger.id),
          name: savedPassenger.name || passengerData.name,
          age: savedPassenger.age ?? passengerData.age,
          gender: savedPassenger.gender || passengerData.gender,
          passportNumber:
            savedPassenger.passportNumber ||
            passengerData.passportNumber,
        });
      }

      // Move to seat selection only after all passengers are saved.
      navigate("/seat-selection", {
        state: {
          flight,
          flightId: Number(flight.id),
          from,
          to,
          travelDate,
          passengers: savedPassengers.length,

          // Backward compatibility with existing code.
          passengerId: savedPassengers[0].passengerId,
          passengerName: savedPassengers[0].name,
          passengerAge: savedPassengers[0].age,
          passengerGender: savedPassengers[0].gender,
          passportNumber: savedPassengers[0].passportNumber,

          // All passengers with their individual IDs.
          passengerDetails: savedPassengers,
        },
      });
    } catch (err) {
      console.error("Passenger Creation Error:", err);

      const message = err?.message || "Unable to create passengers.";
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // NO FLIGHT
  if (!flight) {
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
            borderRadius: "15px",
            textAlign: "center",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            maxWidth: "450px",
            width: "100%",
          }}
        >
          <h2>No Flight Selected</h2>
          <p style={{ color: "#666", marginBottom: "25px" }}>
            Please search and select a flight first.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "12px 25px",
              background: "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
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

  // MAIN UI — ORIGINAL STYLING PRESERVED
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef4ff, #f8fafc)",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto 25px" }}>
        <h1 style={{ marginBottom: "8px" }}>Passenger Details</h1>

        <p style={{ color: "#666" }}>
          Enter details for all {passengers} passenger
          {passengers > 1 ? "s" : ""} to continue your booking.
        </p>

        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "14px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
        }}
      >
        {/* FLIGHT DETAILS */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2>✈ Flight Details</h2>
          <hr />

          <div style={{ marginTop: "20px", lineHeight: "1.8" }}>
            <p>
              <strong>Airline:</strong>{" "}
              {flight.airlineName || flight.airline || "-"}
            </p>
            <p>
              <strong>Flight Number:</strong>{" "}
              {flight.flightNumber || flight.flightNo || "-"}
            </p>
            <p>
              <strong>From:</strong> {flight.source || from || "-"}
            </p>
            <p>
              <strong>To:</strong> {flight.destination || to || "-"}
            </p>
            <p>
              <strong>Departure:</strong>{" "}
              {flight.departureTime || flight.departure || "--"}
            </p>
            <p>
              <strong>Arrival:</strong>{" "}
              {flight.arrivalTime || flight.arrival || "--"}
            </p>
            <p>
              <strong>Travel Date:</strong> {travelDate || "-"}
            </p>
            <p>
              <strong>Passengers:</strong> {passengers}
            </p>
            <p>
              <strong>Available Seats:</strong>{" "}
              {flight.availableSeats ?? flight.seatsAvailable ?? 0}
            </p>
          </div>

          <hr />

          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#fff7ed",
              borderRadius: "10px",
              border: "1px solid #fed7aa",
            }}
          >
            <p style={{ margin: 0, color: "#9a3412", fontWeight: "600" }}>
              💺 Seat selection required
            </p>
            <p
              style={{
                margin: "6px 0 0",
                color: "#7c2d12",
                fontSize: "14px",
              }}
            >
              Final fare will be calculated after selecting your seat.
            </p>
          </div>
        </div>

        {/* PASSENGER INFORMATION */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2>👤 Passenger Information</h2>

          <p style={{ color: "#666", fontSize: "14px" }}>
            Please enter the passenger details exactly as shown on the
            travel document.
          </p>

          {/* PASSENGER PROGRESS */}
          <div
            style={{
              margin: "18px 0",
              padding: "12px",
              background: "#eef4ff",
              borderRadius: "8px",
              color: "#0052cc",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Passenger {currentPassengerIndex + 1} of {passengers}
          </div>

          <hr />

          {/* NAME */}
          <label
            style={{
              display: "block",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter passenger full name"
            value={currentPassenger.name}
            onChange={(e) => updatePassenger("name", e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />

          {/* AGE */}
          <label
            style={{
              display: "block",
              marginTop: "18px",
              fontWeight: "bold",
            }}
          >
            Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            placeholder="Enter age"
            value={currentPassenger.age}
            onChange={(e) => updatePassenger("age", e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />

          {/* GENDER */}
          <label
            style={{
              display: "block",
              marginTop: "18px",
              fontWeight: "bold",
            }}
          >
            Gender
          </label>
          <select
            value={currentPassenger.gender}
            onChange={(e) => updatePassenger("gender", e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              outline: "none",
            }}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          {/* PASSPORT */}
          <label
            style={{
              display: "block",
              marginTop: "18px",
              fontWeight: "bold",
            }}
          >
            Passport Number
          </label>
          <input
            type="text"
            placeholder="Enter passport number"
            value={currentPassenger.passportNumber}
            onChange={(e) =>
              updatePassenger(
                "passportNumber",
                e.target.value.toUpperCase()
              )
            }
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              boxSizing: "border-box",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              textTransform: "uppercase",
              outline: "none",
            }}
          />

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "28px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (currentPassengerIndex > 0) {
                  setCurrentPassengerIndex((index) => index - 1);
                  setError("");
                } else {
                  navigate(-1);
                }
              }}
              disabled={loading}
              style={{
                flex: 1,
                padding: "13px",
                background: "#e5e7eb",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              ← Back
            </button>

            {currentPassengerIndex < passengers - 1 ? (
              <button
                type="button"
                onClick={handleNextPassenger}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: "#0066ff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                Next Passenger →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "13px",
                  background: loading ? "#9ca3af" : "#0066ff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "Saving Passengers..."
                  : "Continue to Seat Selection →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
