import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import pill from "../assets/pill.jpg";

const SmartPillReminder = () => {
  const [pillName, setPillName] = useState("");
  const [time, setTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reminders, setReminders] = useState(() => {
    return JSON.parse(localStorage.getItem("reminders")) || [];
  });

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Function to format phone number correctly
  const formatPhoneNumber = (number) => {
    return number.startsWith("+") ? number : "+91" + number;
  };

  // Function to send reminders at the exact time
  useEffect(() => {
    const checkReminder = setInterval(async () => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

      reminders.forEach(async (reminder, index) => {
        if (reminder.time === currentTime && !reminder.sent) {
          try {
            await axios.post("http://localhost:5000/api/sendReminder", reminder);
            alert(`Reminder sent for ${reminder.pillName} at ${reminder.time}`);

            // Mark reminder as sent to avoid duplicate sending
            const updatedReminders = reminders.map((r, i) =>
              i === index ? { ...r, sent: true } : r
            );
            setReminders(updatedReminders);
          } catch (error) {
            console.error("Failed to send reminder:", error);
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkReminder);
  }, [reminders]);

  // Function to add a new reminder
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const newReminder = { pillName, time, phoneNumber: formattedNumber, sent: false };
    setReminders([...reminders, newReminder]);
    setPillName("");
    setTime("");
    setPhoneNumber("");
  };

 
  const removeReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  return (
    <div className="container">
      <div className="main-container">
        <div className="image-container">
          <img src={pill} alt="Pill Reminder" />
        </div>

        <div className="form-container">
          <h1 className="heading">Smart Pill Reminder</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Pill Name" value={pillName} onChange={(e) => setPillName(e.target.value)} required />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <button type="submit">Set Reminder</button>
          </form>

          <h3 className="sub-heading">Upcoming Reminders</h3>
          <div className="reminder-list">
            {reminders.map((reminder, index) => (
              <div key={index} className="reminder-item">
                <span>
                  <strong>{reminder.pillName}</strong> at {reminder.time} for {reminder.phoneNumber}
                </span>
                <FaTrash className="delete-icon" onClick={() => removeReminder(index)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .main-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 1000px;
          width: 100%;
          overflow: hidden;
        }

        @media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    text-align: center;
  }

  .image-container img {
    max-width: 60%; /* Reduce image size on small screens */
  }
}

@media (max-width: 480px) {
  .image-container img {
    max-width: 50%; /* Further reduce image size for very small screens */
  }
}
        .image-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .image-container img {
          width: 100%;
          max-width: 380px;
          border-radius: 10px;
            mix-blend-mode: multiply;
        }

        .form-container {
          flex: 1;
          padding: 20px;
          min-width: 300px;
        }

        .form-container input {
          width: 100%;
          padding: 10px;
          margin: 5px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        .form-container button {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          background-color: #1890ff;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .form-container button:hover {
          background-color: #0073e6;
        }

        .reminder-list {
          margin-top: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: #f9f9f9;
        }

        .reminder-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          margin: 5px 0;
          border-bottom: 1px solid #ddd;
        }

        .reminder-item:last-child {
          border-bottom: none;
        }

        .delete-icon {
          color: red;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .delete-icon:hover {
          color: darkred;
          transform: scale(1.2);
        }

        .heading {
          text-align: center;
          font-size: 25px;
          font-weight:bold;
          color: #1890ff;
          margin-bottom: 15px;
        }

        .sub-heading {
          margin-top: 15px;
          font-size: 18px;
          color: #1890ff;
        }

        /* Responsive Styling */
        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
            text-align: center;
          }

          .image-container img {
            max-width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartPillReminder;
