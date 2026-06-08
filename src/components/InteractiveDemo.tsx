import { useState, useEffect } from 'react';
import { FileText, Play, CheckCircle2, TrendingUp, Sparkles, AlertCircle, FileSpreadsheet, Download } from 'lucide-react';
import './InteractiveDemo.css';

interface Template {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'csv';
  size: string;
  metrics: {
    revenue: string;
    profit: string;
    margin: string;
    risk: 'Low' | 'Medium' | 'High';
  };
  insights: string[];
  chartData: number[]; // values out of 100 for SVG path plotting
}

const TEMPLATES: Template[] = [
  {
    id: 'q4-income',
    name: 'Q4_Income_Statement.pdf',
    type: 'pdf',
    size: '2.4 MB',
    metrics: { revenue: '$1,245,800', profit: '$386,400', margin: '31.0%', risk: 'Low' },
    insights: [
      'Gross revenue increased by 14.2% Quarter-over-Quarter, driven by enterprise software licensing.',
      'Operating expenses remained stable; payroll rose 2.0% while travel costs fell 12.0%.',
      'Accounts receivable aging is optimal, with 94.0% of invoices collected within 30 days.'
    ],
    chartData: [40, 62, 55, 88]
  },
  {
    id: 'saas-metrics',
    name: 'SaaS_Operating_Sheet.xlsx',
    type: 'excel',
    size: '1.8 MB',
    metrics: { revenue: '$4,850,200', profit: '$1,455,000', margin: '30.0%', risk: 'Medium' },
    insights: [
      'Annual Recurring Revenue (ARR) reached $4.85M with logo retention stable at 94.5%.',
      'CAC Payback period expanded to 14.8 months due to increased search engine ad spending.',
      'Warning: R&D expenses rose 32% QoQ, representing the largest overhead expansion variance.'
    ],
    chartData: [30, 48, 65, 82]
  },
  {
    id: 'retail-invoices',
    name: 'Retail_Invoices_May.csv',
    type: 'csv',
    size: '850 KB',
    metrics: { revenue: '$684,200', profit: '$88,900', margin: '13.0%', risk: 'High' },
    insights: [
      'Total invoiced volume was $684k across 14,280 transactions in May.',
      'Alert: Identified 3 overlapping supplier payments totaling $12,450 (high probability audit flag).',
      'Inventory holding costs are trending 5% higher than previous averages.'
    ],
    chartData: [75, 45, 60, 40]
  }
];

