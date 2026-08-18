import { useState } from "react";
import API from "../services/api";

function FlightSearch() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [flights, setFlights] = useState([]);

  const [loading, setLoading] = useState(false);

  // ROUTE POPUP
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // =====================================================
  // SEARCH FLIGHT
  // =====================================================

  const searchFlights = async () => {

    if (!source.trim()) {
      alert("Please enter source city.");
      return;
    }

    if (!destination.trim()) {
      alert("Please enter destination city.");
      return;
    }

    try {

      setLoading(true);

      const response = await API.get(
        "/api/flights/search",
        {
          params: {
            source: source.trim(),
            destination: destination.trim(),
          },
        }
      );

      console.log(
        "FLIGHT SEARCH RESPONSE:",
        response.data
      );

      setFlights(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Flight Search Error:",
        error
      );

      setFlights([]);

      if (error.response?.status === 404) {
        alert("No flights found.");
      } else {
        alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Unable to search flights."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // VIEW ROUTE
  // =====================================================

  const handleViewRoute = async (flight) => {

    try {

      console.log(
        "SELECTED FLIGHT:",
        flight
      );

      if (
        !flight.route ||
        !flight.route.id
      ) {

        alert(
          "Route is not available for this flight."
        );

        return;
      }

      setSelectedFlight(flight);

      setLoadingRoute(true);

      const response = await API.get(
        `/api/routes/${flight.route.id}/stops`
      );

      console.log(
        "ROUTE STOPS:",
        response.data
      );

      setRouteStops(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Route Error:",
        error
      );

      alert(
        error.response?.data?.message ||
        error.response?.data ||
        "Unable to load route."
      );

      setSelectedFlight(null);

    } finally {

      setLoadingRoute(false);

    }
  };


  // =====================================================
  // CLOSE ROUTE
  // =====================================================

  const closeRoute = () => {

    setSelectedFlight(null);

    setRouteStops([]);

  };


  // =====================================================
  // BOOK NOW
  // =====================================================

  const handleBookNow = (flight) => {

    console.log(
      "BOOK FLIGHT:",
      flight
    );

    /*
      Yahan baad me tum booking page par
      navigate kar sakte ho.

      Example:

      navigate(`/book-flight/${flight.id}`);

    */

    alert(
      `Booking selected for ${flight.flightNumber}`
    );
  };


  // =====================================================
  // AIRPORT NAME
  // =====================================================

  const getAirportName = (airport) => {

    if (!airport) {
      return "--";
    }

    return (
      airport.city ||
      airport.airportName ||
      airport.airportCode ||
      "--"
    );
  };


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <h1>
          ✈️ Search Flights
        </h1>

        <p
          style={{
            color: "#666",
          }}
        >
          Search available flights and view their routes.
        </p>


        {/* =================================================
            SEARCH BOX
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr auto",
              gap: "15px",
              alignItems: "end",
            }}
          >

            {/* SOURCE */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600",
                }}
              >
                From
              </label>

              <input
                type="text"
                value={source}
                onChange={(e) =>
                  setSource(e.target.value)
                }
                placeholder="Lucknow"
                style={inputStyle}
              />

            </div>


            {/* DESTINATION */}

            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: "600",
                }}
              >
                To
              </label>

              <input
                type="text"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                placeholder="Bangalore"
                style={inputStyle}
              />

            </div>


            {/* SEARCH */}

            <button
              type="button"
              onClick={searchFlights}
              disabled={loading}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "12px 25px",
                cursor: "pointer",
                fontWeight: "600",
                height: "44px",
              }}
            >

              {loading
                ? "Searching..."
                : "🔍 Search"}

            </button>

          </div>

        </div>


        {/* =================================================
            RESULTS
        ================================================= */}

        {flights.length === 0 && !loading && (

          <div
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#666",
            }}
          >

            Search for a flight to see results.

          </div>

        )}


        {flights.length > 0 && (

          <div>

            <h2>
              ✈️ Available Flights
            </h2>


            {flights.map((flight) => (

              <div
                key={flight.id}
                style={{
                  background: "#ffffff",
                  padding: "22px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.08)",
                }}
              >

                {/* FLIGHT TOP */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >

                  <div>

                    <h3
                      style={{
                        margin: "0 0 8px 0",
                      }}
                    >
                      ✈️{" "}
                      {flight.flightNumber ||
                        "--"}
                    </h3>

                    <p
                      style={{
                        margin: "0",
                        color: "#666",
                      }}
                    >
                      {flight.airlineName ||
                        "--"}
                    </p>

                  </div>


                  {/* PRICE */}

                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >

                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "#16a34a",
                      }}
                    >
                      ₹
                      {flight.economyPrice ??
                        0}
                    </div>

                    <small>
                      Economy
                    </small>

                  </div>

                </div>


                {/* ROUTE */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >

                  <div>

                    <strong>
                      {getAirportName(
                        flight.sourceAirport
                      )}
                    </strong>

                  </div>


                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "#2563eb",
                      fontSize: "20px",
                    }}
                  >
                    ✈️ ───────── ✈️
                  </div>


                  <div>

                    <strong>
                      {getAirportName(
                        flight.destinationAirport
                      )}
                    </strong>

                  </div>

                </div>


                {/* SEATS */}

                <div
                  style={{
                    marginTop: "15px",
                    color: "#555",
                  }}
                >
                  Available Seats:{" "}
                  <strong>
                    {flight.availableSeats ??
                      0}
                  </strong>
                  {" / "}
                  {flight.totalSeats ??
                    0}
                </div>


                {/* BUTTONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >

                  {/* VIEW ROUTE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleViewRoute(
                        flight
                      )
                    }
                    style={{
                      background: "#7c3aed",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 18px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🗺️ View Route
                  </button>


                  {/* BOOK NOW */}

                  <button
                    type="button"
                    onClick={() =>
                      handleBookNow(
                        flight
                      )
                    }
                    style={{
                      background: "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 18px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🎫 Book Now
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* =================================================
          ROUTE POPUP
      ================================================= */}

      {selectedFlight && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "450px",
              background: "#ffffff",
              borderRadius: "15px",
              padding: "30px",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.25)",
            }}
          >

            {/* TITLE */}

            <h2
              style={{
                textAlign: "center",
                marginTop: 0,
              }}
            >
              ✈️ Flight Route
            </h2>


            <p
              style={{
                textAlign: "center",
                color: "#666",
              }}
            >
              {selectedFlight.flightNumber}
            </p>


            {loadingRoute ? (

              <p
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                Loading route...
              </p>

            ) : (

              <div>

                {/* SOURCE */}

                <RouteCity
                  city={
                    selectedFlight
                      .sourceAirport
                      ?.city ||
                    "--"
                  }
                  type="source"
                />


                {/* STOPS */}

                {routeStops.map(
                  (stop, index) => (

                    <div
                      key={
                        stop.id ||
                        index
                      }
                    >

                      <Arrow />

                      <RouteCity
                        city={
                          stop.city
                        }
                        type="stop"
                      />

                    </div>

                  )
                )}


                {/* DESTINATION */}

                <Arrow />

                <RouteCity
                  city={
                    selectedFlight
                      .destinationAirport
                      ?.city ||
                    "--"
                  }
                  type="destination"
                />


                {routeStops.length === 0 && (

                  <p
                    style={{
                      textAlign:
                        "center",
                      color: "#777",
                      marginTop:
                        "15px",
                    }}
                  >
                    No intermediate
                    stops.
                  </p>

                )}

              </div>

            )}


            {/* CLOSE */}

            <div
              style={{
                textAlign: "center",
                marginTop: "25px",
              }}
            >

              <button
                type="button"
                onClick={closeRoute}
                style={{
                  background: "#6b7280",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 30px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


// =====================================================
// ROUTE CITY
// =====================================================

function RouteCity({ city, type }) {

  let background = "#f5f3ff";

  if (type === "source") {
    background = "#eff6ff";
  }

  if (type === "destination") {
    background = "#ecfdf5";
  }

  return (

    <div
      style={{
        textAlign: "center",
        fontWeight: "700",
        fontSize: "19px",
        padding: "11px",
        background,
        borderRadius: "8px",
      }}
    >
      {city}
    </div>

  );
}


// =====================================================
// ARROW
// =====================================================

function Arrow() {

  return (

    <div
      style={{
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "700",
        color: "#7c3aed",
        lineHeight: "1",
        margin: "8px 0",
      }}
    >
      ↓
    </div>

  );
}


// =====================================================
// INPUT STYLE
// =====================================================

const inputStyle = {

  width: "100%",
  height: "44px",
  padding: "0 12px",

  border:
    "1px solid #d1d5db",

  borderRadius: "6px",

  fontSize: "15px",

  boxSizing: "border-box",

};


export default FlightSearch;