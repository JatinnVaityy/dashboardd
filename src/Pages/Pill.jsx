import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import pill from "../assets/pill.jpg";
import { toast } from "react-toastify"; // Import react-toastify

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

  const formatPhoneNumber = (number) => {
    return number.startsWith("+") ? number : "+91" + number;
  };

  useEffect(() => {
    const checkReminder = setInterval(async () => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      reminders.forEach(async (reminder, index) => {
        if (reminder.time === currentTime && !reminder.sent) {
          try {
            await axios.post("https://server-2i6q.onrender.com/api/sendReminder", reminder);
            toast.success(`Reminder sent for ${reminder.pillName} at ${reminder.time}`); // Display success toast

            const updatedReminders = reminders.filter((_, i) => i !== index); // Remove the sent reminder
            setReminders(updatedReminders); // Update the state

            // Optionally update the sent status if you don't want to delete
            // const updatedReminders = reminders.map((r, i) =>
            //   i === index ? { ...r, sent: true } : r
            // );
            // setReminders(updatedReminders);
          } catch (error) {
            console.error("Failed to send reminder:", error);
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkReminder);
  }, [reminders]);

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
    setReminders((prevReminders) => prevReminders.filter((_, i) => i !== index));
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="main-container">
        <motion.div 
          className="image-container"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={pill} alt="Pill Reminder" />
        </motion.div>

        <motion.div 
          className="form-container"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading">Smart Pill Reminder</h1>
          <form onSubmit={handleSubmit}>
            <motion.input 
              type="text" 
              placeholder="Pill Name" 
              value={pillName} 
              onChange={(e) => setPillName(e.target.value)} 
              required 
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required 
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input 
              type="text" 
              placeholder="Phone Number" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              required 
              whileFocus={{ scale: 1.05 }}
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Set Reminder
            </motion.button>
          </form>

          <h3 className="sub-heading">Upcoming Reminders</h3>
          <div className="reminder-list">
            <AnimatePresence>
              {reminders.map((reminder, index) => (
                <motion.div 
                  key={index} 
                  className="reminder-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>
                    <strong>{reminder.pillName}</strong> at {reminder.time} for {reminder.phoneNumber}
                  </span>
                  <motion.div 
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTrash className="delete-icon" onClick={() => removeReminder(index)} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
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
        }

        .form-container {
          flex: 1;
          padding: 20px;
          min-width: 300px;
        }

        .form-container input, .form-container button {
          width: 100%;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
          font-size: 16px;
        }

        .form-container button {
          background-color: #1890ff;
          color: white;
          border: none;
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
      `}</style>
    </motion.div>
  );
};

export default SmartPillReminder;
