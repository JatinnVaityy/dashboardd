import React, { useState, useEffect } from "react";
import "./PatientForm.css";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    bloodType: "",
    height: "",
    weight: "",
    allergies: "",
    medications: "",
    chronicConditions: "",
    emergencyContactName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    preferredHospital: "",
  });

  const [selectedSection, setSelectedSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sections = ["Patient Information", "Health Information", "Emergency Contact"];

  useEffect(() => {
    const savedData = localStorage.getItem("patientReport");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setSubmitted(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "dob", "gender", "phone", "email", "emergencyContactName", "emergencyPhone"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save data");
      }

      localStorage.setItem("patientReport", JSON.stringify(formData));
      setSubmitted(true);
      alert("Patient data submitted successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Error submitting data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  return (
    <div className="container">
      <h2>Patient Profile</h2>

      {submitted ? (
        <div className="summary">
          <h3>Patient Summary</h3>
          {Object.entries(formData).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, " $1")}: </strong> {value || "N/A"}
            </p>
          ))}
          <button onClick={handleEdit}>Edit Information</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>{sections[selectedSection]}</h3>

          {selectedSection === 0 && (
            <div className="form-section">
              <div className="form-row">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-row">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
          )}

          {selectedSection === 1 && (
            <div className="form-section">
              <div className="form-row">
                <label>Blood Type</label>
                <input type="text" name="bloodType" value={formData.bloodType} onChange={handleChange} />
                <label>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} />
              </div>
              <div className="form-row">
                <label>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                <label>Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} />
              </div>
              <div className="form-row">
                <label>Medications</label>
                <textarea name="medications" value={formData.medications} onChange={handleChange} />
                <label>Chronic Conditions</label>
                <textarea name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} />
              </div>
            </div>
          )}

          {selectedSection === 2 && (
            <div className="form-section">
              <div className="form-row">
                <label>Emergency Contact Name</label>
                <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
                <label>Relationship</label>
                <input type="text" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} />
              </div>
              <div className="form-row">
                <label>Emergency Phone</label>
                <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} required />
                <label>Preferred Hospital</label>
                <input type="text" name="preferredHospital" value={formData.preferredHospital} onChange={handleChange} />
              </div>
            </div>
          )}

          <div className="button-group">
            {selectedSection > 0 && <button type="button" onClick={() => setSelectedSection(selectedSection - 1)}>Previous</button>}
            {selectedSection < sections.length - 1 ? (
              <button type="button" onClick={() => setSelectedSection(selectedSection + 1)}>Next</button>
            ) : (
              <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default PatientForm;
