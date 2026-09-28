import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          "Invalid email or password"
        );

      }

      console.log("LOGIN RESPONSE:", data);

      if (!data.accessToken) {
        throw new Error(
          "Access token not received from server."
        );
      }

      if (!data.refreshToken) {
        throw new Error(
          "Refresh token not received from server."
        );
      }

      const role = String(data.role || "")
        .replace("ROLE_", "")
        .toUpperCase();

      // =========================================
      // SAVE LOGIN DATA
      // =========================================

      localStorage.setItem(
        "token",
        data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

      localStorage.setItem(
        "userId",
        data.userId || ""
      );

      localStorage.setItem(
        "userName",
        data.name || ""
      );

      localStorage.setItem(
        "userEmail",
        data.email || email.trim()
      );

      localStorage.setItem(
        "userRole",
        role
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          name: data.name,
          email: data.email || email.trim(),
          role: role,
        })
      );

      alert("Login successful!");

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(
        error.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: "30px 20px",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        boxSizing: "border-box",

        position: "relative",

        overflow: "hidden",
      }}
    >

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background:
            "rgba(255,255,255,0.08)",
          top: "-120px",
          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background:
            "rgba(255,255,255,0.06)",
          bottom: "-220px",
          right: "-150px",
        }}
      />

      {/* =========================================
          LOGIN CARD
      ========================================= */}

      <div
        style={{
          width: "440px",
          maxWidth: "100%",

          background:
            "rgba(255,255,255,0.97)",

          borderRadius: "22px",

          padding: "42px 40px",

          boxShadow:
            "0 25px 70px rgba(0,0,0,0.30)",

          position: "relative",

          zIndex: 2,

          boxSizing: "border-box",

          border:
            "1px solid rgba(255,255,255,0.5)",
        }}
      >

        {/* =========================================
            LOGO
        ========================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >

          <div
            style={{
              width: "72px",
              height: "72px",

              margin: "0 auto 16px",

              borderRadius: "20px",

              background:
                "linear-gradient(135deg, #2563eb, #7c3aed)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              fontSize: "36px",

              boxShadow:
                "0 10px 25px rgba(37,99,235,0.35)",
            }}
          >
            ✈️
          </div>

          <h1
            style={{
              margin: "0",

              fontSize: "32px",

              fontWeight: "800",

              color: "#111827",

              letterSpacing: "-0.5px",
            }}
          >
           LOGIN
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",

              color: "#6b7280",

              fontSize: "14px",

              lineHeight: "22px",
            }}
          >
            Login to your
            <strong
              style={{
                color: "#2563eb",
                marginLeft: "4px",
              }}
            >
              Airline Reservation
            </strong>
            {" "}account
          </p>

        </div>

        {/* =========================================
            LOGIN FORM
        ========================================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "8px",

                fontSize: "14px",

                fontWeight: "700",

                color: "#374151",
              }}
            >
              📧 Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }

              style={{
                width: "100%",

                padding:
                  "14px 15px",

                boxSizing:
                  "border-box",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "10px",

                fontSize: "15px",

                outline: "none",

                background: "#f9fafb",

                transition:
                  "all 0.2s",
              }}
            />

          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "8px",

                fontSize: "14px",

                fontWeight: "700",

                color: "#374151",
              }}
            >
              🔐 Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }

              style={{
                width: "100%",

                padding:
                  "14px 15px",

                boxSizing:
                  "border-box",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "10px",

                fontSize: "15px",

                outline: "none",

                background: "#f9fafb",
              }}
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}

            style={{
              width: "100%",

              padding:
                "14px",

              background:
                loading
                  ? "#9ca3af"
                  : "linear-gradient(135deg, #2563eb, #4f46e5)",

              color: "white",

              border: "none",

              borderRadius: "10px",

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",

              fontWeight: "700",

              fontSize: "16px",

              boxShadow:
                loading
                  ? "none"
                  : "0 8px 20px rgba(37,99,235,0.30)",

              transition:
                "all 0.2s",
            }}
          >

            {loading
              ? "⏳ Logging in..."
              : "✈️ Login to Account"}

          </button>

        </form>

        {/* =========================================
            DIVIDER
        ========================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: "12px",

            margin:
              "28px 0 22px",

            color: "#9ca3af",

            fontSize: "12px",
          }}
        >

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#e5e7eb",
            }}
          />

          OR

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#e5e7eb",
            }}
          />

        </div>

        {/* =========================================
            CREATE ACCOUNT
        ========================================= */}

        <div
          style={{
            textAlign: "center",
          }}
        >

          <p
            style={{
              margin:
                "0 0 12px",

              color: "#6b7280",

              fontSize: "14px",
            }}
          >
            Don't have an account?
          </p>

          <button
            type="button"

            onClick={() =>
              navigate("/create-user")
            }

            disabled={loading}

            style={{
              width: "100%",

              padding:
                "12px",

              background:
                "linear-gradient(135deg, #16a34a, #059669)",

              color: "white",

              border: "none",

              borderRadius: "10px",

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",

              fontWeight: "700",

              fontSize: "15px",

              boxShadow:
                "0 7px 18px rgba(22,163,74,0.25)",
            }}
          >
            👤 Create New Account
          </button>

        </div>

        {/* =========================================
            BACK HOME
        ========================================= */}

        <button
          type="button"

          onClick={() =>
            navigate("/")
          }

          disabled={loading}

          style={{
            width: "100%",

            padding:
              "11px",

            marginTop: "12px",

            background:
              "#f3f4f6",

            color: "#374151",

            border:
              "1px solid #e5e7eb",

            borderRadius:
              "10px",

            cursor:
              loading
                ? "not-allowed"
                : "pointer",

            fontWeight: "600",

            fontSize: "14px",
          }}
        >
          ← Back to Home
        </button>

        {/* =========================================
            SECURITY TEXT
        ========================================= */}

        <p
          style={{
            textAlign: "center",

            margin:
              "22px 0 0",

            color: "#9ca3af",

            fontSize: "11px",
          }}
        >
          🔒 Secure login powered by JWT Authentication
        </p>

      </div>

    </div>
  );
}

export default Login;