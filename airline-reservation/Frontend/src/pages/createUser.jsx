import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // CREATE USER
  // =====================================================

  const handleCreateUser = async (e) => {

    e.preventDefault();

    // ===============================
    // VALIDATION
    // ===============================

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

    if (!role) {
      alert("Please select role");
      return;
    }


    try {

      setLoading(true);

      console.log("=================================");
      console.log("CREATING USER");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("Role:", role);
      console.log("=================================");


      const response = await fetch(
        "http://localhost:8080/api/users",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: name.trim(),

            email: email.trim(),

            phone: phone.trim(),

            password: password,

            role: role

          })
        }
      );


      // =================================================
      // RESPONSE
      // =================================================

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }


      console.log(
        "CREATE USER RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
              data?.error ||
              "Unable to create user"
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      alert("User created successfully!");


      // CLEAR FORM

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("USER");


      // GO TO LOGIN

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
          "linear-gradient(135deg, #eef4ff, #f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif"
      }}
    >

      <div
        style={{
          width: "500px",
          maxWidth: "100%",
          background: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow:
            "0 5px 25px rgba(0,0,0,0.12)",
          boxSizing: "border-box"
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <h1
          style={{
            textAlign: "center",
            margin: "0 0 8px 0",
            fontSize: "42px"
          }}
        >
          Create User
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "35px",
            fontSize: "18px"
          }}
        >
          Create your airline reservation account
        </p>


        <form onSubmit={handleCreateUser}>


          {/* =================================================
              FULL NAME
          ================================================= */}

          <div style={fieldContainer}>

            <label style={labelStyle}>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              style={inputStyle}
            />

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div style={fieldContainer}>

            <label style={labelStyle}>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={inputStyle}
            />

          </div>


          {/* =================================================
              PHONE NUMBER
          ================================================= */}

          <div style={fieldContainer}>

            <label style={labelStyle}>
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter 10 digit phone number"
              value={phone}
              maxLength={10}
              onChange={(e) => {

                const value =
                  e.target.value.replace(/\D/g, "");

                setPhone(value);

              }}
              style={inputStyle}
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div style={fieldContainer}>

            <label style={labelStyle}>
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={inputStyle}
            />

            <p
              style={{
                margin: "8px 0 0 0",
                color: "#777",
                fontSize: "14px"
              }}
            >
              Password must be at least 6 characters.
            </p>

          </div>


          {/* =================================================
              ROLE
          ================================================= */}

          <div style={fieldContainer}>

            <label style={labelStyle}>
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              style={inputStyle}
            >

              <option value="USER">
                USER
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

            </select>

          </div>


          {/* =================================================
              CREATE USER BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "10px",
              background:
                loading
                  ? "#999"
                  : "#0066ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
              fontWeight: "bold",
              fontSize: "17px"
            }}
          >

            {loading
              ? "Creating User..."
              : "Create User"}

          </button>


          {/* =================================================
              BACK TO LOGIN
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "12px",
              background: "#e5e7eb",
              color: "#222",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold"
            }}
          >

            Already have an account? Login

          </button>


          {/* =================================================
              BACK HOME
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "10px",
              background: "transparent",
              color: "#0066ff",
              border: "1px solid #0066ff",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px"
            }}
          >

            Back to Home

          </button>

        </form>

      </div>

    </div>

  );
}


// =====================================================
// STYLES
// =====================================================

const fieldContainer = {
  marginBottom: "20px"
};


const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  fontSize: "17px",
  color: "#555"
};


const inputStyle = {
  width: "100%",
  padding: "13px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "16px",
  outline: "none",
  background: "#fff"
};


export default CreateUser;