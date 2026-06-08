import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo & Info */}
          <div className="footer-brand-column">
            <div className="footer-logo">
              <img src={logo} alt="Finora Logo" className="footer-logo-img" />
              <span className="footer-logo-text">Finora</span>
            </div>
            <p className="footer-brand-desc">
              Next-generation AI engine transforming raw financial ledger sheets 
              into high-level, audited executive briefings.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="footer-links-column">
            <h4 className="footer-column-title">Product</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Features</a></li>
              <li><a href="#demo">Interactive Sandbox</a></li>
              <li><a href="https://www.linkedin.com/in/parths1ngh/" target="_blank" rel="noopener noreferrer" className="footer-btn-link" style={{ textDecoration: 'none' }}>Contact the Founder</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="footer-links-column">
            <h4 className="footer-column-title">Compliance</h4>
            <ul className="footer-links-list">
              <li><a href="#security">SOC2 Security</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Finora AI. All rights reserved.
          </p>
          <p className="footer-credits">
            Form data managed securely via SOC2 ledger routing.
          </p>
        </div>
      </div>
    </footer>
  );
}
