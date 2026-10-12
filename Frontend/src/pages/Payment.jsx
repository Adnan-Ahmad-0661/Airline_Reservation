
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state || {};
  const flight = bookingData.flight || null;

  const flightId = Number(bookingData.flightId || flight?.id || 0);
  const passengerId = Number(bookingData.passengerId || 0);

  const from = bookingData.from || flight?.source || "";
  const to = bookingData.to || flight?.destination || "";
  const travelDate = bookingData.travelDate || "";
  const passengers = Number(bookingData.passengers) || 1;

  const selectedSeats = Array.isArray(bookingData.selectedSeats)
    ? bookingData.selectedSeats
    : [];

  const passengerDetails = Array.isArray(bookingData.passengerDetails)
    ? bookingData.passengerDetails
    : [
        {
          name: bookingData.passengerName || "",
        },
      ];

  const seatPrices = Array.isArray(bookingData.seatPrices)
    ? bookingData.seatPrices
    : [];

  const getSeatPrice = (seat, index) => {
    const item = seatPrices.find(
      (entry) => String(entry.seatNumber) === String(seat)
    );

    if (item) return Number(item.price || 0);

    const passenger = passengerDetails[index];

    if (passenger?.seatPrice != null) {
      return Number(passenger.seatPrice);
    }

    return Number(flight?.price || 0);
  };

  const calculatedTotal = selectedSeats.reduce(
    (sum, seat, index) => sum + getSeatPrice(seat, index),
    0
  );

  const totalPrice = Number(
    bookingData.totalPrice ?? calculatedTotal
  );

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiApp, setUpiApp] = useState("Google Pay");
  const [bank, setBank] = useState("SBI");
  const [wallet, setWallet] = useState("Paytm");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bookingIsValid =
    Boolean(flight) &&
    flightId > 0 &&
    (
      passengerDetails.length === passengers
        ? passengerDetails.length > 0 &&
          passengerDetails.every(
            (passenger) => Number(passenger.passengerId) > 0
          )
        : passengerId > 0 && passengerDetails.length === 1
    ) &&
    selectedSeats.length === passengers &&
    passengerDetails.length === passengers &&
    totalPrice > 0;

  const paymentMethods = [
    { value: "UPI", label: "UPI", icon: "📱" },
    { value: "CARD", label: "Debit / Credit Card", icon: "💳" },
    { value: "NET_BANKING", label: "Net Banking", icon: "🏦" },
    { value: "WALLET", label: "Wallet", icon: "👛" },
    
  ];

  const upiApps = [
    { value: "Google Pay", icon: "🟦" },
    { value: "PhonePe", icon: "🟣" },
    { value: "Paytm", icon: "🔵" },
  ];

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  async function readResponse(response) {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status}): ${
          text || response.statusText
        }`
      );
    }

    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid response received from server.");
    }
  }

  const handlePayment = async (event) => {
    event.preventDefault();

    if (loading) return;

    setErrorMessage("");

    if (!bookingIsValid) {
      setErrorMessage(
        "Booking details are incomplete. Please return to seat selection and check your passengers, seats and fare."
      );
      return;
    }

    const incompletePassenger = passengerDetails.findIndex(
      (passenger) =>
        !String(passenger.name || "").trim() ||
        !passenger.age ||
        !passenger.gender
    );

    if (incompletePassenger !== -1) {
      setErrorMessage(
        `Passenger ${incompletePassenger + 1} details are incomplete.`
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("Please log in before continuing.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Create one booking for each passenger and seat.
      const bookings = [];

      for (let index = 0; index < selectedSeats.length; index++) {
        const seat = selectedSeats[index];
        const passenger = passengerDetails[index];

        const currentPassengerId = Number(
          passenger.passengerId || passengerId
        );

        if (!currentPassengerId) {
          throw new Error(
            `Passenger ID is missing for passenger ${index + 1}.`
          );
        }

        const params = new URLSearchParams({
          flightId: String(flightId),
          passengerId: String(currentPassengerId),
          seatNumber: String(seat),
        });

        const response = await fetch(
          `${API_URL}/api/bookings?${params.toString()}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const booking = await readResponse(response);

        if (!booking?.id) {
          throw new Error(
            `Booking ID was not returned for seat ${seat}.`
          );
        }

        bookings.push({
          ...booking,
          passengerDetails: passenger,
          seatNumber: seat,
          seatPrice: getSeatPrice(seat, index),
        });
      }

      // STEP 2: Create payment for all bookings.
      const paymentParams = new URLSearchParams();

      bookings.forEach((booking) => {
        paymentParams.append("bookingIds", String(booking.id));
      });

      paymentParams.set("paymentMethod", paymentMethod);

      if (paymentMethod === "UPI") {
        paymentParams.set("upiApp", upiApp);
      }

      const paymentResponse = await fetch(
        `${API_URL}/api/payments?${paymentParams.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payment = await readResponse(paymentResponse);

      if (!payment?.id) {
        throw new Error("Payment API did not return a payment ID.");
      }

      // STEP 3: Navigate to confirmation.
      navigate("/confirmation", {
        state: {
          bookings,
          payment,
          paymentId: payment.id,
          paymentStatus: payment.paymentStatus || "PENDING",
          totalPrice: Number(payment.amount ?? totalPrice),
          flight,
          flightId,
          from,
          to,
          travelDate,
          passengers,
          passengerId,
          passengerDetails,
          selectedSeats,
          seatPrices,
          paymentMethod,
          upiApp: paymentMethod === "UPI" ? upiApp : null,
          bank: paymentMethod === "NET_BANKING" ? bank : null,
          wallet: paymentMethod === "WALLET" ? wallet : null,
        },
      });
    } catch (error) {
      console.error("Booking/payment error:", error);
      setErrorMessage(
        error.message || "Unable to process your booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;

    if (window.confirm("Do you want to leave this booking process?")) {
      navigate("/");
    }
  };

  const methodStyle = (selected) => ({
    ...styles.methodButton,
    border: selected
      ? "2px solid #0066ff"
      : "1px solid #d5dce5",
    background: selected ? "#eff6ff" : "#ffffff",
  });

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Complete Your Booking</h1>
            <p style={styles.subtitle}>
              Review your flight and passenger names before payment.
            </p>
          </div>

          <button
            type="button"
            style={styles.homeButton}
            onClick={() => navigate("/")}
            disabled={loading}
          >
            🏠 Home
          </button>
        </header>

        {!bookingIsValid && (
          <div role="alert" style={styles.error}>
            Booking information is incomplete. Please check your flight,
            passenger IDs and selected seats.

            <button
              type="button"
              style={styles.backButton}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        )}

        <div style={styles.layout}>
          {/* LEFT: FLIGHT AND PASSENGER NAMES */}

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>✈ Flight Details</h2>

            <div style={styles.flightBanner}>
              <div>
                <span style={styles.smallLabel}>FROM</span>
                <h2 style={styles.cityName}>{from || "--"}</h2>
              </div>

              <span style={styles.flightArrow}>✈ ━━━ ✈</span>

              <div style={{ textAlign: "right" }}>
                <span style={styles.smallLabel}>TO</span>
                <h2 style={styles.cityName}>{to || "--"}</h2>
              </div>
            </div>

            <Detail
              label="Airline"
              value={flight?.airlineName || flight?.airline || "--"}
            />

            <Detail
              label="Flight Number"
              value={flight?.flightNumber || "--"}
            />

            <Detail label="Travel Date" value={travelDate || "--"} />

            <Detail label="Total Passengers" value={passengers} />

            <hr style={styles.divider} />

            <h2 style={styles.sectionTitle}>👤 Passenger Names</h2>

            <div style={styles.passengerCard}>
              {passengerDetails.map((passenger, index) => (
                <div
                  key={passenger.passengerId || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 0",
                    borderBottom:
                      index !== passengerDetails.length - 1
                        ? "1px solid #dbeafe"
                        : "none",
                  }}
                >
                  <strong style={styles.passengerNameLabel}>
                    Passenger {index + 1}
                  </strong>

                  <span style={styles.passengerName}>
                    {passenger.name || "Name not available"}
                  </span>
                </div>
              ))}
            </div>

            <div style={styles.totalBox}>
              <span style={styles.totalLabel}>
                Total Amount to Pay
              </span>

              <h2 style={styles.totalAmount}>
                ₹{formatCurrency(totalPrice)}
              </h2>
            </div>
          </section>

          {/* RIGHT: PAYMENT OPTIONS */}

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>💳 Payment Details</h2>

            <p style={styles.subtitle}>
              Select your preferred payment method.
            </p>

            <form onSubmit={handlePayment}>
              <h3 style={styles.subHeading}>
                Choose Payment Method
              </h3>

              <div style={styles.methodGrid}>
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    disabled={loading}
                    onClick={() => setPaymentMethod(method.value)}
                    style={methodStyle(
                      paymentMethod === method.value
                    )}
                  >
                    <span style={styles.methodIcon}>
                      {method.icon}
                    </span>

                    <span>{method.label}</span>

                    {paymentMethod === method.value && (
                      <span style={styles.checkMark}>✓</span>
                    )}
                  </button>
                ))}
              </div>

              {paymentMethod === "UPI" && (
                <div style={styles.panel}>
                  <h2 style={styles.panelTitle}>Choose UPI App</h2>

                  <div style={styles.upiGrid}>
                    {upiApps.map((app) => (
                      <button
                        key={app.value}
                        type="button"
                        disabled={loading}
                        onClick={() => setUpiApp(app.value)}
                        style={methodStyle(upiApp === app.value)}
                      >
                        <span style={styles.methodIcon}>
                          {app.icon}
                        </span>

                        <span>{app.value}</span>

                        {upiApp === app.value && (
                          <span style={styles.checkMark}>
                            Selected ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === "CARD" && (
                <div style={styles.panel}>
                  <h2 style={styles.panelTitle}>
                    Debit / Credit Card
                  </h2>

                  <p style={styles.subtitle}>
                    Card payments require an integrated payment gateway.
                    Do not enter real card details in this demo.
                  </p>
                </div>
              )}

              {paymentMethod === "NET_BANKING" && (
                <div style={styles.panel}>
                  <label htmlFor="bank" style={styles.formLabel}>
                    Select Bank
                  </label>

                  <select
                    id="bank"
                    style={styles.input}
                    value={bank}
                    onChange={(event) => setBank(event.target.value)}
                    disabled={loading}
                  >
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === "WALLET" && (
                <div style={styles.panel}>
                  <label htmlFor="wallet" style={styles.formLabel}>
                    Select Wallet
                  </label>

                  <select
                    id="wallet"
                    style={styles.input}
                    value={wallet}
                    onChange={(event) => setWallet(event.target.value)}
                    disabled={loading}
                  >
                    <option value="Paytm">Paytm</option>
                    <option value="Amazon Pay">Amazon Pay</option>
                    <option value="Mobikwik">MobiKwik</option>
                  </select>
                </div>
              )}

            

              <div style={styles.secureNote}>
                🔒
                <span>
                  Keep your booking details safe. Real payments require
                  server-side gateway verification.
                </span>
              </div>

              {errorMessage && (
                <div role="alert" style={styles.error}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !bookingIsValid}
                style={{
                  ...styles.primaryButton,
                  opacity: loading || !bookingIsValid ? 0.6 : 1,
                }}
              >
                {loading
                  ? "Processing..."
                  : `Continue — ₹${formatCurrency(totalPrice)}`}
              </button>

              <button
                type="button"
                style={styles.backButton}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                ← Back
              </button>

              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel Booking
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.detail}>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fc",
    padding: "30px 20px 50px",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: "#111827",
  },

  container: {
    maxWidth: 1450,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 26,
  },

  pageTitle: {
    fontSize: 30,
    color: "#172554",
    margin: "0 0 8px",
    fontWeight: 750,
  },

  subtitle: {
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.65,
    margin: "5px 0 16px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 28,
    alignItems: "start",
  },

  card: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 16,
    border: "1px solid #e5eaf3",
    boxShadow: "0 8px 28px rgba(15, 23, 42, 0.08)",
    minWidth: 0,
    boxSizing: "border-box",
  },

  sectionTitle: {
    fontSize: 24,
    color: "#6b6578",
    textAlign: "center",
    margin: "0 0 24px",
    fontWeight: 750,
  },

  flightBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "18px 14px",
    borderRadius: 12,
    background: "#f5f8ff",
    border: "1px solid #e0eaff",
    marginBottom: 20,
  },

  smallLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 700,
    letterSpacing: 1,
  },

  cityName: {
    color: "#1d4ed8",
    fontSize: 20,
    margin: "7px 0 0",
    overflowWrap: "anywhere",
  },

  flightArrow: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  detail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    margin: "16px 0",
    fontSize: 17,
    lineHeight: 1.5,
    color: "#6b6578",
  },

  passengerCard: {
    background: "#f8fbff",
    border: "1px solid #d9e8ff",
    borderRadius: 12,
    padding: "12px 18px",
    margin: "18px 0",
    overflowWrap: "anywhere",
  },

  passengerNameLabel: {
    color: "#1d4ed8",
    fontSize: 16,
    flexShrink: 0,
  },

  passengerName: {
    color: "#374151",
    fontSize: 16,
    fontWeight: 600,
    textAlign: "right",
    overflowWrap: "anywhere",
  },

  divider: {
    border: 0,
    borderTop: "1px solid #d1d5db",
    margin: "24px 0",
  },

  totalBox: {
    background: "#f0f7ff",
    border: "1px solid #dbeafe",
    padding: 20,
    borderRadius: 12,
    marginTop: 22,
  },

  totalLabel: {
    fontSize: 17,
    color: "#64748b",
    fontWeight: 700,
  },

  totalAmount: {
    color: "#0066ff",
    fontSize: 32,
    margin: "8px 0 0",
  },

  subHeading: {
    fontSize: 18,
    margin: "0 0 16px",
    color: "#252b3b",
  },

  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    margin: "14px 0 24px",
  },

  upiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 20,
  },

  methodButton: {
    minHeight: 115,
    padding: "18px 10px",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: "#111827",
    fontSize: 15,
    fontWeight: 700,
    textAlign: "center",
    overflowWrap: "anywhere",
    cursor: "pointer",
    transition: "background 0.2s ease, border 0.2s ease",
  },

  methodIcon: {
    fontSize: 29,
    lineHeight: 1.2,
  },

  checkMark: {
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: 700,
  },

  panel: {
    padding: 22,
    border: "1px solid #e0e8f5",
    borderRadius: 14,
    marginBottom: 24,
    background: "#ffffff",
    minWidth: 0,
  },

  panelTitle: {
    textAlign: "center",
    color: "#6b6578",
    fontSize: 23,
    margin: "0 0 18px",
  },

  formLabel: {
    display: "block",
    fontSize: 15,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    padding: 14,
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: 9,
    fontSize: 15,
    background: "#ffffff",
  },

  secureNote: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    color: "#64748b",
    background: "#f8fafc",
    padding: 13,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 1.6,
    margin: "10px 0 18px",
  },

  primaryButton: {
    width: "100%",
    padding: 17,
    background: "#0066ff",
    color: "#ffffff",
    border: "none",
    borderRadius: 9,
    fontWeight: 750,
    fontSize: 17,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 5px 12px rgba(0, 102, 255, 0.2)",
  },

  homeButton: {
    padding: "12px 20px",
    background: "#ffffff",
    color: "#1d4ed8",
    border: "1px solid #cbd5e1",
    borderRadius: 9,
    fontWeight: 700,
    cursor: "pointer",
  },

  backButton: {
    width: "100%",
    padding: 14,
    background: "#e8edf5",
    color: "#334155",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    marginTop: 12,
  },

  cancelButton: {
    width: "100%",
    padding: 13,
    background: "#ffffff",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    marginTop: 12,
  },

  error: {
    color: "#b91c1c",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 9,
    padding: 15,
    margin: "16px 0",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },
};

export default Payment;
