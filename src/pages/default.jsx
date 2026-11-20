import "./default.css";

// 🟢 Mock Data for the Landing Page
const MOCK_LEADER = {
  name: "Sanjay Jaiswal",
  title: "Member of Parliament",
  constituency: "Paschim Champaran, Bihar",
  party: "BJP",
  image: "https://img.freepik.com/premium-photo/portrait-handsome-confident-business-man-leadership-concept-mixed-media_641298-4280.jpg?w=2000", // Random professional image
};

const MOCK_STATS = [
  { label: "Constituencies", value: "1", icon: "🗳️" },
  { label: "Development Projects", value: "150+", icon: "🏗️" },
  { label: "Public Meetings", value: "85", icon: "🤝" },
  { label: "Total Voters Impacted", value: "10,000+", icon: "👥" },
];

const MOCK_ACTIONS = [
  { label: "Know Your Leader", desc: "View detailed profile & bio", icon: "👤", link: "/leader/profile" },
  { label: "Samvad", desc: "Share feedback, appeals & grievances", icon: "💬", link: "/samvad" },
  { label: "Media Corner", desc: "Latest news, events & updates", icon: "📰", link: "/mediacorner" },
  { label: "Constituency Map", desc: "View constituency data & statistics", icon: "🗺️", link: "/leaderConstituen" },
];

const MOCK_UPDATES = [
  { title: "New Educational Grant Program Launched", date: "Oct 10, 2023", type: "Education" },
  { title: "Town Hall Meeting: Healthcare Initiatives", date: "Oct 08, 2023", type: "Community" },
  { title: "City Park Renovation Phase 1 Completed", date: "Oct 05, 2023", type: "Infrastructure" },
  { title: "Digital Transformation Workshop Conducted", date: "Sep 28, 2023", type: "Technology" },
];

export default function DefaultContent() {
  return (
    <div className="default-container">
      
      {/* ==========================================
          1. HERO BANNER SECTION
         ========================================== */}
      <section className="default-hero-section">
        <div className="default-hero-content">
          <div className="default-hero-text">
            <div className="default-hero-tag">🚀 Leader-App v2.0</div>
            <h1 className="default-hero-title">Welcome to the <span className="default-highlight">Leader’s Portal</span></h1>
            <p className="default-hero-desc">
              Leader-App connects citizens with their leaders by providing personal details, 
              constituency insights, and election data all in one place.
            </p>
            <div className="default-hero-buttons">
              <button className="default-btn-primary" onClick={() => window.location.href='/home'}>
                Explore Dashboard →
              </button>
              <button className="default-btn-secondary" onClick={() => window.location.href='/leader/profile'}>
                Know Your Leader
              </button>
            </div>
          </div>

          <div className="default-hero-image-wrapper">
            <div className="default-hero-image-container">
              <img src={MOCK_LEADER.image} alt="Leader" className="default-hero-image" />
              <div className="default-hero-image-badge">
                <span className="badge-dot"></span>
                {MOCK_LEADER.title}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. STATS SECTION
         ========================================== */}
      <section className="default-stats-section">
        <div className="default-stats-grid">
          {MOCK_STATS.map((stat, index) => (
            <div className="default-stat-card" key={index}>
              <div className="default-stat-icon">{stat.icon}</div>
              <div className="default-stat-content">
                <span className="default-stat-value">{stat.value}</span>
                <span className="default-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          3. FEATURES / QUICK ACTIONS SECTION
         ========================================== */}
      <section className="default-features-section">
        <div className="default-section-header">
          <h2>⚡ Quick Actions</h2>
          <p>Explore the core features of the Leader-App</p>
        </div>

        <div className="default-features-grid">
          {MOCK_ACTIONS.map((action, index) => (
            <div className="default-feature-card" key={index} onClick={() => window.location.href=action.link}>
              <div className="default-feature-icon">{action.icon}</div>
              <div className="default-feature-content">
                <h3 className="default-feature-title">{action.label}</h3>
                <p className="default-feature-desc">{action.desc}</p>
              </div>
              <div className="default-feature-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          4. RECENT UPDATES SECTION
         ========================================== */}
      <section className="default-updates-section">
        <div className="default-section-header">
          <h2>📰 Recent Updates</h2>
          <p>Stay up to date with the latest activities</p>
        </div>

        <div className="default-updates-grid">
          {MOCK_UPDATES.map((update, index) => (
            <div className="default-update-card" key={index}>
              <div className="default-update-type">{update.type}</div>
              <h3 className="default-update-title">{update.title}</h3>
              <div className="default-update-footer">
                <span className="default-update-date">📅 {update.date}</span>
                <button className="default-update-btn">Read More →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. FOOTER CTA
         ========================================== */}
      <section className="default-cta-section">
        <div className="default-cta-box">
          <h2>Ready to make a difference?</h2>
          <p>Connect with your leader, share your feedback, and stay informed about your constituency.</p>
          <button className="default-btn-primary default-btn-large" onClick={() => window.location.href='/home'}>
            Get Started Now
          </button>
        </div>
      </section>

    </div>
  );
}