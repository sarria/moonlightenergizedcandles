import { useState } from "react";
import styles from "./contact.module.scss";
import { isValidEmail } from './utils/shared';

const Contact = ({ data }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [appState, setAppState] = useState("IDLE");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAppState("LOADING");

    try {
        const response = await fetch("/api/contact", { // Use the Next.js API route
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, message }),
        });

        const data = await response.json();

        if (response.ok) {
            setAppState("SUCCESS");
        } else {
            setAppState("ERROR");
            setErrorMessage(data.error || "Something went wrong.");
        }
    } catch (error) {
        setAppState("ERROR");
        setErrorMessage("Failed to submit. Please try again.");
    }
};


  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        {appState === "SUCCESS" ? 
          <div className={styles.success}>
            <h2>Thank You for Reaching Out!</h2>
            <p>Your message has been received, and we truly appreciate you connecting with us. Our team will get back to you as soon as possible.</p>
            <p>In the meantime, keep the light glowing—follow our journey on Instagram for inspiration, new releases, and behind-the-scenes magic.</p>
            <h3>Moonlight Energized Candles - Crafted with love, charged with intention</h3>
          </div> 
          :
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <div>Full Name *</div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <div>Email *</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <div>Message *</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                required
              />
            </div>
            <div className={styles.messages}>
              {appState === "ERROR" && <div className={styles.error}>{errorMessage}</div>}
            </div>
            <div className={styles.buttons}>
              <button className={styles.button} type="submit" disabled={appState === "LOADING"}>
                {appState === "LOADING" ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
};

export default Contact;
