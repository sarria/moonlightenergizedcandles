import { useState } from "react";
import styles from "./contact.module.scss";

const Contact = ({ data }) => {
  const [email_address, setEmail] = useState("");
  const [FNAME, setFullName] = useState("");
  const [MESSAGE, setMessage] = useState("");
  const [appState, setAppState] = useState("IDLE");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAppState("LOADING");

    try {
      const response = await fetch("http://cms.moonlightenergizedcandles.com/contactus.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email_address,
          name: FNAME,
          message: MESSAGE,
          sendTo: "jaunsarria@gmail.com",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppState("SUCCESS");
      } else {
        setAppState("ERROR");
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setAppState("ERROR");
      setErrorMessage("Failed to submit. Please try again.");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <div>Full Name *</div>
            <input
              type="text"
              value={FNAME}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <div>Email *</div>
            <input
              type="email"
              value={email_address}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <div>Message *</div>
            <textarea
              value={MESSAGE}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              required
            />
          </div>
          <div className={styles.messages}>
            {appState === "ERROR" && <div className={styles.error}>{errorMessage}</div>}
            {appState === "SUCCESS" && <div className={styles.success}>Thank you!</div>}
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="submit" disabled={appState === "LOADING"}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
