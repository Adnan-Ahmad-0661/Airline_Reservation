import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

// =====================================================
// FIXED CITY LIST
// =====================================================

const cities = [
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

function AdminFlights() {

  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({

    flightNumber: "",
    airlineName: "",

    economyPrice: "",
    premiumEconomyPrice: "",
    businessPrice: "",
    firstClassPrice: "",

    availableSeats: "52",
    totalSeats: "52",

    status: "ACTIVE",

    sourceCity: "",
    destinationCity: "",
  });

  // =====================================================
  // FETCH FLIGHTS
  // =====================================================

  const fetchFlights = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/flights`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch flights"
        );
      }

      const data = await response.json();

      console.log("FLIGHTS:", data);

      setFlights(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Flight fetch error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // FETCH AIRPORTS
  // =====================================================

  const fetchAirports = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/airports`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch airports"
        );
      }

      const data = await response.json();

      console.log(
        "ALL AIRPORTS:",
        data
      );

      if (Array.isArray(data)) {
        setAirports(data);
      } else {
        setAirports([]);
      }

    } catch (error) {

      console.error(
        "Airport fetch error:",
        error
      );

      setAirports([]);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        fetchFlights(),
        fetchAirports(),
      ]);

      setLoading(false);
    };

    loadData();

  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // FIND AIRPORT BY CITY
  // =====================================================

  const getAirportByCity = (city) => {

    return airports.find(
      (airport) =>
        airport.city?.toLowerCase() ===
        city?.toLowerCase()
    );
  };

  // =====================================================
  // AIRPORT DISPLAY
  // =====================================================

  const getAirportDisplay = (airport) => {

    if (!airport) {
      return "-";
    }

    return (
      airport.city ||
      airport.airportName ||
      airport.airportCode ||
      "-"
    );
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData({

      flightNumber: "",
      airlineName: "",

      economyPrice: "",
      premiumEconomyPrice: "",
      businessPrice: "",
      firstClassPrice: "",

      availableSeats: "52",
      totalSeats: "52",

      status: "ACTIVE",

      sourceCity: "",
      destinationCity: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // EDIT FLIGHT
  // =====================================================

  const handleEditFlight = (flight) => {

    console.log(
      "EDIT FLIGHT:",
      flight
    );

    setEditingId(flight.id);

    setFormData({

      flightNumber:
        flight.flightNumber || "",

      airlineName:
        flight.airlineName || "",

      economyPrice:
        flight.economyPrice ?? "",

      premiumEconomyPrice:
        flight.premiumEconomyPrice ?? "",

      businessPrice:
        flight.businessPrice ?? "",

      firstClassPrice:
        flight.firstClassPrice ?? "",

      availableSeats:
        flight.availableSeats ?? "52",

      totalSeats:
        flight.totalSeats ?? "52",

      status:
        flight.status || "ACTIVE",

      sourceCity:
        flight.sourceAirport?.city || "",

      destinationCity:
        flight.destinationAirport?.city || "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // ADD / UPDATE FLIGHT
  // =====================================================

  const handleSubmitFlight = async (e) => {

    e.preventDefault();

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!formData.flightNumber.trim()) {

      alert(
        "Please enter flight number"
      );

      return;
    }

    if (!formData.airlineName.trim()) {

      alert(
        "Please enter airline name"
      );

      return;
    }

    if (!formData.economyPrice) {

      alert(
        "Please enter Economy price"
      );

      return;
    }

    if (!formData.premiumEconomyPrice) {

      alert(
        "Please enter Premium Economy price"
      );

      return;
    }

    if (!formData.businessPrice) {

      alert(
        "Please enter Business price"
      );

      return;
    }

    if (!formData.firstClassPrice) {

      alert(
        "Please enter First Class price"
      );

      return;
    }

    if (!formData.availableSeats) {

      alert(
        "Please enter available seats"
      );

      return;
    }

    if (!formData.totalSeats) {

      alert(
        "Please enter total seats"
      );

      return;
    }

    if (!formData.sourceCity) {

      alert(
        "Please select departure city"
      );

      return;
    }

    if (!formData.destinationCity) {

      alert(
        "Please select arrival city"
      );

      return;
    }

    // ===================================================
    // SAME CITY CHECK
    // ===================================================

    if (
      formData.sourceCity ===
      formData.destinationCity
    ) {

      alert(
        "Departure and arrival city cannot be same"
      );

      return;
    }

    // ===================================================
    // SEAT VALIDATION
    // ===================================================

    if (
      Number(formData.availableSeats) >
      Number(formData.totalSeats)
    ) {

      alert(
        "Available seats cannot be greater than total seats"
      );

      return;
    }

    // ===================================================
    // FIND SOURCE AIRPORT
    // ===================================================

    const sourceAirport =
      getAirportByCity(
        formData.sourceCity
      );

    // ===================================================
    // FIND DESTINATION AIRPORT
    // ===================================================

    const destinationAirport =
      getAirportByCity(
        formData.destinationCity
      );

    console.log(
      "SOURCE AIRPORT:",
      sourceAirport
    );

    console.log(
      "DESTINATION AIRPORT:",
      destinationAirport
    );

    // ===================================================
    // SOURCE AIRPORT NOT FOUND
    // ===================================================

    if (!sourceAirport) {

      alert(
        `Airport not found for ${formData.sourceCity}`
      );

      return;
    }

    // ===================================================
    // DESTINATION AIRPORT NOT FOUND
    // ===================================================

    if (!destinationAirport) {

      alert(
        `Airport not found for ${formData.destinationCity}`
      );

      return;
    }

    // ===================================================
    // REQUEST BODY
    // ===================================================

    const flight = {

      flightNumber:
        formData.flightNumber.trim(),

      airlineName:
        formData.airlineName.trim(),

      economyPrice:
        Number(formData.economyPrice),

      premiumEconomyPrice:
        Number(
          formData.premiumEconomyPrice
        ),

      businessPrice:
        Number(formData.businessPrice),

      firstClassPrice:
        Number(formData.firstClassPrice),

      availableSeats:
        Number(formData.availableSeats),

      totalSeats:
        Number(formData.totalSeats),

      status:
        formData.status,

      sourceAirport: {
        id: Number(
          sourceAirport.id
        ),
      },

      destinationAirport: {
        id: Number(
          destinationAirport.id
        ),
      },
    };

    console.log(
      "FINAL FLIGHT REQUEST:",
      flight
    );

    // ===================================================
    // TOKEN
    // ===================================================

    const token =
      localStorage.getItem("token");

    const headers = {
      "Content-Type":
        "application/json",
    };

    if (token) {

      headers.Authorization =
        `Bearer ${token}`;
    }

    // ===================================================
    // API CALL
    // ===================================================

    try {

      setAdding(true);

      // =================================================
      // UPDATE
      // =================================================

      if (editingId !== null) {

        const response =
          await fetch(
            `${API_URL}/api/flights/${editingId}`,
            {
              method: "PUT",
              headers: headers,
              body: JSON.stringify(
                flight
              ),
            }
          );

        const responseText =
          await response.text();

        console.log(
          "UPDATE STATUS:",
          response.status
        );

        console.log(
          "UPDATE RESPONSE:",
          responseText
        );

        if (!response.ok) {

          throw new Error(
            responseText ||
              "Unable to update flight"
          );
        }

        alert(
          "Flight updated successfully!"
        );

        resetForm();

        await fetchFlights();

        return;
      }

      // =================================================
      // ADD
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/flights`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify(
              flight
            ),
          }
        );

      const responseText =
        await response.text();

      console.log(
        "ADD STATUS:",
        response.status
      );

      console.log(
        "ADD RESPONSE:",
        responseText
      );

      if (!response.ok) {

        throw new Error(
          responseText ||
            "Unable to add flight"
        );
      }

      alert(
        "Flight added successfully!"
      );

      resetForm();

      await fetchFlights();

    } catch (error) {

      console.error(
        "FLIGHT SAVE ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to save flight"
      );

    } finally {

      setAdding(false);
    }
  };

  // =====================================================
  // DELETE FLIGHT
  // =====================================================

  const handleDeleteFlight = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this flight?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const headers = {};

      if (token) {

        headers.Authorization =
          `Bearer ${token}`;
      }

      const response =
        await fetch(
          `${API_URL}/api/flights/${id}`,
          {
            method: "DELETE",
            headers: headers,
          }
        );

      const responseText =
        await response.text();

      console.log(
        "DELETE RESPONSE:",
        responseText
      );

      if (!response.ok) {

        throw new Error(
          responseText ||
            "Unable to delete flight"
        );
      }

      alert(
        "Flight deleted successfully!"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchFlights();

    } catch (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to delete flight"
      );
    }
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    resetForm();
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
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <h2>
          Loading...
        </h2>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >

        {/* ==============================================
            HEADER
        ============================================== */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >

          <div>

            <h1>
              ✈ Manage Flights
            </h1>

            <p
              style={{
                color: "#666",
              }}
            >
              View and manage all flights.
            </p>

          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            {/* BACK */}

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              style={{
                padding:
                  "12px 22px",
                background:
                  "#dc2626",
                color: "white",
                border: "none",
                borderRadius:
                  "6px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              ← Back
            </button>

            {/* ADD / CLOSE */}

            <button
              type="button"
              onClick={() => {

                if (
                  editingId !== null
                ) {

                  resetForm();

                } else {

                  setShowForm(
                    !showForm
                  );
                }

              }}
              style={{
                padding:
                  "12px 22px",
                background:
                  "#16a34a",
                color: "white",
                border: "none",
                borderRadius:
                  "6px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >

              {editingId !== null
                ? "Cancel Edit"
                : showForm
                ? "Close Form"
                : "+ Add Flight"}

            </button>

          </div>

        </div>

        {/* ==============================================
            ADD / EDIT FORM
        ============================================== */}

        {showForm && (

          <div
            style={{
              background:
                "white",
              padding: "30px",
              borderRadius:
                "12px",
              boxShadow:
                "0 3px 12px rgba(0,0,0,0.08)",
              marginTop:
                "25px",
            }}
          >

            <h2>

              {editingId !== null
                ? `✏ Edit Flight #${editingId}`
                : "➕ Add New Flight"}

            </h2>

            <form
              onSubmit={
                handleSubmitFlight
              }
            >

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >

                {/* ======================================
                    FLIGHT NUMBER
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Flight Number
                    </strong>
                  </label>

                  <input
                    type="text"
                    name="flightNumber"
                    value={
                      formData.flightNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: AI101"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    AIRLINE
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Airline Name
                    </strong>
                  </label>

                  <input
                    type="text"
                    name="airlineName"
                    value={
                      formData.airlineName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Air India"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    DEPARTURE CITY
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Departure City
                    </strong>
                  </label>

                  <select
                    name="sourceCity"
                    value={
                      formData.sourceCity
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      inputStyle
                    }
                  >

                    <option value="">
                      Select departure city
                    </option>

                    {cities.map(
                      (city) => (

                        <option
                          key={city}
                          value={city}
                        >
                          {city}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ======================================
                    ARRIVAL CITY
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Arrival City
                    </strong>
                  </label>

                  <select
                    name="destinationCity"
                    value={
                      formData.destinationCity
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      inputStyle
                    }
                  >

                    <option value="">
                      Select arrival city
                    </option>

                    {cities.map(
                      (city) => (

                        <option
                          key={city}
                          value={city}
                        >
                          {city}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ======================================
                    ECONOMY
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Economy Price
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="economyPrice"
                    value={
                      formData.economyPrice
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="Enter price"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    PREMIUM ECONOMY
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Premium Economy Price
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="premiumEconomyPrice"
                    value={
                      formData.premiumEconomyPrice
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="Enter price"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    BUSINESS
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Business Price
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="businessPrice"
                    value={
                      formData.businessPrice
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="Enter price"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    FIRST CLASS
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      First Class Price
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="firstClassPrice"
                    value={
                      formData.firstClassPrice
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="Enter price"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    AVAILABLE SEATS
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Available Seats
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="availableSeats"
                    value={
                      formData.availableSeats
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    TOTAL SEATS
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Total Seats
                    </strong>
                  </label>

                  <input
                    type="number"
                    name="totalSeats"
                    value={
                      formData.totalSeats
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                    style={
                      inputStyle
                    }
                  />

                </div>

                {/* ======================================
                    STATUS
                ====================================== */}

                <div>

                  <label>
                    <strong>
                      Status
                    </strong>
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      inputStyle
                    }
                  >

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="CANCELLED">
                      CANCELLED
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>

                  </select>

                </div>

              </div>

              {/* ========================================
                  ADD / UPDATE BUTTON
              ======================================== */}

              <div
                style={{
                  marginTop:
                    "30px",
                }}
              >

                <button
                  type="submit"
                  disabled={adding}
                  style={{
                    padding:
                      "12px 25px",

                    background:
                      adding
                        ? "#9ca3af"
                        : "#0066ff",

                    color:
                      "white",

                    border:
                      "none",

                    borderRadius:
                      "6px",

                    cursor:
                      adding
                        ? "not-allowed"
                        : "pointer",

                    fontWeight:
                      "bold",

                    fontSize:
                      "16px",
                  }}
                >

                  {adding
                    ? editingId !== null
                      ? "Updating Flight..."
                      : "Adding Flight..."
                    : editingId !== null
                    ? "Update Flight"
                    : "Add Flight"}

                </button>

                {/* CANCEL */}

                {editingId !== null && (

                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    style={{
                      padding:
                        "12px 25px",

                      marginLeft:
                        "10px",

                      background:
                        "#6b7280",

                      color:
                        "white",

                      border:
                        "none",

                      borderRadius:
                        "6px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",

                      fontSize:
                        "16px",
                    }}
                  >
                    Cancel
                  </button>

                )}

              </div>

            </form>

          </div>

        )}

        {/* ==============================================
            FLIGHT TABLE
        ============================================== */}

        <div
          style={{
            background:
              "white",

            padding:
              "25px",

            borderRadius:
              "12px",

            boxShadow:
              "0 3px 12px rgba(0,0,0,0.08)",

            marginTop:
              "25px",

            overflowX:
              "auto",
          }}
        >

          <h2>
            All Flights
          </h2>

          {flights.length === 0 ? (

            <h3>
              No flights found.
            </h3>

          ) : (

            <table
              style={{
                width:
                  "100%",

                borderCollapse:
                  "collapse",

                marginTop:
                  "20px",
              }}
            >

              <thead>

                <tr>

                  <th style={thStyle}>
                    ID
                  </th>

                  <th style={thStyle}>
                    Flight Number
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
                    Economy
                  </th>

                  <th style={thStyle}>
                    Premium Economy
                  </th>

                  <th style={thStyle}>
                    Business
                  </th>

                  <th style={thStyle}>
                    First Class
                  </th>

                  <th style={thStyle}>
                    Available
                  </th>

                  <th style={thStyle}>
                    Total
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {flights.map(
                  (flight) => (

                    <tr
                      key={
                        flight.id
                      }
                    >

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          flight.id
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          flight.flightNumber ||
                          "-"
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          flight.airlineName ||
                          "-"
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {getAirportDisplay(
                          flight.sourceAirport
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {getAirportDisplay(
                          flight.destinationAirport
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        ₹
                        {
                          flight.economyPrice ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        ₹
                        {
                          flight.premiumEconomyPrice ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        ₹
                        {
                          flight.businessPrice ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        ₹
                        {
                          flight.firstClassPrice ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          flight.availableSeats ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          flight.totalSeats ??
                          0
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >

                        <span
                          style={{
                            padding:
                              "5px 10px",

                            borderRadius:
                              "20px",

                            background:
                              flight.status ===
                              "CANCELLED"
                                ? "#fee2e2"
                                : "#dcfce7",

                            color:
                              flight.status ===
                              "CANCELLED"
                                ? "#b91c1c"
                                : "#15803d",

                            fontWeight:
                              "bold",

                            fontSize:
                              "12px",
                          }}
                        >
                          {
                            flight.status ||
                            "ACTIVE"
                          }
                        </span>

                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >

                        <div
                          style={{
                            display:
                              "flex",

                            gap:
                              "8px",
                          }}
                        >

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEditFlight(
                                flight
                              )
                            }
                            style={{
                              padding:
                                "8px 14px",

                              background:
                                "#2563eb",

                              color:
                                "white",

                              border:
                                "none",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer",

                              fontWeight:
                                "bold",
                            }}
                          >
                            ✏ Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteFlight(
                                flight.id
                              )
                            }
                            style={{
                              padding:
                                "8px 14px",

                              background:
                                "#dc2626",

                              color:
                                "white",

                              border:
                                "none",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer",

                              fontWeight:
                                "bold",
                            }}
                          >
                            🗑 Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle = {

  width: "100%",

  padding: "12px",

  marginTop: "8px",

  border:
    "1px solid #ccc",

  borderRadius: "6px",

  boxSizing:
    "border-box",

  fontSize: "15px",

  background:
    "white",
};

// =====================================================
// TABLE HEADER STYLE
// =====================================================

const thStyle = {

  padding: "15px",

  borderBottom:
    "2px solid #ddd",

  textAlign: "left",

  whiteSpace:
    "nowrap",
};

// =====================================================
// TABLE DATA STYLE
// =====================================================

const tdStyle = {

  padding: "15px",

  borderBottom:
    "1px solid #eee",

  whiteSpace:
    "nowrap",
};

export default AdminFlights;