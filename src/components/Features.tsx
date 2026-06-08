import { Eye, ShieldCheck, FileSpreadsheet, Zap, BadgeAlert, Layers } from 'lucide-react';
import './Features.css';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <Zap size={24} />,
    title: 'Instant Synthesis',
    description: 'Summarize thousands of lines in balance sheets and income reports down to board-ready insights in less than 3 seconds.'
  },
  {
    icon: <Eye size={24} />,
    title: 'Intelligent Ledger OCR',
    description: 'Highly calibrated neural OCR extracts raw rows from low-res PDFs, receipts, and images without manual transcription.'
  },
  {
    icon: <Layers size={24} />,
    title: 'Multi-Sheet Reconciliation',
    description: 'Correlate accounts receivable against banking statements to identify double-billing, discrepancies, and outstanding balances.'
  },
  {
    icon: <BadgeAlert size={24} />,
    title: 'Risk & Variance Detection',
    description: 'Automated auditing flagged against global accounting variance standards, rating audit vulnerabilities as low, medium, or high.'
  },
  {
    icon: <FileSpreadsheet size={24} />,
    title: 'Executive Exports',
    description: 'Instantly download formatted CSVs, editable spreadsheets, or executive-level PDF briefs directly for standard board meetings.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Enterprise Encryption',
    description: 'SOC2-compliant pipelines with zero data-retention options. Your corporate financial statements remain private and protected.'
  }
];

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <span className="features-pretitle">PRODUCT CAPABILITIES</span>
          <h2 className="features-title">Engineered for financial managers</h2>
          <p className="features-subtitle">
            Finora automates the manual grunt work of compiling financial data, 
            allowing you to focus on strategic capital allocation.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
