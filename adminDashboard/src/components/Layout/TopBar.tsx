import { Search, Bell, User } from 'lucide-react';

interface TopBarProps {
  activeNav?: string;
}

export default function TopBar({ activeNav = 'telemetry' }: TopBarProps) {
  const placeholder =
    activeNav === 'routing'
      ? 'Search rules, agents, DID numbers, SIP trunks...'
      : activeNav === 'telemetry'
      ? 'Search SIP sessions, trunks, call IDs, agents...'
      : 'Search SIP sessions, trunks, call IDs, agents...';

  return (
    <header className="topbar">
      {/* Search Input Bar */}
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input
          id="global-topbar-search"
          type="text"
          placeholder={placeholder}
        />
        {activeNav === 'telemetry' && (
          <div className="topbar-inline-gateway-badge">
            <span className="dot" />
            <span className="node-id">PROD-LK-COLOMBO-01</span>
            <span className="sep">-</span>
            <span className="gw-status">Voice Gateway Online</span>
          </div>
        )}
      </div>

      {/* External Badges when not telemetry */}
      {activeNav !== 'telemetry' && (
        <div className="topbar-badges-group">
          <div className="topbar-env-badge">
            PROD-LK-COLOMBO-01
          </div>
          <div className="topbar-gateway online">
            <span className="dot" />
            <span>Voice Gateway Online</span>
          </div>
        </div>
      )}

      {/* Right Actions */}
      <div className="topbar-actions">
        <button className="topbar-action-btn" title="System Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <div className="topbar-user">
          <div className="topbar-user-avatar">
            <User size={16} />
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">Eng. Perera (Admin)</span>
            <span className="topbar-user-role">SecOps / Telecom L3</span>
          </div>
        </div>
      </div>
    </header>
  );
}
