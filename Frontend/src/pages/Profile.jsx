import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {

    const [user, setUser] = useState(null);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {

        const loadProfile = async () => {

            const token = localStorage.getItem("token");

            // Token nahi hai
            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:8080/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                // =================================================
                // UNAUTHORIZED
                // =================================================

                if (response.status === 401) {

                    localStorage.clear();

                    alert(
                        "Your session has expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }


                // =================================================
                // OTHER ERROR
                // =================================================

                if (!response.ok) {

                    throw new Error(
                        "Failed to load profile"
                    );
                }


                // =================================================
                // PROFILE DATA
                // =================================================

                const data = await response.json();

                setUser(data);

            } catch (error) {

                console.error(
                    "Profile Error:",
                    error
                );

                alert(
                    "Unable to load profile."
                );
            }
        };


        loadProfile();

    }, [navigate]);


    // =====================================================
    // FORMAT LOGIN TIME
    // =====================================================

    const formatTime = (time) => {

        if (!time) {
            return "Not Available";
        }

        return new Date(time).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );
    };


    // =====================================================
    // OPEN PHOTO SELECTOR
    // =====================================================

    const handleChangePhotoClick = () => {

        if (fileInputRef.current) {

            fileInputRef.current.click();
        }
    };


    // =====================================================
    // CHANGE PROFILE PHOTO
    // =====================================================

    const handlePhotoChange = async (e) => {

        const file = e.target.files?.[0];

        if (!file) {
            return;
        }


        // =================================================
        // IMAGE VALIDATION
        // =================================================

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file."
            );

            e.target.value = "";

            return;
        }


        // =================================================
        // FILE SIZE VALIDATION
        // =================================================

        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Profile photo must be less than 5 MB."
            );

            e.target.value = "";

            return;
        }


        try {

            setUploading(true);


            const token =
                localStorage.getItem("token");


            // =================================================
            // TOKEN CHECK
            // =================================================

            if (!token) {

                navigate("/login");

                return;
            }


            // =================================================
            // FORM DATA
            // =================================================

            const formData = new FormData();

            formData.append(
                "photo",
                file
            );


            // =================================================
            // UPDATE PHOTO API
            // =================================================

            const response = await fetch(
                `http://localhost:8080/api/users/${user.id}/photo`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


            // =================================================
            // UNAUTHORIZED
            // =================================================

            if (response.status === 401) {

                localStorage.clear();

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }


            // =================================================
            // READ RESPONSE
            // =================================================

            const responseText =
                await response.text();

            let data;

            try {

                data = JSON.parse(responseText);

            } catch {

                data = responseText;
            }


            // =================================================
            // API ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    typeof data === "string"
                        ? data
                        : data?.message ||
                          data?.error ||
                          "Failed to update profile photo"
                );
            }


            // =================================================
            // UPDATE PROFILE ON SCREEN
            // =================================================

            setUser((previousUser) => ({

                ...previousUser,

                ...data

            }));


            alert(
                "Profile photo updated successfully!"
            );

        } catch (error) {

            console.error(
                "Photo Upload Error:",
                error
            );

            alert(
                error.message ||
                "Failed to update profile photo"
            );

        } finally {

            setUploading(false);

            // Same file dobara select karne ke liye
            e.target.value = "";
        }
    };


    // =====================================================
    // GET PROFILE PHOTO
    // =====================================================

    const getProfilePhoto = () => {

        if (
            !user ||
            !user.profilePhoto
        ) {

            return null;
        }


        /*
         * Backend abhi Base64 String return kar raha hai.
         *
         * Current implementation JPEG assume kar rahi hai.
         */

        return (
            `data:image/jpeg;base64,${user.profilePhoto}`
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (!user) {

        return (

            <div style={loadingStyle}>

                Loading profile...

            </div>
        );
    }


    const profilePhoto =
        getProfilePhoto();


    // =====================================================
    // PROFILE UI
    // =====================================================

    return (

        <div style={pageStyle}>

            <div style={profileContainer}>


                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

                <div style={headerStyle}>


                    {/* PROFILE PHOTO */}

                    <div style={photoSection}>


                        {profilePhoto ? (

                            <img
                                src={profilePhoto}
                                alt="Profile"
                                style={profileImageStyle}
                            />

                        ) : (

                            <div style={avatarStyle}>

                                {user.name
                                    ? user.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}

                            </div>
                        )}


                        {/* CHANGE PHOTO */}

                        <button
                            type="button"
                            onClick={
                                handleChangePhotoClick
                            }
                            disabled={uploading}
                            style={{
                                ...changePhotoButton,

                                opacity:
                                    uploading
                                        ? 0.6
                                        : 1,

                                cursor:
                                    uploading
                                        ? "not-allowed"
                                        : "pointer"
                            }}
                        >

                            {uploading
                                ? "Uploading..."
                                : profilePhoto
                                    ? "Change Photo"
                                    : "Add Photo"}

                        </button>


                        {/* HIDDEN FILE INPUT */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={
                                handlePhotoChange
                            }
                            style={{
                                display: "none"
                            }}
                        />

                    </div>


                    {/* HEADER TEXT */}

                    <div>

                        <h1 style={titleStyle}>
                            My Profile
                        </h1>

                        <p style={subtitleStyle}>
                            Manage your account information
                        </p>

                    </div>

                </div>


                {/* =========================================
                    ACCOUNT INFORMATION
                ========================================= */}

                <div style={sectionStyle}>

                    <h2 style={sectionTitle}>
                        Account Information
                    </h2>


                    <div style={infoGrid}>


                        {/* USER ID */}

                        <div style={infoBox}>

                            <span style={labelStyle}>
                                User ID
                            </span>

                            <strong style={valueStyle}>
                                #{user.id}
                            </strong>

                        </div>


                        {/* USERNAME */}

                        <div style={infoBox}>

                            <span style={labelStyle}>
                                Username
                            </span>

                            <strong style={valueStyle}>
                                {user.name ||
                                    "Not Available"}
                            </strong>

                        </div>


                        {/* EMAIL */}

                        <div style={infoBox}>

                            <span style={labelStyle}>
                                Email Address
                            </span>

                            <strong style={valueStyle}>
                                {user.email ||
                                    "Not Available"}
                            </strong>

                        </div>


                        {/* PHONE */}

                        <div style={infoBox}>

                            <span style={labelStyle}>
                                Phone Number
                            </span>

                            <strong style={valueStyle}>
                                {user.phone ||
                                    "Not Available"}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    ACCOUNT STATUS
                ========================================= */}

                <div style={sectionStyle}>

                    <h2 style={sectionTitle}>
                        Account Status
                    </h2>


                    <div style={statusContainer}>


                        {/* ROLE */}

                        <div>

                            <span style={labelStyle}>
                                Account Role
                            </span>

                            <div style={roleBadge}>
                                {user.role ||
                                    "USER"}
                            </div>

                        </div>


                        {/* ONLINE STATUS */}

                        <div>

                            <span style={labelStyle}>
                                Current Status
                            </span>

                            <div
                                style={{
                                    ...statusBadge,

                                    backgroundColor:
                                        user.online
                                            ? "#dcfce7"
                                            : "#fee2e2",

                                    color:
                                        user.online
                                            ? "#166534"
                                            : "#991b1b"
                                }}
                            >

                                <span>
                                    ●
                                </span>

                                {user.online
                                    ? " Online"
                                    : " Offline"}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    LOGIN INFORMATION
                ========================================= */}

                <div style={sectionStyle}>

                    <h2 style={sectionTitle}>
                        Login Information
                    </h2>


                    <div style={activityGrid}>

                        <div style={infoBox}>

                            <span style={labelStyle}>
                                Login Time
                            </span>

                            <strong style={valueStyle}>

                                {user.online

                                    ? formatTime(
                                        user.loginTime
                                    )

                                    : "Currently Offline"}

                            </strong>

                        </div>

                    </div>

                </div>


                {/* =========================================
                    BACK BUTTON
                ========================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/")
                    }
                    style={buttonStyle}
                >

                    ← Back to Home

                </button>

            </div>

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const pageStyle = {

    minHeight: "100vh",

    background: "#f5f7fb",

    padding: "40px 20px",

    boxSizing: "border-box"
};


const profileContainer = {

    maxWidth: "850px",

    margin: "0 auto",

    background: "#ffffff",

    borderRadius: "14px",

    padding: "30px",

    boxShadow:
        "0 8px 30px rgba(0,0,0,0.08)"
};


const headerStyle = {

    display: "flex",

    alignItems: "center",

    gap: "25px",

    paddingBottom: "25px",

    borderBottom:
        "1px solid #e5e7eb"
};


const photoSection = {

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    gap: "10px"
};


const profileImageStyle = {

    width: "90px",

    height: "90px",

    borderRadius: "50%",

    objectFit: "cover",

    border:
        "3px solid #2563eb"
};


const avatarStyle = {

    width: "90px",

    height: "90px",

    borderRadius: "50%",

    background: "#2563eb",

    color: "white",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "34px",

    fontWeight: "700"
};


const changePhotoButton = {

    border: "none",

    background: "#2563eb",

    color: "white",

    padding: "7px 12px",

    borderRadius: "6px",

    fontSize: "12px",

    fontWeight: "600"
};


const titleStyle = {

    margin: "0",

    fontSize: "28px",

    color: "#111827"
};


const subtitleStyle = {

    margin: "5px 0 0",

    color: "#6b7280",

    fontSize: "14px"
};


const sectionStyle = {

    marginTop: "28px"
};


const sectionTitle = {

    fontSize: "18px",

    color: "#111827",

    marginBottom: "16px"
};


const infoGrid = {

    display: "grid",

    gridTemplateColumns:
        "1fr 1fr",

    gap: "15px"
};


const activityGrid = {

    display: "grid",

    gridTemplateColumns:
        "1fr 1fr",

    gap: "15px"
};


const infoBox = {

    background: "#f9fafb",

    border:
        "1px solid #e5e7eb",

    borderRadius: "10px",

    padding: "16px"
};


const labelStyle = {

    display: "block",

    fontSize: "12px",

    color: "#6b7280",

    marginBottom: "7px",

    textTransform: "uppercase",

    letterSpacing: "0.5px"
};


const valueStyle = {

    color: "#111827",

    fontSize: "15px",

    wordBreak: "break-word"
};


const statusContainer = {

    display: "flex",

    gap: "40px",

    flexWrap: "wrap",

    background: "#f9fafb",

    border:
        "1px solid #e5e7eb",

    borderRadius: "10px",

    padding: "18px"
};


const roleBadge = {

    display: "inline-block",

    background: "#dbeafe",

    color: "#1d4ed8",

    padding: "6px 14px",

    borderRadius: "20px",

    fontSize: "13px",

    fontWeight: "600"
};


const statusBadge = {

    display: "inline-flex",

    alignItems: "center",

    gap: "5px",

    padding: "6px 14px",

    borderRadius: "20px",

    fontSize: "13px",

    fontWeight: "600"
};


const buttonStyle = {

    marginTop: "30px",

    width: "100%",

    padding: "12px",

    border: "none",

    borderRadius: "8px",

    background: "#111827",

    color: "white",

    fontSize: "15px",

    fontWeight: "600",

    cursor: "pointer"
};


const loadingStyle = {

    minHeight: "100vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "18px",

    color: "#6b7280",

    background: "#f5f7fb"
};


export default Profile;
