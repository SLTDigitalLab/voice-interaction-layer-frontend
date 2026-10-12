import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import Dashboard from './pages/Dashboard';
import RegisterAgent, { type NewAgentFormData } from './pages/RegisterAgent';
import ConnectedAgents, { type ConnectedAgentItem, initialAgents } from './pages/ConnectedAgents';
import VoiceTrunks from './pages/VoiceTrunks';
import VoiceRoutingRules from './pages/VoiceRoutingRules';
import TelemetryLogs from './pages/TelemetryLogs';
import SettingsPage from './pages/Settings';

export default function App() {
  const [activeNav, setActiveNav] = useState('telemetry');
  const [view, setView] = useState<
    'dashboard' | 'agents' | 'trunks' | 'routing' | 'telemetry' | 'register' | 'settings'
  >('telemetry');
  const [agents, setAgents] = useState<ConnectedAgentItem[]>(initialAgents);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newAgentId, setNewAgentId] = useState<string | null>(null);

  const handleRegisterAgent = () => setView('register');

  const handleBackToAgents = () => {
    setActiveNav('agents');
    setView('agents');
  };

  const handleSaveAgent = (formData: NewAgentFormData) => {
    // Generate initials for badge
    const cleaned = formData.name.replace(/^(SLT|Mobitel)\s+/i, '').trim();
    const words = cleaned.split(/\s+/).filter(Boolean);
    const initials =
      words.length >= 2
        ? (words[0][0] + words[1][0]).toUpperCase()
        : formData.name.slice(0, 2).toUpperCase();

    // Generate unique ID
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 7);
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const agentId = `agt-${slug || 'bot'}-${randomSuffix}`;

    const newAgent: ConnectedAgentItem = {
      id: String(Date.now()),
      initials: initials || 'VA',
      badgeBg: '#0f52ba',
      name: formData.name,
      agentId,
      phoneTrunk: formData.phoneTrunk ?? '',
      status: 'Live',
      activeCalls: 0,
      category: formData.category,
      sttEngine: 'Whisper v3 SLT-Sinhala/Eng',
      ttsEngine: 'ElevenLabs Neural LK',
    };

    // Prepend to top of table list
    setAgents((prev) => [newAgent, ...prev]);
    setNewAgentId(newAgent.id);
    setToastMessage(`Agent '${formData.name}' registered successfully.`);
    setActiveNav('agents');
    setView('agents');
  };

  const handleDismissToast = () => {
    setToastMessage(null);
  };

  const handleNavChange = (id: string) => {
    setActiveNav(id);
    if (id === 'settings') {
      setView('settings');
    } else if (id === 'agents') {
      setView('agents');
    } else if (id === 'trunks') {
      setView('trunks');
    } else if (id === 'routing') {
      setView('routing');
    } else if (id === 'telemetry') {
      setView('telemetry');
    } else if (id === 'dashboard') {
      setView('dashboard');
    }
  };

  const totalActiveAgents = 142 + Math.max(0, agents.length - initialAgents.length);

  return (
    <div className="app-layout">
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        agentsCount={totalActiveAgents}
      />
      <div className="main-wrapper">
        <TopBar activeNav={activeNav} />
        <main className="main-content">
          {view === 'settings' ? (
            <SettingsPage />
          ) : view === 'dashboard' ? (
            <Dashboard onRegisterAgent={handleRegisterAgent} />
          ) : view === 'register' ? (
            <RegisterAgent onBack={handleBackToAgents} onSave={handleSaveAgent} />
          ) : view === 'trunks' ? (
            <VoiceTrunks />
          ) : view === 'routing' ? (
            <VoiceRoutingRules />
          ) : view === 'telemetry' ? (
            <TelemetryLogs />
          ) : (
            <ConnectedAgents
              agents={agents}
              onDeployAgent={handleRegisterAgent}
              toastMessage={toastMessage}
              onDismissToast={handleDismissToast}
              newAgentId={newAgentId}
            />
          )}
        </main>
      </div>
    </div>
  );
}
