import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Signup extends Component {
  state = {
    errorMessage: "",
    form: { email: "", password: "" },
  };

  handleSignup = async (event) => {
    event.preventDefault();
    const { email, password } = this.state.form;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signup successful!..", {
        position: "top-center",
        autoClose: 2000,
      });
      this.setState({ form: { email: "", password: "" } });

      setTimeout(() => {
        window.location.href = "/signin";
      }, 2500);
    } catch (error) {
      this.setState({ errorMessage: error.message });
      toast.error(error.message, { position: "top-center" });
      console.error("Signup error:", error.message);
    }
  };

  handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed up successfully with Google!", {
        position: "top-center",
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
      toast.error(error.message, { position: "top-center" });
      console.error("Google Signup error:", error.message);
    }
  };

  handleInputChange = (event) => {
    this.setState({
      form: { ...this.state.form, [event.target.name]: event.target.value },
    });
  };

  render() {
    return (
      <div style={styles.container}>
        <ToastContainer />
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Sign Up</h2>
          <p style={styles.subtitle}>Enter your details to create an account</p>
          {this.state.errorMessage && (
            <div style={styles.errorMessage}>{this.state.errorMessage}</div>
          )}
          <form onSubmit={this.handleSignup} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.form.email}
              onChange={this.handleInputChange}
              required
              style={styles.input}
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={this.state.form.password}
              onChange={this.handleInputChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              SIGN UP
            </button>
          </form>
          <p style={styles.signInText}>
            Already have an account?{" "}
            <Link to="/signin" style={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px",
    backgroundColor: "#f4f4f4",
  },
  formContainer: {
    width: "350px",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  signInText: {
    marginTop: "15px",
    textAlign: "center",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
