import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo" onClick={() => scrollToSection('hero')}>
          <div className="logo-glow-wrapper">
            <img src={logo} alt="Finora Logo" className="logo-img" />
          </div>
          <span className="logo-text">Finora</span>
        </div>

        {/* Desktop Nav - Empty because we removed other sections */}
        <nav className="desktop-nav"></nav>

        {/* Action Button */}
        <div className="header-actions">
          <a
            href="https://www.linkedin.com/in/parths1ngh/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-join-waitlist"
            style={{ textDecoration: 'none' }}
          >
            <span>Contact the Founder</span>
            <ArrowUpRight size={16} />
          </a>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-nav">
          <a
            href="https://www.linkedin.com/in/parths1ngh/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-btn-join"
            style={{ textDecoration: 'none', textAlign: 'center' }}
            onClick={() => setIsOpen(false)}
          >
            Contact the Founder
          </a>
        </div>
      )}
    </header>
  );
}
