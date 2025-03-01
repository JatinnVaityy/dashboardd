import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
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
        toast.error(`Please fill in the required field: ${field}`);
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
      const response = await fetch("https://server-2i6q.onrender.com/submit", {
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
      toast.success("Patient data submitted successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Error submitting data.");
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
                <label>First Name :</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" required />
                <label>Last Name :</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" required />
              </div>
              <div className="form-row">
                <label>Date of Birth :</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                <label>Gender :</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender :</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-row">
                <label>Phone :</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" required />
                <label>Email :</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
              </div>
            </div>
          )}

          {selectedSection === 1 && (
            <div className="form-section">
              <div className="form-row">
                <label>Blood Type :</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <label>Height (cm) :</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Enter height in cm" />
              </div>
              <div className="form-row">
                <label>Weight (kg) :</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight in kg" />
                <label>Allergies</label>
                <textarea name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any allergies"></textarea>
              </div>
              <div className="form-row">
                <label>Medications :</label>
                <textarea name="medications" value={formData.medications} onChange={handleChange} placeholder="Current medications (if any)"></textarea>
                <label>Chronic Conditions :</label>
                <textarea name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} placeholder="Chronic conditions (if any)"></textarea>
              </div>
            </div>
          )}

          {selectedSection === 2 && (
            <div className="form-section">
              <div className="form-row">
                <label>Emergency Contact Name :</label>
                <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Enter emergency contact name" required />
                <label>Relationship :</label>
                <input type="text" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} placeholder="e.g. Parent, Sibling, Friend" />
              </div>
              <div className="form-row">
                <label>Emergency Phone :</label>
                <input type="text" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="Enter emergency contact number" required />
                <label>Preferred Hospital :</label>
                <input type="text" name="preferredHospital" value={formData.preferredHospital} onChange={handleChange} placeholder="Enter preferred hospital (if any)" />
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
      
      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default PatientForm;
