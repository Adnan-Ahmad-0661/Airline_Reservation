import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
 

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // PHOTO SELECT
  // =====================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setPhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  // =====================================================
  // CREATE USER
  // =====================================================

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter full name");
      return;
    }

    if (!email.trim()) {
      alert("Please enter email");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    if (!password) {
      alert("Please enter password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
const userData = {
  name: name.trim(),
  email: email.trim(),
  phone: phone.trim(),
  password: password,
};
  

    try {
      setLoading(true);

      const formData = new FormData();


      formData.append(
        "user",
        new Blob(
          [JSON.stringify(userData)],
          {
            type: "application/json",
          }
        )
      );

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      console.log("CREATE USER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              data?.error ||
              "Unable to create user"
        );
      }
alert("User created successfully!");

setName("");
setEmail("");
setPhone("");
setPassword("");
setPhoto(null);
setPhotoPreview("");

navigate("/login");

    } catch (error) {
      console.error(
        "CREATE USER ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to create user"
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
          "linear-gradient(135deg, #07111f 0%, #0b1f3a 45%, #123d70 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily:
          "'Inter', 'Segoe UI', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "rgba(37, 99, 235, 0.18)",
          top: "-250px",
          left: "-200px",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "rgba(6, 182, 212, 0.12)",
          bottom: "-280px",
          right: "-200px",
          filter: "blur(30px)",
        }}
      />

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div
        style={{
          width: "1100px",
          maxWidth: "100%",
          minHeight: "680px",
          background: "#ffffff",
          borderRadius: "28px",
          overflow: "hidden",
          display: "flex",
          boxShadow:
            "0 35px 100px rgba(0,0,0,0.40)",
          position: "relative",
          zIndex: 2,
        }}
      >

        {/* =================================================
            LEFT BRAND SECTION
        ================================================= */}

        <div
          style={{
            width: "42%",
            background:
              "linear-gradient(160deg, #0f3c81 0%, #1554a5 55%, #0ea5c9 100%)",
            padding: "55px 45px",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >

          {/* Decorative circle */}

          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              border:
                "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              right: "-150px",
              top: "-100px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              border:
                "1px solid rgba(255,255,255,0.10)",
              borderRadius: "50%",
              left: "-130px",
              bottom: "-80px",
            }}
          />

          <div>

            {/* LOGO */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "55px",
              }}
            >

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "rgba(255,255,255,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px",
                  border:
                    "1px solid rgba(255,255,255,0.20)",
                }}
              >
                ✈
              </div>

              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                  }}
                >
                  AIRLINE
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.75,
                    letterSpacing: "2px",
                  }}
                >
                  RESERVATION
                </div>
              </div>

            </div>

            {/* HEADING */}

            <div
              style={{
                fontSize: "42px",
                lineHeight: "1.15",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              Your journey
              <br />
              starts here.
            </div>

            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color:
                  "rgba(255,255,255,0.78)",
                marginBottom: "40px",
              }}
            >
              Create your account and get
              access to a smarter and easier
              airline reservation experience.
            </p>

            {/* FEATURES */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >

              <Feature
                icon="✓"
                title="Easy Flight Booking"
                text="Search and book flights easily"
              />

              <Feature
                icon="✓"
                title="Manage Your Trips"
                text="Keep all your bookings in one place"
              />

              <Feature
                icon="✓"
                title="Secure Account"
                text="Your personal data stays protected"
              />

            </div>

          </div>

          {/* LEFT FOOTER */}

          <div
            style={{
              fontSize: "12px",
              color:
                "rgba(255,255,255,0.60)",
              marginTop: "40px",
            }}
          >
            © 2026 Airline Reservation
          </div>

        </div>

        {/* =================================================
            RIGHT FORM SECTION
        ================================================= */}

        <div
          style={{
            width: "58%",
            padding: "48px 55px",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >

          {/* TOP */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >

            <div>

              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#2563eb",
                  letterSpacing: "1.5px",
                  textTransform:
                    "uppercase",
                  marginBottom: "8px",
                }}
              >
                Account Setup
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  color: "#0f172a",
                  fontWeight: "800",
                }}
              >
                Create your account
              </h1>

              <p
                style={{
                  margin:
                    "8px 0 0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Enter your details to get started.
              </p>

            </div>

            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "21px",
              }}
            >
              👤
            </div>

          </div>

          {/* PROGRESS */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "800",
              }}
            >
              1
            </div>

            <div
              style={{
                flex: 1,
                height: "3px",
                background: "#dbeafe",
                margin: "0 10px",
              }}
            />

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "800",
              }}
            >
              2
            </div>

            <div
              style={{
                flex: 1,
                height: "3px",
                background: "#e2e8f0",
                margin: "0 10px",
              }}
            />

            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#f1f5f9",
                color: "#94a3b8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "800",
              }}
            >
              3
            </div>

          </div>

          <form onSubmit={handleCreateUser}>

            {/* NAME */}

            <div style={fieldContainer}>
              <label style={labelStyle}>
                Full Name
              </label>

              <div style={inputWrapper}>
                <span style={inputIcon}>
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div style={fieldContainer}>
              <label style={labelStyle}>
                Email Address
              </label>

              <div style={inputWrapper}>
                <span style={inputIcon}>
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {/* PHONE */}

            <div style={fieldContainer}>
              <label style={labelStyle}>
                Phone Number
              </label>

              <div style={inputWrapper}>
                <span style={inputIcon}>
                  📱
                </span>

                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setPhone(value);
                  }}
                  style={inputStyle}
                />
              </div>

              <p style={hintStyle}>
                Enter your 10-digit mobile number.
              </p>
            </div>

            {/* PASSWORD */}

            <div style={fieldContainer}>
              <label style={labelStyle}>
                Password
              </label>

              <div style={inputWrapper}>
                <span style={inputIcon}>
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />
              </div>

              <p style={hintStyle}>
                Minimum 6 characters.
              </p>
            </div>

            {/* ROLE */}

            {/* <div style={fieldContainer}>
              <label style={labelStyle}>
                Account Type
              </label>

              <div style={inputWrapper}>
                <span style={inputIcon}>
                  🛡
                </span>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target.value
                    )
                  }
                  style={selectStyle}
                >
                  <option value="USER">
                    USER
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>
                </select>
              </div>
            </div> */}

            {/* PHOTO */}

            <div style={fieldContainer}>

              <label style={labelStyle}>
                Profile Photo{" "}
                <span
                  style={{
                    color: "#94a3b8",
                    fontWeight: "400",
                  }}
                >
                  Optional
                </span>
              </label>

              <div
                style={{
                  border:
                    "1.5px dashed #bfdbfe",
                  background: "#f8fbff",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >

                {/* PREVIEW */}

                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "50%",
                    background:
                      "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    border:
                      "2px solid #bfdbfe",
                  }}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "25px",
                      }}
                    >
                      📷
                    </span>
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                  }}
                >

                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#334155",
                      marginBottom: "5px",
                    }}
                  >
                    Upload profile photo
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "10px",
                    }}
                  >
                    JPG or PNG • Maximum 5 MB
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handlePhotoChange
                    }
                    style={{
                      fontSize: "12px",
                      width: "100%",
                    }}
                  />

                </div>

              </div>

            </div>

            {/* CREATE */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                marginTop: "5px",
                border: "none",
                borderRadius: "12px",
                background: loading
                  ? "#94a3b8"
                  : "linear-gradient(90deg,#2563eb,#0ea5e9)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "800",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                boxShadow:
                  loading
                    ? "none"
                    : "0 12px 25px rgba(37,99,235,0.25)",
              }}
            >
              {loading
                ? "⏳ Creating Account..."
                : "Create Account  →"}
            </button>

            {/* LOGIN */}

            <div
              style={{
                textAlign: "center",
                marginTop: "22px",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}

              <span
                onClick={() =>
                  navigate("/login")
                }
                style={{
                  color: "#2563eb",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                Sign in
              </span>
            </div>

            {/* HOME */}

            <div
              style={{
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              <span
                onClick={() =>
                  navigate("/")
                }
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                ← Back to Home
              </span>
            </div>

          </form>

          {/* SECURITY */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "7px",
              marginTop: "28px",
              paddingTop: "18px",
              borderTop:
                "1px solid #e2e8f0",
              color: "#94a3b8",
              fontSize: "11px",
            }}
          >
            <span>🔒</span>
            <span>
              Your information is protected with secure authentication
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

// =====================================================
// FEATURE COMPONENT
// =====================================================

function Feature({ icon, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background:
            "rgba(255,255,255,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          color: "#ffffff",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            marginBottom: "3px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "12px",
            color:
              "rgba(255,255,255,0.65)",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const fieldContainer = {
  marginBottom: "18px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "750",
  color: "#334155",
};

const inputWrapper = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  border: "1px solid #dbe3ef",
  borderRadius: "10px",
  background: "#ffffff",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
};

const inputIcon = {
  width: "45px",
  textAlign: "center",
  fontSize: "16px",
  color: "#64748b",
};

const inputStyle = {
  flex: 1,
  width: "100%",
  padding: "13px 12px 13px 0",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "#0f172a",
  boxSizing: "border-box",
};

const selectStyle = {
  flex: 1,
  width: "100%",
  padding: "13px 12px 13px 0",
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "#0f172a",
  cursor: "pointer",
};

const hintStyle = {
  margin: "6px 0 0",
  color: "#94a3b8",
  fontSize: "11px",
};

export default CreateUser;