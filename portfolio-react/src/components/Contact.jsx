import { useState } from 'react';
import { submitContactForm } from '../api/contact';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await submitContactForm(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">Have a project in mind? Let's work together!</p>
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-envelope" /></div>
              <div className="contact-details">
                <h4>Email</h4>
                <a href="mailto:surywanshim786@gmail.com">surywanshim786@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-phone" /></div>
              <div className="contact-details">
                <h4>Phone</h4>
                <a href="tel:+917218547798">+91 7218547798</a>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><i className="fas fa-map-marker-alt" /></div>
              <div className="contact-details">
                <h4>Location</h4>
                <p>Pusad, Dist Yavatmal, Maharashtra, India</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            {status === 'success' && (
              <div className="form-message success">
                <i className="fas fa-check-circle" /> Thank you! Your message has been sent successfully.
              </div>
            )}
            {status === 'error' && (
              <div className="form-message error">
                <i className="fas fa-exclamation-circle" /> {errorMsg}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <i className="fas fa-paper-plane" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
