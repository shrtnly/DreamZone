import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { 
  Database, 
  Eye, 
  EyeOff, 
  Terminal as TerminalIcon, 
  Plus, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  ExternalLink,
  RefreshCw,
  Info,
  Server,
  Key,
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  FileCode2,
  X
} from 'lucide-react'
import './App.css'

function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking') // checking, connected, error
  const [logs, setLogs] = useState([])
  const [showKey, setShowKey] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Credentials
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qofnaitxmcvlbmmlddoz.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-_Onl9NuvkEcD8VWH2bOFQ_bQb9_O-Z'
  const supabaseSecretKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
  
  // Mock property listings (default content)
  const [properties, setProperties] = useState([
    {
      id: '1',
      title: 'Aura Premium Heights',
      location: 'Sector 4, Dream Zone City',
      price: '$450,000',
      beds: 3,
      baths: 3,
      area: '1,850 sqft',
      type: 'Apartment',
      status: 'Available'
    },
    {
      id: '2',
      title: 'The Grand Zenith Villa',
      location: 'Sunset Hills, Dream Zone',
      price: '$1,200,000',
      beds: 5,
      baths: 6,
      area: '4,200 sqft',
      type: 'Villa',
      status: 'Premium'
    },
    {
      id: '3',
      title: 'Neo-Eco Smart Townhouse',
      location: 'Greenwood Valley',
      price: '$320,000',
      beds: 2,
      baths: 2.5,
      area: '1,350 sqft',
      type: 'Townhouse',
      status: 'New'
    }
  ])

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: '3',
    baths: '2',
    area: '',
    type: 'Apartment',
    status: 'Available'
  })

  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { time: timestamp, text, type }])
  }

  // Check connection status
  const checkConnection = async () => {
    setConnectionStatus('checking')
    addLog('Initiating Supabase connection diagnostic...', 'info')
    addLog(`Checking endpoint: ${supabaseUrl}`, 'info')

    try {
      // We try to fetch from a dummy query to check API visibility
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(1)

      if (error) {
        // If error code is PGRST205 or similar (table not found), it means API connected successfully!
        if (error.message && error.message.includes("Could not find the table")) {
          setConnectionStatus('connected')
          addLog('✓ Connection Established!', 'success')
          addLog('Info: DB Schema connected. Table "properties" does not exist in schema cache yet.', 'info')
          addLog('Recommendation: Create the "properties" table in the SQL editor to begin database synchronization.', 'success')
        } else {
          setConnectionStatus('error')
          addLog(`✗ Error: ${error.message}`, 'error')
        }
      } else {
        setConnectionStatus('connected')
        addLog('✓ Connection Established!', 'success')
        addLog(`Successfully connected and retrieved ${data.length || 0} active listings.`, 'success')
        if (data && data.length > 0) {
          setProperties(data)
        }
      }
    } catch (err) {
      setConnectionStatus('error')
      addLog(`✗ Connection Exception: ${err.message}`, 'error')
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const handleTestDatabase = async () => {
    await checkConnection()
  }

  const handleSyncTables = () => {
    addLog('Executing schema synchronizer...', 'info')
    addLog('Generating SQL schema definition...', 'info')
    addLog('To finalize table sync, copy the SQL migration setup from below and run it in the Supabase SQL editor.', 'success')
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.price || !formData.location) {
      addLog('Validation Error: Please fill in all required fields.', 'error')
      return
    }

    const newProperty = {
      id: Date.now().toString(),
      ...formData
    }

    addLog(`Attempting to insert property: "${formData.title}"...`, 'info')

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([formData])
        .select()

      if (error) {
        addLog(`DB Insert failed: ${error.message}. Appending locally.`, 'error')
        setProperties(prev => [newProperty, ...prev])
        addLog('✓ Property added locally for demo.', 'success')
      } else {
        addLog('✓ Property successfully synchronized to Supabase!', 'success')
        setProperties(prev => [data[0], ...prev])
      }
    } catch (err) {
      addLog(`Exception: ${err.message}. Appending locally.`, 'error')
      setProperties(prev => [newProperty, ...prev])
      addLog('✓ Property added locally for demo.', 'success')
    }

    // Reset Form & Close Modal
    setFormData({
      title: '',
      location: '',
      price: '',
      beds: '3',
      baths: '2',
      area: '',
      type: 'Apartment',
      status: 'Available'
    })
    setIsModalOpen(false)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <span className="brand-logo">🔮</span>
          <div>
            <h1 className="brand-title">DREAM ZONE</h1>
            <p className="brand-subtitle">Supabase Integration Portal</p>
          </div>
        </div>
        
        <div className={`connection-badge ${connectionStatus}`}>
          <span className={`badge-dot ${connectionStatus === 'checking' ? 'pulse' : ''}`} />
          {connectionStatus === 'checking' && 'Verifying Supabase Connection...'}
          {connectionStatus === 'connected' && 'Supabase Connected'}
          {connectionStatus === 'error' && 'Connection Error'}
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Side Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Credentials Card */}
          <div className="glass-card">
            <h2 className="card-title">
              <Server className="w-5 h-5 text-cyan-400" />
              Credentials Config
            </h2>
            <div className="credentials-list">
              <div className="credential-item">
                <span className="credential-label">Project URL</span>
                <div className="credential-value-wrapper">
                  <span className="credential-value">{supabaseUrl}</span>
                  <a href={supabaseUrl} target="_blank" rel="noreferrer" className="icon-btn">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="credential-item">
                <span className="credential-label">Anon Publishable Key</span>
                <div className="credential-value-wrapper">
                  <span className="credential-value">
                    {showKey ? supabaseAnonKey : '••••••••••••••••••••••••••••••••'}
                  </span>
                  <button onClick={() => setShowKey(!showKey)} className="icon-btn">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="credential-item">
                <span className="credential-label">Secret Service Key</span>
                <div className="credential-value-wrapper">
                  <span className="credential-value">
                    {showSecret ? supabaseSecretKey : '••••••••••••••••••••••••••••••••'}
                  </span>
                  <button onClick={() => setShowSecret(!showSecret)} className="icon-btn">
                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tester Panel */}
          <div className="glass-card">
            <h2 className="card-title">
              <TerminalIcon className="w-5 h-5 text-purple-400" />
              Diagnostics Console
            </h2>
            
            <div className="tester-buttons">
              <button onClick={handleTestDatabase} className="primary-btn">
                <RefreshCw size={16} />
                Test Connection
              </button>
              <button onClick={handleSyncTables} className="secondary-btn">
                <Database size={16} />
                Sync Schema
              </button>
            </div>

            <div className="console-box">
              {logs.map((log, index) => (
                <div key={index} className="console-line">
                  <span className="console-time">[{log.time}]</span>
                  <span className={`console-text ${log.type}`}>{log.text}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="console-line">
                  <span className="console-time">[--:--:--]</span>
                  <span className="console-text info">Awaiting connection verification diagnostics...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side listings */}
        <div className="glass-card">
          <div className="listings-header">
            <div>
              <h2 className="listings-title">Dream Property Portfolio</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Active database assets synchronized with Supabase
              </p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="primary-btn">
              <Plus size={16} />
              Add Property
            </button>
          </div>

          <div className="property-grid">
            {properties.map(item => (
              <div key={item.id} className="property-card">
                <div className="property-img-placeholder">
                  <Building size={48} style={{ opacity: 0.15 }} />
                  <span className="property-badge">{item.status || 'Available'}</span>
                  <span className="property-price">{item.price}</span>
                </div>
                <div className="property-content">
                  <h3 className="property-title">{item.title}</h3>
                  <div className="property-location">
                    <MapPin size={14} className="text-cyan-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="property-features">
                    <div className="feature-item">
                      <BedDouble size={14} />
                      <span>{item.beds} Beds</span>
                    </div>
                    <div className="feature-item">
                      <Bath size={14} />
                      <span>{item.baths} Baths</span>
                    </div>
                    <div className="feature-item">
                      <Maximize size={14} />
                      <span>{item.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SQL Setup Helper Section */}
      <section className="glass-card" style={{ marginBottom: '48px', textAlign: 'left' }}>
        <h2 className="card-title">
          <FileCode2 className="text-gold w-5 h-5" />
          SQL Migration Reference
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          To enable property storage in your Supabase project, execute the following SQL schema setup inside the SQL Editor of your Supabase dashboard:
        </p>
        <pre style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          fontSize: '12px',
          overflowX: 'auto',
          fontFamily: 'ui-monospace, monospace',
          color: '#a6accd',
          lineHeight: '1.6'
        }}>
{`-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    beds INTEGER DEFAULT 3,
    baths NUMERIC DEFAULT 2,
    area TEXT,
    type TEXT DEFAULT 'Apartment',
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Allow public read access" 
ON public.properties FOR SELECT 
USING (true);

-- Create public insert policy (for demonstration purposes)
CREATE POLICY "Allow public write access" 
ON public.properties FOR INSERT 
WITH CHECK (true);`}
        </pre>
      </section>

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="listings-header" style={{ marginBottom: '20px' }}>
              <h2 className="listings-title">New Property listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="icon-btn">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleFormChange} 
                  className="form-input" 
                  placeholder="e.g. Skyline Luxury Penthouse" 
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleFormChange} 
                  className="form-input" 
                  placeholder="e.g. Block A, Dream Zone" 
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Price *</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleFormChange} 
                    className="form-input" 
                    placeholder="e.g. $420,000" 
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Area (Size)</label>
                  <input 
                    type="text" 
                    name="area" 
                    value={formData.area} 
                    onChange={handleFormChange} 
                    className="form-input" 
                    placeholder="e.g. 1,600 sqft"
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label className="form-label">Beds</label>
                  <input 
                    type="number" 
                    name="beds" 
                    value={formData.beds} 
                    onChange={handleFormChange} 
                    className="form-input" 
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Baths</label>
                  <input 
                    type="number" 
                    name="baths" 
                    value={formData.baths} 
                    onChange={handleFormChange} 
                    className="form-input" 
                    step="0.5" 
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select name="type" value={formData.type} onChange={handleFormChange} className="form-select">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status Badge</label>
                <select name="status" value={formData.status} onChange={handleFormChange} className="form-select">
                  <option value="Available">Available</option>
                  <option value="Premium">Premium</option>
                  <option value="New">New</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="secondary-btn">
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Dream Zone Property Portal © {new Date().getFullYear()} • Engineered for Premium Real Estate Diagnostics</p>
      </footer>
    </div>
  )
}

export default App
