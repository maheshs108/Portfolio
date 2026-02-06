export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; {new Date().getFullYear()} Mahesh Suryawanshi. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#home">Back to Top <i className="fas fa-arrow-up" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
