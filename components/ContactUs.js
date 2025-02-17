import { useState } from 'react';
import styles from './contactUs.module.scss';

const ContactUs = ({ data }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form from refreshing the page

        try {
            const res = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setMessage('Your email has been sent successfully!');
                setStatus('success');
                setEmail(''); // Clear input field
            } else {
                setMessage('Something went wrong. Please try again.');
                setStatus('error');
            }
        } catch (error) {
            setMessage('There was an error sending your email.');
            setStatus('error');
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        placeholder="Email (Required Field)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">SEND</button>
                </form>
                {message && (
                    <p className={status === 'success' ? styles.success : styles.error}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ContactUs;
