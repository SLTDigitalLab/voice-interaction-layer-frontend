import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, X, Sliders, PhoneCall, Activity, Cpu, CheckCircle } from 'lucide-react';

export interface ConnectedAgentItem {
  id: string;
  initials: string;
  badgeBg: string;
  name: string;
  agentId: string;
  phoneTrunk: string;
  status: 'Live' | 'Standby' | 'Offline';
  activeCalls: number;
  category?: string;
  sttEngine?: string;
  ttsEngine?: string;
}

export const initialAgents: ConnectedAgentItem[] = [
  {
    id: '1',
    initials: 'BB',
    badgeBg: '#0f52ba',
    name: 'SLT Broadband Support Bot',
    agentId: 'agt-bb-01',
    phoneTrunk: '+94 11 200 4500',
    status: 'Live',
    activeCalls: 48,
    category: 'Broadband & Fiber Care',
    sttEngine: 'Whisper v3 SLT-Sinhala/Eng',
    ttsEngine: 'ElevenLabs Neural LK',
  },
  {
    id: '2',
    initials: 'BP',
    badgeBg: '#059669',
    name: 'Billing & Top-up Assistant',
    agentId: 'agt-bill-04',
    phoneTrunk: '+94 11 200 4888',
    status: 'Live',
    activeCalls: 92,
    category: 'Billing & Payment Gateway',
    sttEngine: 'Azure Neural Telephony',
    ttsEngine: 'Google Cloud TTS Neural2',
  },
  {
    id: '3',
    initials: 'PT',
    badgeBg: '#0284c7',
    name: 'PeoTV Fault Triage Bot',
    agentId: 'agt-ptv-02',
    phoneTrunk: '+94 11 200 4700',
    status: 'Live',
    activeCalls: 14,
    category: 'IPTV / OTT Diagnostics',
    sttEngine: 'Whisper v3 LK Fine-tuned',
    ttsEngine: 'ElevenLabs Conversational',
  },
  {
    id: '4',
    initials: 'CF',
    badgeBg: '#1e40af',
    name: 'Corporate Fiber Hotline',
    agentId: 'agt-ent-09',
    phoneTrunk: '+94 11 238 9800',
    status: 'Live',
    activeCalls: 36,
    category: 'Enterprise Dedicated Lines',
    sttEngine: 'Deepgram Nova-2 Telco',
    ttsEngine: 'Amazon Polly Neural (English/Sinhala)',
  },
  {
    id: '5',
    initials: '5G',
    badgeBg: '#10b981',
    name: 'Mobitel 5G Voice Concierge',
    agentId: 'agt-mob-12',
    phoneTrunk: '+94 71 000 0141',
    status: 'Live',
    activeCalls: 63,
    category: 'Mobile 5G & eSIM Services',
    sttEngine: 'Whisper v3 Multilingual',
    ttsEngine: 'ElevenLabs Sinhala-Tamil-Eng',
  },
  // Additional pages mock agents
  {
    id: '6',
    initials: 'EE',
    badgeBg: '#7c3aed',
    name: 'Enterprise Cloud PBX Voice Gateway',
    agentId: 'agt-exp-03',
    phoneTrunk: '+94 11 244 1111',
    status: 'Live',
    activeCalls: 28,
    category: 'Cloud PBX & SIP Trunking',
    sttEngine: 'Azure Speech Enterprise',
    ttsEngine: 'Azure Neural Speech',
  },
  {
    id: '7',
    initials: 'EB',
    badgeBg: '#0284c7',
    name: 'eChannelling Automated Booking',
    agentId: 'agt-ech-08',
    phoneTrunk: '+94 11 225 9999',
    status: 'Live',
    activeCalls: 75,
    category: 'Healthcare Channeling IVR',
    sttEngine: 'Whisper v3 Multilingual LK',
    ttsEngine: 'Google WaveNet LK',
  },
  {
    id: '8',
    initials: 'TS',
    badgeBg: '#059669',
    name: 'SLT Teleshop Virtual Ordering',
    agentId: 'agt-ts-03',
    phoneTrunk: '+94 11 239 0000',
    status: 'Live',
    activeCalls: 19,
    category: 'Retail & Hardware Support',
    sttEngine: 'Deepgram Nova-2',
    ttsEngine: 'ElevenLabs Natural',
  },
  {
    id: '9',
    initials: 'VP',
    badgeBg: '#1e3a8a',
    name: 'VIP Corporate Dedicated Trunk',
    agentId: 'agt-vip-07',
    phoneTrunk: '+94 11 202 2222',
    status: 'Live',
    activeCalls: 11,
    category: 'Priority Enterprise Hotline',
    sttEngine: 'Whisper Turbo On-Premise',
    ttsEngine: 'ElevenLabs Executive',
  },
  {
    id: '10',
    initials: 'MR',
    badgeBg: '#0f52ba',
    name: 'Mobitel Global Roaming Helpline',
    agentId: 'agt-roam-15',
    phoneTrunk: '+94 71 000 0142',
    status: 'Live',
    activeCalls: 52,
    category: 'International Roaming Support',
    sttEngine: 'Deepgram Telco Low-Latency',
    ttsEngine: 'Google Neural2',
  },
  {
    id: '11',
    initials: 'FT',
    badgeBg: '#10b981',
    name: 'Fiber-To-The-Home Line Diagnostic',
    agentId: 'agt-ftth-05',
    phoneTrunk: '+94 11 200 4600',
    status: 'Live',
    activeCalls: 41,
    category: 'FTTH Core Diagnostics',
    sttEngine: 'Vosk Offline L1 Core',
    ttsEngine: 'Coqui FastSpeech2 LK',
  },
  {
    id: '12',
    initials: 'SM',
    badgeBg: '#7c3aed',
    name: 'SME Broadband Concierge',
    agentId: 'agt-sm-18',
    phoneTrunk: '+94 11 245 8899',
    status: 'Live',
    activeCalls: 33,
    category: 'Small & Medium Business',
    sttEngine: 'Whisper v3 English/Tamil',
    ttsEngine: 'Azure Neural Multilingual',
  },
  {
    id: '13',
    initials: 'WF',
    badgeBg: '#0284c7',
    name: 'Public WiFi Hotline & SMS Auth',
    agentId: 'agt-wifi-06',
    phoneTrunk: '+94 11 230 4050',
    status: 'Live',
    activeCalls: 22,
    category: 'Community WiFi Infrastructure',
    sttEngine: 'Azure Neural Telephony',
    ttsEngine: 'Google Cloud TTS',
  },
  {
    id: '14',
    initials: 'OP',
    badgeBg: '#059669',
    name: 'Online Bill Payment Assistance',
    agentId: 'agt-pay-11',
    phoneTrunk: '+94 11 200 4889',
    status: 'Live',
    activeCalls: 87,
    category: 'Payment Verification',
    sttEngine: 'Deepgram Nova-2',
    ttsEngine: 'ElevenLabs Conversational',
  },
  {
    id: '15',
    initials: 'ES',
    badgeBg: '#1e40af',
    name: 'Mobitel eSIM Digital Activation',
    agentId: 'agt-esim-20',
    phoneTrunk: '+94 71 000 0145',
    status: 'Live',
    activeCalls: 60,
    category: 'eSIM Onboarding Flow',
    sttEngine: 'Whisper v3 Multilingual',
    ttsEngine: 'ElevenLabs Natural',
  },
];

