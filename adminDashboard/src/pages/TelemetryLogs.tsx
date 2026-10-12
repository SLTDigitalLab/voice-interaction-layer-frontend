import { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  X,
  CheckCircle,
  Phone,
  Activity,
  Radio,
  Copy,
  Zap,
  Webhook,
} from 'lucide-react';

export interface TelemetryLogItem {
  id: string;
  sessionId: string;
  channel: 'SIP' | 'API';
  timestamp: string;
  callerDid: string;
  voiceAgent: string;
  duration: string;
  latencyMs: number;
  status: 'Connected' | 'Completed' | 'Transferred' | 'Failed';
  codec?: string;
  gatewayNode?: string;
  packetLoss?: string;
  jitter?: string;
  mosScore?: number;
  sipCode?: string;
  transcriptPreview?: { speaker: string; text: string }[];
}

export const formatSessionId = (sessionId: string, channel: 'SIP' | 'API'): string => {
  const raw = sessionId.replace(/^(sip-|api-)/, '');
  return channel === 'SIP' ? `sip-${raw}` : `api-${raw}`;
};

export const initialTelemetryLogs: TelemetryLogItem[] = [
  {
    id: 'log-1',
    sessionId: 'sip-col-948271',
    channel: 'SIP',
    timestamp: 'Today, 14:32:00',
    callerDid: '+94 77 123 4567',
    voiceAgent: 'Broadband Support',
    duration: '02m 14s',
    latencyMs: 695,
    status: 'Connected',
    codec: 'Opus 48kHz HD',
    gatewayNode: 'COLOMBO-EDGE-01',
    packetLoss: '0.01%',
    jitter: '1.2 ms',
    mosScore: 4.45,
    sipCode: '200 OK (Active Dialog)',
    transcriptPreview: [
      { speaker: 'Caller', text: 'Hello, my fiber router red LOS light is blinking since morning.' },
      { speaker: 'Agent', text: 'I understand. Checking the optical link on your GPON circuit now...' },
      { speaker: 'Agent', text: 'Telemetry indicates an optical power dip at -28 dBm. Dispatching outside plant team.' }
    ],
  },
  {
    id: 'log-2',
    sessionId: 'api-col-948265',
    channel: 'API',
    timestamp: 'Today, 14:31:42',
    callerDid: '+94 71 889 0122',
    voiceAgent: '5G Concierge',
    duration: '01m 45s',
    latencyMs: 720,
    status: 'Completed',
    codec: 'AMR-WB 16kHz',
    gatewayNode: 'MOBITEL-API-GW-01',
    packetLoss: '0.00%',
    jitter: '0.9 ms',
    mosScore: 4.48,
    sipCode: '200 OK (Webhook Ack)',
    transcriptPreview: [
      { speaker: 'Caller', text: 'Can I activate the Unlimited 5G Booster on my postpaid eSIM?' },
      { speaker: 'Agent', text: 'Certainly! The 5G One-Shot package has been provisioned to your number.' }
    ],
  },
  {
    id: 'log-3',
    sessionId: 'sip-col-948259',
    channel: 'SIP',
    timestamp: 'Today, 14:30:15',
    callerDid: '+94 11 287 3411',
    voiceAgent: 'Fault Triage',
    duration: '04m 28s',
    latencyMs: 780,
    status: 'Completed',
    codec: 'G.711a A-law',
    gatewayNode: 'COLOMBO-EDGE-01',
    packetLoss: '0.02%',
    jitter: '1.5 ms',
    mosScore: 4.38,
    sipCode: '200 OK (Terminated BYE)',
    transcriptPreview: [
      { speaker: 'Caller', text: 'PeoTV channel guide is giving error code 404.' },
      { speaker: 'Agent', text: 'Initiating automated STB cache refresh and multicast route re-verification.' }
    ],
  },
  {
    id: 'log-4',
    sessionId: 'api-col-948248',
    channel: 'API',
    timestamp: 'Today, 14:28:50',
    callerDid: '+94 76 543 2109',
    voiceAgent: 'Billing Assistant',
    duration: '00m 58s',
    latencyMs: 680,
    status: 'Completed',
    codec: 'Opus 48kHz HD',
    gatewayNode: 'BILLING-WEBHOOK-GW',
    packetLoss: '0.00%',
    jitter: '0.8 ms',
    mosScore: 4.50,
    sipCode: '200 OK (Webhook Ack)',
    transcriptPreview: [
      { speaker: 'Caller', text: 'What is my current outstanding balance for account 0112445500?' },
      { speaker: 'Agent', text: 'Your outstanding balance is LKR 2,450.00, due on October 15th.' }
    ],
  },
  {
    id: 'log-5',
    sessionId: 'sip-col-948232',
    channel: 'SIP',
    timestamp: 'Today, 14:26:18',
    callerDid: '+94 11 238 9000',
    voiceAgent: 'Corporate Fiber',
    duration: '06m 12s',
    latencyMs: 810,
    status: 'Transferred',
    codec: 'G.711a A-law',
    gatewayNode: 'ENT-SIP-CORE-01',
    packetLoss: '0.04%',
    jitter: '2.1 ms',
    mosScore: 4.25,
    sipCode: '302 Moved Temporarily (Attended Transfer)',
    transcriptPreview: [
      { speaker: 'Caller', text: 'Need BGP route failover review for 10Gbps leased line in Colombo Fort.' },
      { speaker: 'Agent', text: 'Understood. Warm transferring session to Senior NOC Core Engineer now.' }
    ],
  },
  {
    id: 'log-6',
    sessionId: 'api-col-948210',
    channel: 'API',
    timestamp: 'Today, 14:24:02',
    callerDid: '+94 70 334 1122',
    voiceAgent: 'Mobitel 5G Voice Concierge',
    duration: '03m 10s',
    latencyMs: 670,
    status: 'Completed',
    codec: 'AMR-WB 16kHz',
    gatewayNode: 'MOBITEL-API-GW-02',
    packetLoss: '0.01%',
    jitter: '1.0 ms',
    mosScore: 4.46,
    sipCode: '200 OK (Webhook Ack)',
  },
  {
    id: 'log-7',
    sessionId: 'sip-col-948195',
    channel: 'SIP',
    timestamp: 'Today, 14:21:40',
    callerDid: '+94 11 244 5566',
    voiceAgent: 'Enterprise Cloud PBX',
    duration: '05m 45s',
    latencyMs: 715,
    status: 'Transferred',
    codec: 'Opus 48kHz HD',
    gatewayNode: 'COLOMBO-EDGE-02',
    packetLoss: '0.02%',
    jitter: '1.3 ms',
    mosScore: 4.39,
    sipCode: '302 Moved Temporarily',
  },
  {
    id: 'log-8',
    sessionId: 'sip-col-948180',
    channel: 'SIP',
    timestamp: 'Today, 14:19:12',
    callerDid: '+94 77 987 6543',
    voiceAgent: 'Broadband Support',
    duration: '01m 12s',
    latencyMs: 690,
    status: 'Completed',
    codec: 'Opus 48kHz HD',
    gatewayNode: 'COLOMBO-EDGE-01',
    packetLoss: '0.00%',
    jitter: '0.9 ms',
    mosScore: 4.49,
    sipCode: '200 OK',
  },
  {
    id: 'log-9',
    sessionId: 'api-col-948162',
    channel: 'API',
    timestamp: 'Today, 14:15:30',
    callerDid: '+94 71 222 3344',
    voiceAgent: 'Fault Triage',
    duration: '00m 42s',
    latencyMs: 825,
    status: 'Failed',
    codec: 'G.711a',
    gatewayNode: 'API-WEBHOOK-FAILOVER',
    packetLoss: '1.20%',
    jitter: '8.4 ms',
    mosScore: 3.10,
    sipCode: '504 Gateway Timeout (Webhook)',
  },
  {
    id: 'log-10',
    sessionId: 'api-col-948150',
    channel: 'API',
    timestamp: 'Today, 14:12:05',
    callerDid: '+94 11 200 4888',
    voiceAgent: 'Billing Assistant',
    duration: '02m 35s',
    latencyMs: 698,
    status: 'Completed',
    codec: 'G.711a',
    gatewayNode: 'BILLING-WEBHOOK-GW',
    packetLoss: '0.01%',
    jitter: '1.1 ms',
    mosScore: 4.43,
    sipCode: '200 OK',
  },
  {
    id: 'log-11',
    sessionId: 'sip-col-948135',
    channel: 'SIP',
    timestamp: 'Today, 14:08:44',
    callerDid: '+94 77 455 6789',
    voiceAgent: 'Corporate Fiber',
    duration: '03m 22s',
    latencyMs: 705,
    status: 'Connected',
    codec: 'Opus 48kHz HD',
    gatewayNode: 'COLOMBO-EDGE-02',
    packetLoss: '0.00%',
    jitter: '1.0 ms',
    mosScore: 4.47,
    sipCode: '200 OK (Active Dialog)',
  },
  {
    id: 'log-12',
    sessionId: 'api-col-948118',
    channel: 'API',
    timestamp: 'Today, 14:05:10',
    callerDid: '+94 76 890 1234',
    voiceAgent: '5G Concierge',
    duration: '01m 15s',
    latencyMs: 665,
    status: 'Completed',
    codec: 'AMR-WB 16kHz',
    gatewayNode: 'MOBITEL-API-GW-01',
    packetLoss: '0.00%',
    jitter: '0.7 ms',
    mosScore: 4.50,
    sipCode: '200 OK (Webhook Ack)',
  },
];

