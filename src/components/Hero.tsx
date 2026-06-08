import { useState, type FormEvent } from 'react';
import logo from '../assets/logo.png';
import { User, Mail, ArrowRight, Check, X, MessageSquare } from 'lucide-react';
import './Hero.css';
import CountryDropdown from './CountryDropdown';
import { countries, type Country } from './countries';

const QUEUE_OFFSET = 124;

export default function Hero() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find(c => c.code === 'US') || countries[0]
  );
  const [useCase, setUseCase] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbSerialNumber, setDbSerialNumber] = useState(0);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid work email');
      return;
    }
    if (!useCase.trim()) {
      setError('Please tell us what you are going to use the product for');
      return;
    }
    
    setError('');
    setIsLoading(true);

    // Generate custom unique customer ID (format: FIN-XXXX-XXXX)
    const generateUniqueId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const rand = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      return `FIN-${rand(4)}-${rand(4)}`;
    };

    const uniqueId = generateUniqueId();
    const countryStr = `${selectedCountry.flag} ${selectedCountry.name}`;

    // 1. Submit to Supabase
    try {
      const dbRes = await fetch('https://vhscxuefhkvpryaaweae.supabase.co/rest/v1/customers', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc2N4dWVmaGt2cHJ5YWF3ZWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTEzMzcsImV4cCI6MjA5NjQyNzMzN30.s47FpqFKoUBINtNwbuZ2e4qoJuSbyTRfRfIrzwzAfBU',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc2N4dWVmaGt2cHJ5YWF3ZWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTEzMzcsImV4cCI6MjA5NjQyNzMzN30.s47FpqFKoUBINtNwbuZ2e4qoJuSbyTRfRfIrzwzAfBU',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name,
          email,
          country: countryStr,
          use_case: useCase,
          unique_id: uniqueId
        })
      });

      if (!dbRes.ok) {
        const errData = await dbRes.json().catch(() => ({}));
        if (errData.code === '23505') {
          setError('This email ID is already registered. You are already in the queue!');
          setIsLoading(false);
          return;
        }
        throw new Error(errData.message || 'Database submission failed');
      }

      // Read returned database ID
      const resData = await dbRes.json().catch(() => []);
      const dbId = resData[0]?.id || 1;
      setDbSerialNumber(dbId);

    } catch (err: any) {
      console.error('Database submission failed:', err);
      setError(err.message || 'Failed to submit to database. Please try again.');
      setIsLoading(false);
      return;
    }

    // 2. Submit to webhook
    const payload = {
      name,
      email,
      uniqueId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      referrer: document.referrer,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      country: countryStr,
      useCase: useCase
    };

    try {
      await fetch('https://n8n.srv1084552.hstgr.cloud/webhook/1a4bad87-1b46-429c-8645-23d20508a4ff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Webhook submission failed:', err);
    }
    
    setIsLoading(false);
    setIsSubmitted(true);
  };



  return (
    <section className="hero" id="hero">
      <div className="grid-overlay"></div>
      <div className="beams-container beams-left">
        <div className="grid-beam grid-beam-v v-beam-left-1"></div>
        <div className="grid-beam grid-beam-v v-beam-left-2"></div>
        <div className="grid-beam grid-beam-v v-beam-left-3"></div>
        <div className="grid-beam grid-beam-h h-beam-left-1"></div>
        <div className="grid-beam grid-beam-h h-beam-left-2"></div>
        <div className="grid-beam grid-beam-h h-beam-left-3"></div>
      </div>
      <div className="beams-container beams-right">
        <div className="grid-beam grid-beam-v v-beam-right-1"></div>
        <div className="grid-beam grid-beam-v v-beam-right-2"></div>
        <div className="grid-beam grid-beam-v v-beam-right-3"></div>
        <div className="grid-beam grid-beam-h h-beam-right-1"></div>
        <div className="grid-beam grid-beam-h h-beam-right-2"></div>
        <div className="grid-beam grid-beam-h h-beam-right-3"></div>
      </div>
      <div className="hero-glow"></div>
      
      <div className="hero-container">
        {/* Concentric Logo Radar */}
        <div className="logo-radar-container">
          <div className="radar-ring ring-1"></div>
          <div className="radar-ring ring-2"></div>
          <div className="radar-ring ring-3"></div>
          <div className="radar-ring ring-4"></div>
          <div className="radar-logo-center">
            <img src={logo} alt="Finora Brand Icon" className="radar-logo-img" />
          </div>
        </div>

        {/* Text Area */}
        <span className="hero-tagline">FINORA AI REPORTING PLATFORM</span>
        
        {!isSubmitted ? (
          <>
            <h1 className="hero-title">
              Join the waitlist for the <br />
              <span className="highlight-text">Financial Reporter</span>
            </h1>
            <p className="hero-description">
              Upload complex financial documents and get comprehensive audit summaries, 
              custom charts, and boardroom-ready reports in seconds.
            </p>

            {/* Waitlist Form */}
            <div className="waitlist-card-wrapper" id="waitlist-form">
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <span className="input-icon"><User size={18} /></span>
                  <input 
                    type="text" 
                    placeholder="Full name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="waitlist-input"
                  />
                </div>
                
                <div className="input-group">
                  <span className="input-icon"><Mail size={18} /></span>
                  <input 
                    type="email" 
                    placeholder="Email ID" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="waitlist-input"
                  />
                </div>
                <span className="input-recommendation">
                  Work Email: It is recommended to enter your work email. If not, Gmail IDs will work fine.
                </span>

                <div className="input-group">
                  <CountryDropdown selected={selectedCountry} onChange={setSelectedCountry} />
                </div>

                <div className="input-group">
                  <span className="input-icon"><MessageSquare size={18} /></span>
                  <input 
                    type="text" 
                    placeholder="What will you use our product for?" 
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="waitlist-input"
                  />
                </div>

                {error && <div className="form-error-msg">{error}</div>}

                <button type="submit" className="btn-submit-form" disabled={isLoading}>
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    <>
                      <span>Join the waitlist</span>
                      <ArrowRight size={18} className="btn-arrow-icon" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="success-card animate-float">
            <button 
              className="btn-close-success" 
              onClick={() => {
                setIsSubmitted(false);
                setName('');
                setEmail('');
                setUseCase('');
              }}
              aria-label="Close success message"
            >
              <X size={18} />
            </button>
            <div className="success-icon-wrapper">
              <div className="success-tick-circle">
                <Check size={24} strokeWidth={3} className="success-icon" />
              </div>
            </div>
            <h2 className="success-title">You're on the list, {name}!</h2>
            <p className="success-desc">
              We've saved a spot for you at <span className="highlight-email">{email}</span>.
            </p>
            
            <div className="queue-box">
              <span className="queue-label">YOUR QUEUE POSITION</span>
              <span className="queue-number">#{QUEUE_OFFSET + dbSerialNumber}</span>
              <span className="queue-total">joined {QUEUE_OFFSET + dbSerialNumber - 1} other financial professionals</span>
            </div>
          </div>
        )}

        {/* Footer Stats/Notes */}
        <div className="hero-footer-notes">
          <p className="footer-note-text">Finora is coming to finance teams soon.</p>
          <p className="footer-sub-text">
            Designed to give you back your time. A product by{' '}
            <a 
              href="https://www.linkedin.com/company/launchwavein/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-sub-link"
            >
              Launchwave.co
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