interface ConnectedAgentsProps {
  agents?: ConnectedAgentItem[];
  onDeployAgent: () => void;
  onConfigureAgent?: (agent: ConnectedAgentItem) => void;
  toastMessage?: string | null;
  onDismissToast?: () => void;
  newAgentId?: string | null;
}

export default function ConnectedAgents({
  agents = initialAgents,
  onDeployAgent,
  onConfigureAgent,
  toastMessage,
  onDismissToast,
  newAgentId,
}: ConnectedAgentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<ConnectedAgentItem | null>(null);
  const itemsPerPage = 5;

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage && onDismissToast) {
      const timer = setTimeout(() => {
        onDismissToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, onDismissToast]);

  const addedCount = Math.max(0, agents.length - initialAgents.length);
  const canonicalTotal = 142 + addedCount;

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const q = searchQuery.toLowerCase().trim();
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(q) ||
        agent.agentId.toLowerCase().includes(q) ||
        agent.phoneTrunk.toLowerCase().includes(q)
    );
  }, [agents, searchQuery]);

  // Pagination calculation
  const totalDisplayCount = searchQuery.trim() ? filteredAgents.length : canonicalTotal;
  const totalPages = searchQuery.trim()
    ? Math.max(1, Math.ceil(filteredAgents.length / itemsPerPage))
    : Math.ceil(canonicalTotal / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleConfigure = (agent: ConnectedAgentItem) => {
    setSelectedAgent(agent);
    if (onConfigureAgent) {
      onConfigureAgent(agent);
    }
  };

  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(startRecord + currentItems.length - 1, totalDisplayCount);

  return (
    <div className="connected-agents-page">
      {/* Header */}
      <div className="connected-header">
        <div className="connected-header-info">
          <h1 className="connected-title">Connected Agents</h1>
          <p className="connected-subtitle">
            Manage and monitor active voice agents and SIP routing endpoints.
          </p>
        </div>
        <button
          id="btn-deploy-agent"
          className="btn-deploy-agent"
          onClick={onDeployAgent}
        >
          <Plus size={16} />
          <span>Deploy Agent</span>
        </button>
      </div>

      {/* Success Alert / Toast Message */}
      {toastMessage && (
        <div className="connected-toast-alert" role="alert">
          <div className="toast-left">
            <div className="toast-icon-circle">
              <CheckCircle size={17} />
            </div>
            <div className="toast-text-group">
              <span className="toast-headline">Success</span>
              <span className="toast-body">{toastMessage}</span>
            </div>
          </div>
          {onDismissToast && (
            <button
              className="toast-close-btn"
              onClick={onDismissToast}
              aria-label="Dismiss alert"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Toolbar / Search & Active Counter */}
      <div className="connected-toolbar">
        <div className="connected-search-box">
          <Search size={16} className="connected-search-icon" />
          <input
            id="connected-search-input"
            type="text"
            placeholder="Search agents by name, ID, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="connected-active-badge">
          <span className="active-dot" />
          <span>{canonicalTotal} Agents Active</span>
        </div>
      </div>

      {/* Agents Table Container */}
      <div className="connected-table-card">
        <table className="connected-table">
          <thead>
            <tr>
              <th className="col-agent">Agent Name &amp; ID</th>
              <th className="col-phone">Phone / Trunk</th>
              <th className="col-status">Status</th>
              <th className="col-calls">Active Calls</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((agent) => (
                <tr
                  key={agent.id}
                  className={`connected-table-row ${agent.id === newAgentId ? 'newly-added-row' : ''}`}
                >
                  {/* Agent Name & ID */}
                  <td className="col-agent">
                    <div className="agent-identity">
                      <div
                        className="agent-avatar"
                        style={{ backgroundColor: agent.badgeBg }}
                      >
                        {agent.initials}
                      </div>
                      <div className="agent-meta">
                        <div className="agent-title-row">
                          <span className="agent-title">{agent.name}</span>
                          {agent.id === newAgentId && (
                            <span className="badge-new-agent">New</span>
                          )}
                        </div>
                        <span className="agent-id">{agent.agentId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Phone / Trunk */}
                  <td className="col-phone">
                    <span className="agent-phone">{agent.phoneTrunk}</span>
                  </td>

                  {/* Status */}
                  <td className="col-status">
                    <span className="status-pill-live">
                      <span className="status-live-dot" />
                      {agent.status}
                    </span>
                  </td>

                  {/* Active Calls */}
                  <td className="col-calls">
                    <span className="agent-calls-count">{agent.activeCalls} calls</span>
                  </td>

                  {/* Action */}
                  <td className="col-action">
                    <button
                      className="btn-configure-action"
                      onClick={() => handleConfigure(agent)}
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="connected-empty-state">
                  No agents found matching &ldquo;{searchQuery}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="connected-table-footer">
          <div className="connected-footer-info">
            Showing <span className="highlight-num">{startRecord}</span> -{' '}
            <span className="highlight-num">{endRecord}</span> of{' '}
            <span className="highlight-num">{totalDisplayCount}</span> Connected Agents
          </div>

          <div className="connected-pagination">
            <button
              className="pagination-btn pagination-nav"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>

            <button
              className={`pagination-btn pagination-page ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(1)}
            >
              1
            </button>

            {totalPages >= 2 && (
              <button
                className={`pagination-btn pagination-page ${currentPage === 2 ? 'active' : ''}`}
                onClick={() => handlePageChange(2)}
              >
                2
              </button>
            )}

            {totalPages >= 3 && (
              <button
                className={`pagination-btn pagination-page ${currentPage === 3 ? 'active' : ''}`}
                onClick={() => handlePageChange(3)}
              >
                3
              </button>
            )}

            {totalPages > 4 && <span className="pagination-ellipsis">...</span>}

            {totalPages > 3 && (
              <button
                className={`pagination-btn pagination-page ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            )}

            <button
              className="pagination-btn pagination-nav"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Quick Configure Modal / Details Drawer */}
      {selectedAgent && (
        <div className="configure-modal-backdrop" onClick={() => setSelectedAgent(null)}>
          <div className="configure-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="configure-modal-header">
              <div className="configure-header-agent">
                <div
                  className="agent-avatar large"
                  style={{ backgroundColor: selectedAgent.badgeBg }}
                >
                  {selectedAgent.initials}
                </div>
                <div>
                  <h3 className="configure-modal-title">{selectedAgent.name}</h3>
                  <p className="configure-modal-sub">
                    {selectedAgent.agentId} &bull; {selectedAgent.category || 'Telephony Layer'}
                  </p>
                </div>
              </div>
              <button
                className="configure-modal-close"
                onClick={() => setSelectedAgent(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="configure-modal-body">
              <div className="configure-detail-grid">
                <div className="configure-detail-item">
                  <div className="detail-label">
                    <PhoneCall size={14} /> SIP Direct Line / Ingress
                  </div>
                  <div className="detail-value font-mono">{selectedAgent.phoneTrunk}</div>
                </div>

                <div className="configure-detail-item">
                  <div className="detail-label">
                    <Activity size={14} /> Pipeline Status
                  </div>
                  <div className="detail-value">
                    <span className="status-pill-live">
                      <span className="status-live-dot" />
                      {selectedAgent.status} &bull; 99.98% SLA
                    </span>
                  </div>
                </div>

                <div className="configure-detail-item">
                  <div className="detail-label">
                    <Cpu size={14} /> Active Concurrency
                  </div>
                  <div className="detail-value font-mono">
                    {selectedAgent.activeCalls} simultaneous calls
                  </div>
                </div>

                <div className="configure-detail-item">
                  <div className="detail-label">
                    <Sliders size={14} /> Speech Pipeline STT / TTS
                  </div>
                  <div className="detail-value">
                    {selectedAgent.sttEngine || 'Whisper v3'} &rarr;{' '}
                    {selectedAgent.ttsEngine || 'ElevenLabs Neural'}
                  </div>
                </div>
              </div>

              <div className="configure-notice">
                <CheckCircle size={15} className="notice-icon" />
                <span>
                  Audio ingress routes via Colombo SBC Cluster 01 with low-latency media proxying enabled.
                </span>
              </div>
            </div>

            <div className="configure-modal-footer">
              <button
                className="btn-configure-dismiss"
                onClick={() => setSelectedAgent(null)}
              >
                Close
              </button>
              <button
                className="btn-configure-primary"
                onClick={() => {
                  setSelectedAgent(null);
                  onDeployAgent();
                }}
              >
                Edit Voice Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