export default function TelemetryLogs() {
  const [logs] = useState<TelemetryLogItem[]>(initialTelemetryLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'All Channels' | 'SIP Logs' | 'API Logs'>('All Channels');
  const [statusFilter, setStatusFilter] = useState<'All Statuses' | 'Connected' | 'Completed' | 'Transferred' | 'Failed'>('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<TelemetryLogItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pageSize = 5;

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const formattedSessionId = formatSessionId(log.sessionId, log.channel).toLowerCase();
      const matchesSearch =
        q === '' ||
        formattedSessionId.includes(q) ||
        log.callerDid.toLowerCase().includes(q) ||
        log.voiceAgent.toLowerCase().includes(q) ||
        log.channel.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All Statuses' || log.status === statusFilter;

      const matchesChannel =
        channelFilter === 'All Channels' ||
        (channelFilter === 'SIP Logs' && log.channel === 'SIP') ||
        (channelFilter === 'API Logs' && log.channel === 'API');

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [logs, searchQuery, statusFilter, channelFilter]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));


  const handleCopySessionId = (sid: string) => {
    navigator.clipboard.writeText(sid);
    setCopiedId(sid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="telemetry-page">
      {/* Page Header */}
      <div className="telemetry-header">
        <div className="telemetry-header-text">
          <h1 className="telemetry-title">Telemetry &amp; Call Logs</h1>
          <p className="telemetry-subtitle">
            Real-time call session logs, SIP stream metrics, and API webhook telemetry.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="telemetry-toast-alert" role="alert">
          <div className="toast-left">
            <CheckCircle size={16} className="toast-check-icon" />
            <span>{toastMessage}</span>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="telemetry-filter-bar">
        <div className="telemetry-search-wrapper">
          <Search size={16} className="telemetry-search-icon" />
          <input
            id="telemetry-search-input"
            type="text"
            className="telemetry-search-input"
            placeholder="Search by Session ID, Caller CLI, Agent, or Channel..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="telemetry-dropdown-group">
          {/* Channel Filter Dropdown */}
          <div className="telemetry-dropdown-wrapper">
            <select
              id="telemetry-channel-select"
              className="telemetry-select telemetry-channel-select"
              value={channelFilter}
              onChange={(e) => {
                setChannelFilter(e.target.value as any);
                setCurrentPage(1);
              }}
            >
              <option value="All Channels">All Channels</option>
              <option value="SIP Logs">SIP Logs</option>
              <option value="API Logs">API Logs</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow-icon" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="telemetry-dropdown-wrapper">
            <select
              id="telemetry-status-select"
              className="telemetry-select telemetry-status-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Connected">Connected</option>
              <option value="Completed">Completed</option>
              <option value="Transferred">Transferred</option>
              <option value="Failed">Failed</option>
            </select>
            <ChevronDown size={14} className="dropdown-arrow-icon" />
          </div>
        </div>

        <div className="telemetry-total-calls-badge">
          248,912 Total Calls
        </div>
      </div>

      {/* Main Telemetry Table */}
      <div className="telemetry-table-container">
        <table className="telemetry-table">
          <thead>
            <tr>
              <th className="th-session">SESSION ID &amp; TIME</th>
              <th className="th-channel">CHANNEL</th>
              <th className="th-caller">CALLER (DID)</th>
              <th className="th-agent">VOICE AGENT</th>
              <th className="th-duration">DURATION</th>
              <th className="th-latency">LATENCY</th>
              <th className="th-status">STATUS</th>
              <th className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="telemetry-no-results">
                  No matching telemetry records found.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => {
                const isConnected = log.status === 'Connected';
                const isCompleted = log.status === 'Completed';
                const isTransferred = log.status === 'Transferred';
                const isFailed = log.status === 'Failed';
                const formattedId = formatSessionId(log.sessionId, log.channel);

                return (
                  <tr key={log.id} className="telemetry-row">
                    {/* Session ID & Time */}
                    <td className="td-session">
                      <button
                        className="session-id-link"
                        onClick={() => setSelectedLog(log)}
                        title={`Inspect ${log.channel} Session ${formattedId}`}
                      >
                        {formattedId}
                      </button>
                      <span className="session-time-sub">{log.timestamp}</span>
                    </td>

                    {/* Channel Badge */}
                    <td className="td-channel">
                      {log.channel === 'SIP' ? (
                        <span className="telemetry-channel-badge sip" title="SIP Telephony Channel">
                          <Radio size={12} className="channel-badge-icon" />
                          <span>SIP</span>
                        </span>
                      ) : (
                        <span className="telemetry-channel-badge api" title="API Webhook Channel">
                          <Webhook size={12} className="channel-badge-icon" />
                          <span>API</span>
                        </span>
                      )}
                    </td>

                    {/* Caller (DID) */}
                    <td className="td-caller">
                      <span className="caller-did-mono">{log.callerDid}</span>
                    </td>

                    {/* Voice Agent */}
                    <td className="td-agent">
                      <span className="agent-name-text">{log.voiceAgent}</span>
                    </td>

                    {/* Duration */}
                    <td className="td-duration">
                      <span className="duration-mono">{log.duration}</span>
                    </td>

                    {/* Latency */}
                    <td className="td-latency">
                      <span
                        className={`latency-mono ${
                          log.latencyMs <= 720
                            ? 'latency-good'
                            : log.latencyMs <= 800
                            ? 'latency-moderate'
                            : 'latency-high'
                        }`}
                      >
                        {log.latencyMs} ms
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="td-status">
                      {isConnected && (
                        <span className="status-pill status-connected">
                          <span className="status-pulse-dot" />
                          Connected
                        </span>
                      )}
                      {isCompleted && (
                        <span className="status-pill status-completed">
                          Completed
                        </span>
                      )}
                      {isTransferred && (
                        <span className="status-pill status-transferred">
                          Transferred
                        </span>
                      )}
                      {isFailed && (
                        <span className="status-pill status-failed">
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="td-action">
                      <button
                        className="btn-view-details"
                        onClick={() => setSelectedLog(log)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table Footer with Edge Stream Health & Pagination */}
        <div className="telemetry-table-footer">
          <div className="footer-records-count">
            Showing <strong>{filteredLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, filteredLogs.length)}</strong> of <strong>{filteredLogs.length}</strong> Telemetry Records
          </div>

          <div className="footer-stream-health">
            <span className="health-dot" />
            <span>Real-time voice stream healthy across all 4 edge gateway nodes</span>
          </div>

          <div className="telemetry-pagination">
            <button
              className="pagination-btn pagination-nav-prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn pagination-num ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-btn pagination-nav-next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Call Detail Record (CDR) & Telemetry Modal */}
      {selectedLog && (
        <div className="telemetry-modal-overlay" onClick={() => setSelectedLog(null)}>
          <div
            className="telemetry-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div className="modal-header-titles">
                <div className="modal-session-tag">
                  <Activity size={16} />
                  <span>{selectedLog.channel} SESSION TELEMETRY DETAIL</span>
                </div>
                <div className="modal-session-row">
                  <h2 className="modal-session-id">
                    {formatSessionId(selectedLog.sessionId, selectedLog.channel)}
                  </h2>
                  <span className={`telemetry-channel-badge ${selectedLog.channel.toLowerCase()}`}>
                    {selectedLog.channel === 'SIP' ? (
                      <Radio size={12} className="channel-badge-icon" />
                    ) : (
                      <Webhook size={12} className="channel-badge-icon" />
                    )}
                    <span>{selectedLog.channel}</span>
                  </span>
                </div>
                <span className="modal-session-time">{selectedLog.timestamp}</span>
              </div>
              <button
                className="modal-close-icon-btn"
                onClick={() => setSelectedLog(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Top Quick Status Pill & Node */}
              <div className="modal-quick-stats">
                <div className="stat-pill-box">
                  <span className="stat-pill-label">Channel</span>
                  <span className={`telemetry-channel-badge ${selectedLog.channel.toLowerCase()}`}>
                    {selectedLog.channel === 'SIP' ? (
                      <Radio size={11} className="channel-badge-icon" />
                    ) : (
                      <Webhook size={11} className="channel-badge-icon" />
                    )}
                    <span>{selectedLog.channel}</span>
                  </span>
                </div>
                <div className="stat-pill-box">
                  <span className="stat-pill-label">Status</span>
                  <span
                    className={`status-pill ${
                      selectedLog.status === 'Connected'
                        ? 'status-connected'
                        : selectedLog.status === 'Completed'
                        ? 'status-completed'
                        : selectedLog.status === 'Transferred'
                        ? 'status-transferred'
                        : 'status-failed'
                    }`}
                  >
                    {selectedLog.status === 'Connected' && <span className="status-pulse-dot" />}
                    {selectedLog.status}
                  </span>
                </div>
                <div className="stat-pill-box">
                  <span className="stat-pill-label">Roundtrip Latency</span>
                  <span className="stat-pill-value stat-latency-value">
                    <Zap size={14} />
                    {selectedLog.latencyMs} ms
                  </span>
                </div>
                <div className="stat-pill-box">
                  <span className="stat-pill-label">Gateway / Node</span>
                  <span className="stat-pill-value mono">
                    {selectedLog.gatewayNode || 'COLOMBO-EDGE-01'}
                  </span>
                </div>
                <div className="stat-pill-box">
                  <span className="stat-pill-label">MOS Audio Quality</span>
                  <span className="stat-pill-value mos-val">
                    {selectedLog.mosScore ? `${selectedLog.mosScore} / 5.0` : '4.42 / 5.0'}
                  </span>
                </div>
              </div>

              {/* Grid 2-column specifications */}
              <div className="modal-details-grid">
                <div className="detail-column-card">
                  <h4 className="detail-section-title">
                    <Phone size={14} />
                    Telephony &amp; Routing
                  </h4>
                  <div className="detail-row">
                    <span className="detail-key">Caller DID (CLI):</span>
                    <span className="detail-val mono bold">{selectedLog.callerDid}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Assigned Voice Agent:</span>
                    <span className="detail-val">{selectedLog.voiceAgent}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Call Duration:</span>
                    <span className="detail-val mono">{selectedLog.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">
                      {selectedLog.channel === 'SIP' ? 'SIP Signaling Status:' : 'API Response Status:'}
                    </span>
                    <span className="detail-val mono sip-code-val">
                      {selectedLog.sipCode || '200 OK'}
                    </span>
                  </div>
                </div>

                <div className="detail-column-card">
                  <h4 className="detail-section-title">
                    <Radio size={14} />
                    Stream &amp; Media Transport
                  </h4>
                  <div className="detail-row">
                    <span className="detail-key">Negotiated Codec:</span>
                    <span className="detail-val mono">{selectedLog.codec || 'Opus 48kHz HD'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Packet Loss:</span>
                    <span className="detail-val mono">{selectedLog.packetLoss || '0.01%'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Jitter Buffer:</span>
                    <span className="detail-val mono">{selectedLog.jitter || '1.1 ms'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-key">Transport Security:</span>
                    <span className="detail-val tls-tag">
                      {selectedLog.channel === 'SIP' ? 'SRTP / TLS 1.3 Secure' : 'HTTPS / TLS 1.3 Webhook'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signaling Trace & Dialogue */}
              {selectedLog.transcriptPreview && (
                <div className="modal-transcript-card">
                  <h4 className="detail-section-title">
                    <Activity size={14} />
                    Live Speech-to-Text Conversation Stream
                  </h4>
                  <div className="transcript-chat-list">
                    {selectedLog.transcriptPreview.map((item, idx) => (
                      <div
                        key={idx}
                        className={`transcript-bubble ${
                          item.speaker === 'Caller' ? 'caller' : 'agent'
                        }`}
                      >
                        <span className="bubble-speaker">{item.speaker}</span>
                        <p className="bubble-text">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-action-subtle"
                onClick={() =>
                  handleCopySessionId(formatSessionId(selectedLog.sessionId, selectedLog.channel))
                }
              >
                <Copy size={14} />
                <span>
                  {copiedId === formatSessionId(selectedLog.sessionId, selectedLog.channel)
                    ? 'Copied!'
                    : 'Copy Session ID'}
                </span>
              </button>
              <button
                className="btn-modal-action-primary"
                onClick={() => setSelectedLog(null)}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