export default function InteractiveDemo() {
  const [selectedId, setSelectedId] = useState<string>('q4-income');
  const [step, setStep] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [animatedMetrics, setAnimatedMetrics] = useState({ revenue: 0, profit: 0 });

  const activeTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0];

  const handleStartAnalysis = () => {
    setStep('uploading');
    setProgress(0);
  };

  useEffect(() => {
    let timer: any;
    if (step === 'uploading') {
      setLoadingText('Uploading document & running OCR...');
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 40) {
            clearInterval(timer);
            setStep('processing');
            return 40;
          }
          return prev + 5;
        });
      }, 100);
    } else if (step === 'processing') {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep('done');
            return 100;
          }
          if (prev === 60) setLoadingText('Extracting balance metrics & reconciliation details...');
          if (prev === 80) setLoadingText('Synthesizing insights & generating report summary...');
          return prev + 4;
        });
      }, 120);
    }
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (step === 'done') {
      // Animate numbers counting up to their targets
      setAnimatedMetrics({ revenue: 0, profit: 0 });
      const revNum = parseInt(activeTemplate.metrics.revenue.replace(/[^0-9]/g, ''));
      const profNum = parseInt(activeTemplate.metrics.profit.replace(/[^0-9]/g, ''));
      
      let start = 0;
      const duration = 1000;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      
      const timer = setInterval(() => {
        start += 1;
        const progressRatio = start / totalSteps;
        setAnimatedMetrics({
          revenue: Math.floor(revNum * progressRatio),
          profit: Math.floor(profNum * progressRatio)
        });
        if (start >= totalSteps) {
          clearInterval(timer);
          setAnimatedMetrics({ revenue: revNum, profit: profNum });
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [step, selectedId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'excel': return <FileSpreadsheet className="doc-icon excel" />;
      case 'csv': return <FileText className="doc-icon csv" />;
      default: return <FileText className="doc-icon pdf" />;
    }
  };

  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString();
  };

  return (
    <section className="demo-section" id="demo">
      <div className="demo-glow-1"></div>
      <div className="demo-glow-2"></div>
      
      <div className="demo-container">
        <div className="demo-header">
          <span className="demo-pretitle">INTERACTIVE PLAYGROUND</span>
          <h2 className="demo-title">See Finora in action</h2>
          <p className="demo-subtitle">
            Choose a mock financial statement below and witness how Finora extracts key data 
            points and generates professional executive reports.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="demo-workspace">
          {/* Left Panel: File selector & Trigger */}
          <div className="workspace-left">
            <h3 className="panel-title">Select Document</h3>
            <div className="templates-list">
              {TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id} 
                  className={`template-item ${selectedId === tmpl.id ? 'active' : ''} ${step !== 'idle' && step !== 'done' ? 'disabled' : ''}`}
                  onClick={() => step !== 'uploading' && step !== 'processing' && setSelectedId(tmpl.id)}
                >
                  {getIcon(tmpl.type)}
                  <div className="template-info">
                    <span className="template-name">{tmpl.name}</span>
                    <span className="template-meta">{tmpl.size} • {tmpl.type.toUpperCase()} File</span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn-analyze" 
              onClick={handleStartAnalysis}
              disabled={step === 'uploading' || step === 'processing'}
            >
              <Play size={16} fill="currentColor" />
              <span>Process with Finora AI</span>
            </button>
            
            {/* Status updates / progress bar */}
            {(step === 'uploading' || step === 'processing') && (
              <div className="processing-status-card">
                <div className="status-header">
                  <span className="status-badge">Processing</span>
                  <span className="status-percent">{progress}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="status-detail-text">{loadingText}</p>
              </div>
            )}
            
            {step === 'done' && (
              <div className="reset-bar">
                <span className="reset-msg">Analysis completed successfully!</span>
                <button className="btn-reset" onClick={() => setStep('idle')}>Reset Sandbox</button>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Dashboard Result */}
          <div className="workspace-right">
            {step === 'idle' && (
              <div className="dashboard-placeholder">
                <div className="placeholder-circle">
                  <Sparkles size={32} className="sparkle-icon" />
                </div>
                <h4>Ready to Analyze</h4>
                <p>Select a document on the left and click "Process with Finora AI" to generate the report dashboard.</p>
              </div>
            )}

            {(step === 'uploading' || step === 'processing') && (
              <div className="dashboard-placeholder scanning">
                <div className="scanner-line"></div>
                <div className="placeholder-skeleton">
                  <div className="sk-card header"></div>
                  <div className="sk-grid">
                    <div className="sk-card"></div>
                    <div className="sk-card"></div>
                    <div className="sk-card"></div>
                  </div>
                  <div className="sk-card body"></div>
                </div>
              </div>
            )}

            {step === 'done' && (
              <div className="generated-dashboard">
                {/* Header info */}
                <div className="dash-header">
                  <div>
                    <h4 className="dash-doc-title">{activeTemplate.name}</h4>
                    <p className="dash-doc-meta">Report generated in 2.1s • Verified by Finora Ledger OCR</p>
                  </div>
                  <button className="btn-download" onClick={() => alert('Downloading report pdf...')}>
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>

                {/* KPI Cards Grid */}
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">Reconciled Revenue</span>
                    <span className="kpi-value">{formatCurrency(animatedMetrics.revenue)}</span>
                    <div className="kpi-trend positive">
                      <TrendingUp size={12} />
                      <span>Validated</span>
                    </div>
                  </div>

                  <div className="kpi-card">
                    <span className="kpi-label">Net Profit</span>
                    <span className="kpi-value">{formatCurrency(animatedMetrics.profit)}</span>
                    <span className="kpi-sub">{activeTemplate.metrics.margin} margin</span>
                  </div>

                  <div className="kpi-card">
                    <span className="kpi-label">Risk Assessment</span>
                    <span className={`kpi-value risk-${activeTemplate.metrics.risk.toLowerCase()}`}>
                      {activeTemplate.metrics.risk}
                    </span>
                    <div className="kpi-trend">
                      <AlertCircle size={12} />
                      <span>Ledger check</span>
                    </div>
                  </div>
                </div>

                {/* Chart and Insights */}
                <div className="dash-body-grid">
                  {/* Mini Trend Chart */}
                  <div className="trend-chart-card">
                    <div className="chart-title-bar">
                      <span>Monthly Net Trend</span>
                      <span className="chart-period">Last 4 Months</span>
                    </div>
                    <div className="svg-container">
                      <svg viewBox="0 0 400 120" className="chart-svg">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f06e30" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#f06e30" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.03)" />
                        <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" />
                        
                        {/* Area Fill */}
                        <path 
                          d={`M 20 120 L 20 ${120 - activeTemplate.chartData[0]} L 130 ${120 - activeTemplate.chartData[1]} L 250 ${120 - activeTemplate.chartData[2]} L 370 ${120 - activeTemplate.chartData[3]} L 370 120 Z`}
                          fill="url(#chartGlow)"
                        />
                        
                        {/* Line */}
                        <path 
                          d={`M 20 ${120 - activeTemplate.chartData[0]} L 130 ${120 - activeTemplate.chartData[1]} L 250 ${120 - activeTemplate.chartData[2]} L 370 ${120 - activeTemplate.chartData[3]}`}
                          fill="none" 
                          stroke="#f06e30" 
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        
                        {/* Dots */}
                        {activeTemplate.chartData.map((val, idx) => {
                          const x = idx === 0 ? 20 : idx === 1 ? 130 : idx === 2 ? 250 : 370;
                          return (
                            <circle 
                              key={idx} 
                              cx={x} 
                              cy={120 - val} 
                              r="5" 
                              fill="#0d0d0f" 
                              stroke="#ff8e53" 
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                      <div className="chart-labels">
                        <span>Month 1</span>
                        <span>Month 2</span>
                        <span>Month 3</span>
                        <span>Month 4</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Report Synthesis */}
                  <div className="insights-card">
                    <div className="insights-header">
                      <Sparkles size={14} className="sparkle-icon" />
                      <span>Finora AI Synthesized Insights</span>
                    </div>
                    <ul className="insights-list">
                      {activeTemplate.insights.map((insight, index) => (
                        <li key={index} className="insight-item">
                          <CheckCircle2 size={14} className="check-bullet" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
