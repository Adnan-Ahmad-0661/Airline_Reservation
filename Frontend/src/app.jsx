import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Booking from "./pages/Booking.jsx";
import SeatSelection from "./pages/SeatSelection.jsx";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import ViewTicket from "./pages/ViewTicket.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminFlights from "./pages/AdminFlights.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


function App() {

  // ==========================================
  // APPLICATION / BROWSER CLOSE
  // ==========================================
  useEffect(() => {

    const handleAppClose = () => {

      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      fetch("http://localhost:8080/api/auth/offline", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        keepalive: true
      });

    };

    window.addEventListener("pagehide", handleAppClose);

    return () => {
      window.removeEventListener("pagehide", handleAppClose);
    };

  }, []);


  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* CREATE USER */}
        <Route
          path="/create-user"
          element={<CreateUser />}
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* USER ROUTES */}
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seat-selection"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-ticket/:bookingId"
          element={
            <ProtectedRoute>
              <ViewTicket />
            </ProtectedRoute>
          }
        />


        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

		
		<Route
		  path="/profile"
		  element={
		    <ProtectedRoute>
		      <Profile />
		    </ProtectedRoute>
		  }
		/>

        {/* ADMIN FLIGHTS */}
        <Route
          path="/admin/flights"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminFlights />
            </ProtectedRoute>
          }
        />


        {/* INVALID URL */}
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;