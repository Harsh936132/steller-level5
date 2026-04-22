import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Wallet, 
  Heart, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { isConnected, getAddress, signTransaction } from '@stellar/freighter-api';

const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: "Clean Water for Nairobi",
    author: "EcoStream",
    description: "Installing solar-powered water filtration systems in local schools.",
    goal: 5000,
    raised: 3450,
    donors: 124,
    category: "Environment",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Women in Tech Scholarships",
    author: "FutureCode",
    description: "Funding coding bootcamps for 50 underprivileged women across Asia.",
    goal: 10000,
    raised: 7200,
    donors: 89,
    category: "Education",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Save the Coral Reefs",
    author: "OceanGuardians",
    description: "Protection and restoration of endangered coral reefs in the Maldives.",
    goal: 15000,
    raised: 12100,
    donors: 256,
    category: "Nature",
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&q=80&w=800"
  }
];

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [recentDonations, setRecentDonations] = useState([
    { id: 101, user: "GD...1234", amount: 50, campaign: "Clean Water" },
    { id: 102, user: "GB...5678", amount: 120, campaign: "Women in Tech" }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowFeedback(true), 15000); 
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      if (await isConnected()) {
        const address = await getAddress();
        setWalletAddress(address);
      } else {
        setError("Freighter wallet not found. Please install the extension.");
      }
    } catch (err) {
      console.error("Wallet connection failed", err);
      setError("Connection rejected. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = filter === 'All' 
    ? MOCK_CAMPAIGNS 
    : MOCK_CAMPAIGNS.filter(c => c.category === filter);

  const categories = ['All', ...new Set(MOCK_CAMPAIGNS.map(c => c.category))];

  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="nav-logo">
          <Zap className="text-primary" />
          <span>StellarImpact</span>
        </div>
        <div className="flex items-center gap-4">
          {error && <span className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full">{error}</span>}
          <button 
            className="btn-primary"
            onClick={walletAddress ? null : connectWallet}
            disabled={loading}
          >
            <Wallet size={18} />
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      <main className="container">
        <header className="hero">
          <h1>Empower Change with <span className="gradient-text">Stellar Impact</span></h1>
          <p>The world's first milestone-based crowdfunding platform built on Stellar. Transparent, secure, and community-driven.</p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary animate-glow" onClick={() => setShowCreateModal(true)}>
              <PlusCircle size={20} />
              Start a Campaign
            </button>
            <button className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600 }}>
              Explore Projects
            </button>
          </div>
        </header>

        <section className="mt-20 flex flex-col md:flex-row gap-10">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="text-secondary" />
                Active Campaigns
              </h2>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`badge ${filter === cat ? 'badge-active' : 'glass-card'}`}
                  style={{ cursor: 'pointer', border: filter === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid">
            {filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="glass-card campaign-card">
                <img 
                  src={campaign.image} 
                  alt={campaign.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '1rem' }}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">{campaign.category}</span>
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <ShieldCheck size={14} className="text-green-500" />
                    Verified
                  </div>
                </div>
                <h3 className="text-xl font-bold">{campaign.title}</h3>
                <p className="text-text-muted text-sm line-clamp-2">{campaign.description}</p>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                  ></div>
                </div>
                
                <div className="stats">
                  <div>
                    <span className="text-white font-bold">{campaign.raised} XLM</span>
                    <span className="block text-xs">raised of {campaign.goal}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">{campaign.donors}</span>
                    <span className="block text-xs">donors</span>
                  </div>
                </div>

                <button className="btn-primary w-full mt-4" style={{ justifyContent: 'center' }}>
                  <Heart size={18} />
                  Donate XLM
                </button>
              </div>
            ))}
          </div>

          <aside className="md:w-80">
            <div className="glass-card p-6 sticky" style={{ top: '100px' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap size={18} className="text-accent" />
                Recent Activity
              </h3>
              <div className="flex flex-col gap-4">
                {recentDonations.map(donation => (
                  <div key={donation.id} className="border-left border-primary pl-4 py-1" style={{ borderLeft: '2px solid var(--primary)' }}>
                    <p className="text-sm font-bold text-white">{donation.amount} XLM Donated</p>
                    <p className="text-xs text-text-muted">by {donation.user} to {donation.campaign}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                <p className="text-xs text-accent font-bold mb-1 italic">Pro Tip</p>
                <p className="text-xs text-text-muted">Funds are held in escrow and released only as milestones are verified.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card p-8 w-full max-w-md animate-glow">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <PlusCircle className="text-primary" />
              Start New Campaign
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-muted block mb-1 uppercase font-bold">Project Title</label>
                <input type="text" className="input-field" placeholder="e.g. Save the Dolphins" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1 uppercase font-bold">Goal (XLM)</label>
                <input type="number" className="input-field" placeholder="Target amount" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1 uppercase font-bold">Category</label>
                <select className="input-field">
                  <option>Environment</option>
                  <option>Education</option>
                  <option>Nature</option>
                  <option>Health</option>
                </select>
              </div>
              <button 
                className="btn-primary w-full mt-4 py-3 justify-center"
                onClick={() => setShowCreateModal(false)}
              >
                Create Campaign
              </button>
              <button 
                className="text-text-muted hover:text-white text-sm"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className="glass-card feedback-banner animate-glow">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              Help us improve!
            </h4>
            <button onClick={() => setShowFeedback(false)} className="text-text-muted hover:text-white">×</button>
          </div>
          <p className="text-xs text-text-muted mb-4">You've been exploring Stellar Impact. We'd love to hear your thoughts!</p>
          <a 
            href="#" 
            target="_blank" 
            className="btn-primary" 
            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem', width: '100%', justifyContent: 'center' }}
          >
            Give Feedback
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      <footer className="container mt-20 text-center text-text-muted text-sm pb-10 border-top border-glass">
        <p>© 2026 Stellar Impact. Built for Stellar Level 5 Quest.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-white">Architecture</a>
          <a href="#" className="hover:text-white">Smart Contract</a>
          <a href="#" className="hover:text-white">User Guide</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
