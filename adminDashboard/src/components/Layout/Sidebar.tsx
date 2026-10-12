import {
  LayoutDashboard,
  Headphones,
  Sliders,
  GitBranch,
  Activity,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: { count: number; label: string };
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'agents',
    label: 'Connected Agents',
    icon: Headphones,
    badge: { count: 142, label: 'Live' },
  },
  { id: 'trunks', label: 'Voice Trunks & SIP', icon: Sliders },
  { id: 'routing', label: 'Routing Rules', icon: GitBranch },
  { id: 'telemetry', label: 'Telemetry & Logs', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
  agentsCount?: number;
}

export default function Sidebar({ activeNav, onNavChange, agentsCount = 142 }: SidebarProps) {
  const sectionLabel =
    activeNav === 'routing' ? 'TELEPHONY CONTROL' : 'MISSION CRITICAL ROUTING';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="voice-layer-brand">
          <div className="voice-layer-title">
            <span className="word-voice">VOICE</span>
            <span className="word-layer">LAYER</span>
          </div>
          <div className="voice-layer-sub">
            GATEWAY PORTAL
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="sidebar-section-heading">
        {sectionLabel}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          const badgeCount = item.id === 'agents' ? agentsCount : item.badge?.count;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavChange(item.id)}
            >
              <item.icon size={18} className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{item.label}</span>

              {/* Connected Agents Badge */}
              {item.badge && (
                <div className="sidebar-pill-badge">
                  <span className="badge-dot" />
                  <span>{badgeCount} {item.badge.label}</span>
                </div>
              )}

              {/* Blue Active Dot indicator (as seen in Telemetry & Logs screenshot) */}
              {isActive && item.id === 'telemetry' && (
                <div className="sidebar-active-dot" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer SLA Health Card */}
      <div className="sidebar-footer-card">
        {activeNav === 'telemetry' ? (
          <>
            <div className="sla-row">
              <span className="sla-label">SLA Health</span>
              <span className="sla-val-green">99.98%</span>
            </div>
            <div className="sla-row mt-1">
              <span className="sla-label">Cluster</span>
              <span className="sla-val-dark">Core SIP #01</span>
            </div>
            <div className="sla-progress-track">
              <div className="sla-progress-fill" style={{ width: '99.98%' }} />
            </div>
            <div className="sla-row">
              <span className="sla-label">Active Streams</span>
              <span className="sla-val-blue">2,418 Ch</span>
            </div>
          </>
        ) : (
          <>
            <div className="sla-row">
              <span className="sla-label bold-dark">Core SIP Cluster</span>
              <span className="sla-val-green">99.98% SLA</span>
            </div>
            <div className="sla-progress-track">
              <div className="sla-progress-fill" style={{ width: '99.98%' }} />
            </div>
            <div className="sla-row">
              <span className="sla-label">Active Streams</span>
              <span className="sla-val-dark bold-dark">2,418 Ch</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
