import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signinbg from "../assets/sign.avif";

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Show success toast message immediately
      toast.success("Signed in successfully!", { autoClose: 2000, position: "top-center" });

      localStorage.setItem("authToken", userCredential.user.accessToken);

      // Delay navigation to allow toast to be seen
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Sign-in failed: " + error.message, { autoClose: 3000, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);

      // Show success toast message immediately
      toast.success("Signed in with Google!", { autoClose: 2000, position: "top-center" });

      localStorage.setItem("authToken", result.user.accessToken);

      // Delay navigation to allow toast to be seen
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Google Sign-in failed: " + error.message, { autoClose: 3000, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Enter your email and password to sign in</p>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <form onSubmit={handleSignIn} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" placeholder="Email" required style={styles.input} />

            <label style={styles.label}>Password</label>
            <input type="password" name="password" placeholder="Password" required style={styles.input} />

            <button type="submit" style={{ ...styles.button, backgroundColor: loading ? "#ccc" : "#1890ff" }} disabled={loading}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <div style={styles.orText}>OR</div>

          <button onClick={handleGoogleSignIn} style={{ ...styles.googleButton, backgroundColor: loading ? "#ccc" : "#dd4b39" }} disabled={loading}>
            <FaGoogle style={styles.googleIcon} /> {loading ? "Signing in..." : "SIGN IN WITH GOOGLE"}
          </button>

          <p style={styles.signupText}>
            Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
          </p>
        </div>

        {!isMobile && (
          <div style={styles.imageContainer}>
            <img src={signinbg} alt="Sign In" style={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    maxWidth: "900px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  formContainer: {
    maxWidth: "300px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  orText: {
    textAlign: "center",
    fontWeight: "bold",
    margin: "10px 0",
  },
  googleButton: {
    width: "100%",
    padding: "10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    marginRight: "10px",
  },
  signupText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },
  link: {
    color: "#1890ff",
    fontWeight: "bold",
    textDecoration: "none",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    borderRadius: "5px",
  },
};

export default SignIn;
