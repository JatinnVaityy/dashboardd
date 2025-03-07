import React from "react";

const SymptomChecker = () => {
  return (
    <div style={styles.container}>
      <iframe
        title="Symptom Checker"
        src="https://jatinnvaityy.github.io/last/"
        style={styles.iframe}
      />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    minHeight: "80vh", // Ensures it covers enough space on all devices
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px", // Adds some space around the iframe for smaller screens
    boxSizing: "border-box",
  },
  iframe: {
    width: "100%",
    height: "100%",
    minHeight: "600px", // Minimum height to ensure usability on mobile
    border: "none",
    borderRadius: "8px", // Optional rounded corners for a modern look
  },
};

export default SymptomChecker;
