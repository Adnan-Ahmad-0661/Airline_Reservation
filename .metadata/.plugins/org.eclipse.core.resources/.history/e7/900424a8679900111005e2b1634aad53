import { useEffect, useState } from "react";
import API from "../services/api";

function FlightManagement() {
  // =====================================================
  // EMPTY FORM
  // =====================================================

  const emptyForm = {
    flightNumber: "",
    airlineName: "",
    economyPrice: "",
    premiumEconomyPrice: "",
    businessPrice: "",
    firstClassPrice: "",
    sourceAirportId: "",
    destinationAirportId: "",
    availableSeats: "52",
    totalSeats: "52",
    status: "ACTIVE",
  };

  // =====================================================
  // STATES
  // =====================================================

  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD FLIGHTS
  // =====================================================

  const loadFlights = async () => {
    try {
      const response = await API.get("/api/flights");

      console.log("Flights:", response.data);

      setFlights(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Flights Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load flights."
      );
    }
  };

  // =====================================================
  // LOAD AIRPORTS
  // =====================================================

  const loadAirports = async () => {
    try {
      const response = await API.get(
        "/api/airports"
      );

      console.log(
        "Airports received:",
        response.data
      );

      setAirports(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        "Load Airports Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to load airports."
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        loadFlights(),
        loadAirports(),
      ]);
    };

    loadData();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
  };

  // =====================================================
  // ADD / UPDATE FLIGHT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (!form.flightNumber.trim()) {
      alert(
        "Please enter flight number."
      );
      return;
    }

    if (!form.airlineName.trim()) {
      alert(
        "Please enter airline name."
      );
      return;
    }

    if (!form.sourceAirportId) {
      alert(
        "Please select source airport."
      );
      return;
    }

    if (!form.destinationAirportId) {
      alert(
        "Please select destination airport."
      );
      return;
    }

    if (
      String(form.sourceAirportId) ===
      String(form.destinationAirportId)
    ) {
      alert(
        "Source and destination cannot be same."
      );
      return;
    }

    if (
      !form.totalSeats ||
      Number(form.totalSeats) <= 0
    ) {
      alert(
        "Total seats must be greater than 0."
      );
      return;
    }

    if (
      form.availableSeats === "" ||
      Number(form.availableSeats) < 0
    ) {
      alert(
        "Available seats cannot be negative."
      );
      return;
    }

    if (
      Number(form.availableSeats) >
      Number(form.totalSeats)
    ) {
      alert(
        "Available seats cannot be greater than total seats."
      );
      return;
    }

    // ---------------------------------------------------
    // FLIGHT DATA
    // ---------------------------------------------------

    const flightData = {
      flightNumber:
        form.flightNumber.trim(),

      airlineName:
        form.airlineName.trim(),

      economyPrice:
        Number(form.economyPrice || 0),

      premiumEconomyPrice:
        Number(
          form.premiumEconomyPrice || 0
        ),

      businessPrice:
        Number(form.businessPrice || 0),

      firstClassPrice:
        Number(
          form.firstClassPrice || 0
        ),

      availableSeats:
        Number(form.availableSeats),

      totalSeats:
        Number(form.totalSeats),

      status:
        form.status || "ACTIVE",

      // SOURCE AIRPORT
      sourceAirport: {
        id: Number(
          form.sourceAirportId
        ),
      },

      // DESTINATION AIRPORT
      destinationAirport: {
        id: Number(
          form.destinationAirportId
        ),
      },
    };

    console.log(
      "Sending Flight Data:",
      flightData
    );

    // ---------------------------------------------------
    // SAVE
    // ---------------------------------------------------

    try {
      setLoading(true);

      // =================================================
      // UPDATE
      // =================================================

      if (editingId !== null) {
        const response =
          await API.put(
            `/api/flights/${editingId}`,
            flightData
          );

        console.log(
          "Update Response:",
          response.data
        );

        alert(
          "Flight updated successfully."
        );
      }

      // =================================================
      // ADD
      // =================================================

      else {
        const response =
          await API.post(
            "/api/flights",
            flightData
          );

        console.log(
          "Add Response:",
          response.data
        );

        alert(
          "Flight added successfully."
        );
      }

      // Reset
      resetForm();

      // Reload flights
      await loadFlights();

      // Reload airports also
      await loadAirports();

    } catch (error) {
      console.error(
        "Save Flight Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to save flight."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EDIT FLIGHT
  // =====================================================

  const handleEdit = (flight) => {
    console.log(
      "Editing Flight:",
      flight
    );

    setEditingId(flight.id);

    setForm({
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

      sourceAirportId:
        flight.sourceAirport?.id
          ? String(
              flight.sourceAirport.id
            )
          : "",

      destinationAirportId:
        flight.destinationAirport?.id
          ? String(
              flight.destinationAirport.id
            )
          : "",

      availableSeats:
        flight.availableSeats ?? "",

      totalSeats:
        flight.totalSeats ?? "52",

      status:
        flight.status || "ACTIVE",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL FLIGHT
  // =====================================================

  const handleCancel = async (id) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this flight?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      setLoading(true);

      await API.put(
        `/api/flights/cancel/${id}`
      );

      alert(
        "Flight cancelled successfully."
      );

      await loadFlights();

    } catch (error) {
      console.error(
        "Cancel Flight Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to cancel flight."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE FLIGHT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to permanently delete this flight?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(
        `/api/flights/${id}`
      );

      alert(
        "Flight deleted successfully."
      );

      await loadFlights();

    } catch (error) {
      console.error(
        "Delete Flight Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to delete flight."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET AIRPORT DISPLAY NAME
  // =====================================================

  const getAirportName = (airport) => {
    if (!airport) {
      return "--";
    }

    const city =
      airport.city || "";

    const code =
      airport.airportCode || "";

    const name =
      airport.airportName || "";

    if (city && code && name) {
      return `${city} - ${code} (${name})`;
    }

    if (city && code) {
      return `${city} - ${code}`;
    }

    if (city && name) {
      return `${city} - ${name}`;
    }

    if (code && name) {
      return `${code} - ${name}`;
    }

    return (
      city ||
      name ||
      code ||
      `Airport ${airport.id}`
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "30px",
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

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "15px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
              }}
            >
              ✈ Flight Management
            </h1>

            <p
              style={{
                color: "#666",
                marginTop: "8px",
              }}
            >
              Add, update, cancel and
              delete flights.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            style={buttonStyle(
              "#2563eb"
            )}
          >
            + Add New Flight
          </button>
        </div>

        {/* =================================================
            ADD / UPDATE FORM
        ================================================= */}

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            {editingId !== null
              ? `✏️ Update Flight #${editingId}`
              : "➕ Add Flight"}
          </h2>

          {/* AIRPORT COUNT */}

          <div
            style={{
              marginBottom: "20px",
              padding: "12px 15px",
              background:
                airports.length > 0
                  ? "#ecfdf5"
                  : "#fff7ed",
              color:
                airports.length > 0
                  ? "#166534"
                  : "#c2410c",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            {airports.length > 0
              ? `${airports.length} airport(s) loaded`
              : "No airports found. Please add airports first."}
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <div style={gridStyle}>

              {/* FLIGHT NUMBER */}

              <Input
                label="Flight Number"
                name="flightNumber"
                value={
                  form.flightNumber
                }
                onChange={
                  handleChange
                }
                placeholder="Example: AI101"
              />

              {/* AIRLINE */}

              <Input
                label="Airline Name"
                name="airlineName"
                value={
                  form.airlineName
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Air India"
              />

              {/* SOURCE */}

              <Select
                label="Source"
                name="sourceAirportId"
                value={
                  form.sourceAirportId
                }
                onChange={
                  handleChange
                }
                airports={airports}
              />

              {/* DESTINATION */}

              <Select
                label="Destination"
                name="destinationAirportId"
                value={
                  form.destinationAirportId
                }
                onChange={
                  handleChange
                }
                airports={airports}
              />

              {/* ECONOMY */}

              <Input
                label="Economy Price"
                name="economyPrice"
                type="number"
                value={
                  form.economyPrice
                }
                onChange={
                  handleChange
                }
                placeholder="5000"
              />

              {/* PREMIUM ECONOMY */}

              <Input
                label="Premium Economy Price"
                name="premiumEconomyPrice"
                type="number"
                value={
                  form.premiumEconomyPrice
                }
                onChange={
                  handleChange
                }
                placeholder="7000"
              />

              {/* BUSINESS */}

              <Input
                label="Business Price"
                name="businessPrice"
                type="number"
                value={
                  form.businessPrice
                }
                onChange={
                  handleChange
                }
                placeholder="12000"
              />

              {/* FIRST CLASS */}

              <Input
                label="First Class Price"
                name="firstClassPrice"
                type="number"
                value={
                  form.firstClassPrice
                }
                onChange={
                  handleChange
                }
                placeholder="20000"
              />

              {/* TOTAL SEATS */}

              <Input
                label="Total Seats"
                name="totalSeats"
                type="number"
                value={
                  form.totalSeats
                }
                onChange={
                  handleChange
                }
                placeholder="52"
              />

              {/* AVAILABLE SEATS */}

              <Input
                label="Available Seats"
                name="availableSeats"
                type="number"
                value={
                  form.availableSeats
                }
                onChange={
                  handleChange
                }
                placeholder="52"
              />

              {/* STATUS */}

              {editingId !== null && (
                <div>
                  <label
                    style={labelStyle}
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
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
              )}

            </div>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                disabled={
                  loading ||
                  airports.length === 0
                }
                style={buttonStyle(
                  loading ||
                    airports.length ===
                      0
                    ? "#9ca3af"
                    : "#16a34a"
                )}
              >
                {loading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Flight"
                  : "Add Flight"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  style={buttonStyle(
                    "#6b7280"
                  )}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* =================================================
            FLIGHT LIST
        ================================================= */}

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            📋 All Flights
          </h2>

          {loading && (
            <p>
              Loading...
            </p>
          )}

          {!loading &&
            flights.length === 0 && (
              <p>
                No flights available.
              </p>
            )}

          {!loading &&
            flights.length > 0 && (
              <div
                style={{
                  overflowX:
                    "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    marginTop:
                      "15px",
                    minWidth:
                      "1100px",
                  }}
                >
                  <thead>
                    <tr>

                      <th
                        style={
                          thStyle
                        }
                      >
                        ID
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Flight
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Airline
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Source
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Destination
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Economy
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Premium
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Business
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        First Class
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Seats
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
                        Status
                      </th>

                      <th
                        style={
                          thStyle
                        }
                      >
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

                          {/* ID */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {
                              flight.id
                            }
                          </td>

                          {/* FLIGHT */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {flight.flightNumber ||
                              "--"}
                          </td>

                          {/* AIRLINE */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {flight.airlineName ||
                              "--"}
                          </td>

                          {/* SOURCE */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {getAirportName(
                              flight.sourceAirport
                            )}
                          </td>

                          {/* DESTINATION */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {getAirportName(
                              flight.destinationAirport
                            )}
                          </td>

                          {/* ECONOMY */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            ₹
                            {flight.economyPrice ??
                              0}
                          </td>

                          {/* PREMIUM */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            ₹
                            {flight.premiumEconomyPrice ??
                              0}
                          </td>

                          {/* BUSINESS */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            ₹
                            {flight.businessPrice ??
                              0}
                          </td>

                          {/* FIRST CLASS */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            ₹
                            {flight.firstClassPrice ??
                              0}
                          </td>

                          {/* SEATS */}

                          <td
                            style={
                              tdStyle
                            }
                          >
                            {flight.availableSeats ??
                              0}
                            /
                            {flight.totalSeats ??
                              0}
                          </td>

                          {/* STATUS */}

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
                                fontWeight:
                                  "600",
                                fontSize:
                                  "12px",

                                background:
                                  flight.status ===
                                  "CANCELLED"
                                    ? "#fee2e2"
                                    : flight.status ===
                                      "INACTIVE"
                                    ? "#f3f4f6"
                                    : "#dcfce7",

                                color:
                                  flight.status ===
                                  "CANCELLED"
                                    ? "#dc2626"
                                    : flight.status ===
                                      "INACTIVE"
                                    ? "#6b7280"
                                    : "#16a34a",
                              }}
                            >
                              {flight.status ||
                                "ACTIVE"}
                            </span>
                          </td>

                          {/* ACTIONS */}

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
                                  "7px",
                                flexWrap:
                                  "wrap",
                              }}
                            >

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    flight
                                  )
                                }
                                style={smallButton(
                                  "#2563eb"
                                )}
                              >
                                ✏️ Edit
                              </button>

                              {/* CANCEL */}

                              {flight.status !==
                                "CANCELLED" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancel(
                                      flight.id
                                    )
                                  }
                                  style={smallButton(
                                    "#f59e0b"
                                  )}
                                >
                                  ❌ Cancel
                                </button>
                              )}

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    flight.id
                                  )
                                }
                                style={smallButton(
                                  "#dc2626"
                                )}
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
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label
        style={labelStyle}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={
          placeholder
        }
        min={
          type === "number"
            ? "0"
            : undefined
        }
        style={inputStyle}
      />
    </div>
  );
}

// =====================================================
// AIRPORT SELECT COMPONENT
// =====================================================

function Select({
  label,
  name,
  value,
  onChange,
  airports,
}) {
  return (
    <div>
      <label
        style={labelStyle}
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={inputStyle}
      >
        <option value="">
          Select Airport
        </option>

        {airports.map(
          (airport) => (
            <option
              key={
                airport.id
              }
              value={
                airport.id
              }
            >
              {airport.city ||
                "Unknown City"}
              {" - "}
              {airport.airportCode ||
                "N/A"}

              {airport.airportName
                ? ` (${airport.airportName})`
                : ""}
            </option>
          )
        )}
      </select>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  height: "44px",
  padding: "0 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "15px",
  boxSizing: "border-box",
  background: "#ffffff",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom:
    "2px solid #e5e7eb",
  background: "#f8fafc",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px",
  borderBottom:
    "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const buttonStyle = (
  background
) => ({
  background,
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "10px 18px",
  cursor: "pointer",
  fontWeight: "600",
});

const smallButton = (
  background
) => ({
  background,
  color: "white",
  border: "none",
  borderRadius: "5px",
  padding: "7px 10px",
  cursor: "pointer",
  fontWeight: "600",
});

export default FlightManagement;