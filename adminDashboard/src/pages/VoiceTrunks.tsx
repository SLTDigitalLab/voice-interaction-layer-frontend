import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  X,
  Server,
  Radio,
  Landmark,
  Building2,
  Cloud,
  CheckCircle,
  Activity,
  Shield,
  MoreVertical,
  Settings,
  VolumeX,
  Trash2,
  AlertTriangle,
  Webhook,
} from 'lucide-react';

export type ConnectionType = 'SIP' | 'API Webhook';

export interface SipTrunkItem {
  id: string;
  name: string;
  carrier: string;
  connectionType: ConnectionType;
  hostIp: string;
  port: number;
  webhookUrl?: string;
  authMethod?: string;
  webhookSecret?: string;
  eventFormat?: string;
  usedCapacity: number;
  totalCapacity: number;
  status: 'Active' | 'Standby' | 'Degraded';
  iconType: 'server' | 'radio' | 'billing' | 'enterprise' | 'cloud' | 'webhook';
  transport?: 'UDP' | 'TCP' | 'TLS';
  codecs?: string[];
  latency?: string;
}

export const initialTrunks: SipTrunkItem[] = [
  {
    id: 'trunk-1',
    name: 'Colombo-Metro-Core-01',
    carrier: 'SLT Metro Core',
    connectionType: 'SIP',
    hostIp: '192.168.10.25',
    port: 5061,
    usedCapacity: 840,
    totalCapacity: 1500,
    status: 'Active',
    iconType: 'server',
    transport: 'TLS',
    codecs: ['G.711a', 'Opus', 'G.729'],
    latency: '14ms',
  },
  {
    id: 'trunk-2',
    name: 'Mobitel-LTE-IMS-01',
    carrier: 'Mobitel LTE / IMS',
    connectionType: 'SIP',
    hostIp: '10.240.12.8',
    port: 5060,
    usedCapacity: 620,
    totalCapacity: 1200,
    status: 'Active',
    iconType: 'radio',
    transport: 'UDP',
    codecs: ['AMR-WB', 'G.711a', 'Opus'],
    latency: '18ms',
  },
  {
    id: 'trunk-3',
    name: 'Colombo-Billing-GW-02',
    carrier: 'Colombo Billing Core',
    connectionType: 'API Webhook',
    hostIp: 'billing-api.slt.lk',
    port: 443,
    webhookUrl: 'https://billing-api.slt.lk/v2/voice-sessions',
    authMethod: 'Bearer Token (HMAC-SHA256)',
    eventFormat: 'Bidirectional Voice Events',
    usedCapacity: 412,
    totalCapacity: 800,
    status: 'Active',
    iconType: 'billing',
    transport: 'TLS',
    codecs: ['G.711a', 'G.711u'],
    latency: '12ms',
  },
  {
    id: 'trunk-4',
    name: 'Enterprise-SIP-LK',
    carrier: 'Enterprise SIP LK',
    connectionType: 'SIP',
    hostIp: '172.22.4.10',
    port: 5060,
    usedCapacity: 320,
    totalCapacity: 1000,
    status: 'Active',
    iconType: 'enterprise',
    transport: 'TCP',
    codecs: ['G.711a', 'G.729', 'Opus'],
    latency: '22ms',
  },
  {
    id: 'trunk-5',
    name: 'Kandy-DR-Backup-01',
    carrier: 'Disaster Recovery',
    connectionType: 'SIP',
    hostIp: '192.168.99.12',
    port: 5060,
    usedCapacity: 0,
    totalCapacity: 500,
    status: 'Standby',
    iconType: 'cloud',
    transport: 'UDP',
    codecs: ['G.711a', 'Opus'],
    latency: '34ms',
  },
  {
    id: 'trunk-6',
    name: 'Galle-Regional-SBC-01',
    carrier: 'SLT Metro Core',
    connectionType: 'SIP',
    hostIp: '192.168.32.15',
    port: 5060,
    usedCapacity: 185,
    totalCapacity: 600,
    status: 'Active',
    iconType: 'server',
    transport: 'TLS',
    codecs: ['G.711a', 'Opus'],
    latency: '26ms',
  },
  {
    id: 'trunk-7',
    name: 'Mobitel-5G-VoiceCore-02',
    carrier: 'Mobitel LTE / IMS',
    connectionType: 'API Webhook',
    hostIp: 'voicecore.mobitel.lk',
    port: 8443,
    webhookUrl: 'https://voicecore.mobitel.lk/api/v1/call-control',
    authMethod: 'mTLS & API Key',
    eventFormat: 'Call Control & Signaling',
    usedCapacity: 490,
    totalCapacity: 1000,
    status: 'Active',
    iconType: 'radio',
    transport: 'TLS',
    codecs: ['AMR-WB', 'Opus'],
    latency: '15ms',
  },
  {
    id: 'trunk-8',
    name: 'Jaffna-Edge-Node-01',
    carrier: 'SLT Metro Core',
    connectionType: 'SIP',
    hostIp: '192.168.75.10',
    port: 5060,
    usedCapacity: 95,
    totalCapacity: 400,
    status: 'Active',
    iconType: 'server',
    transport: 'UDP',
    codecs: ['G.711a', 'G.729'],
    latency: '42ms',
  },
  {
    id: 'trunk-9',
    name: 'SLT-Cloud-IVR-Gateway',
    carrier: 'SLT Metro Core',
    connectionType: 'API Webhook',
    hostIp: 'ivr-events.slt.lk',
    port: 443,
    webhookUrl: 'https://ivr-events.slt.lk/webhook/v1/inbound-audio',
    authMethod: 'Bearer Token',
    eventFormat: 'WebSocket Audio Stream',
    usedCapacity: 210,
    totalCapacity: 500,
    status: 'Active',
    iconType: 'cloud',
    transport: 'TLS',
    codecs: ['Opus', 'PCM'],
    latency: '19ms',
  },
];

export default function VoiceTrunks() {
  const [trunks, setTrunks] = useState<SipTrunkItem[]>(initialTrunks);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [carrierFilter, setCarrierFilter] = useState('All Carriers');
  const [currentPage, setCurrentPage] = useState(1);
  const [configuredTrunk, setConfiguredTrunk] = useState<SipTrunkItem | null>(null);
  const [editFormState, setEditFormState] = useState<SipTrunkItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMenuTrunkId, setActiveMenuTrunkId] = useState<string | null>(null);
  const [deleteConfirmTrunk, setDeleteConfirmTrunk] = useState<SipTrunkItem | null>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuTrunkId(null);
    if (activeMenuTrunkId) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [activeMenuTrunkId]);

  // Open Configure Modal and initialize edit state
  const handleOpenConfigure = (trunk: SipTrunkItem) => {
    setActiveMenuTrunkId(null);
    setConfiguredTrunk(trunk);
    setEditFormState({ ...trunk });
  };

  // Handle Drain / Mute Trunk
  const handleDrainTrunk = (trunk: SipTrunkItem) => {
    setActiveMenuTrunkId(null);
    const isNowDrained = trunk.status === 'Active';
    setTrunks((prev) =>
      prev.map((t) =>
        t.id === trunk.id
          ? {
              ...t,
              status: isNowDrained ? 'Standby' : 'Active',
              usedCapacity: isNowDrained ? 0 : t.usedCapacity,
            }
          : t
      )
    );
    setToastMessage(
      isNowDrained
        ? `Trunk '${trunk.name}' is now draining: new calls will not be routed to it.`
        : `Trunk '${trunk.name}' routing has been resumed (Active).`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handle Delete Trunk confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirmTrunk) return;
    const name = deleteConfirmTrunk.name;
    setTrunks((prev) => prev.filter((t) => t.id !== deleteConfirmTrunk.id));
    if (configuredTrunk?.id === deleteConfirmTrunk.id) {
      setConfiguredTrunk(null);
      setEditFormState(null);
    }
    setDeleteConfirmTrunk(null);
    setToastMessage(`Trunk '${name}' deleted successfully.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // New trunk form state
  const [newConnectionType, setNewConnectionType] = useState<ConnectionType>('SIP');
  const [newTrunkName, setNewTrunkName] = useState('');
  const [newCarrier, setNewCarrier] = useState('SLT Metro Core');
  const [newTotalCapacity, setNewTotalCapacity] = useState(1000);

  // SIP specific fields
  const [newHostIp, setNewHostIp] = useState('');
  const [newPort, setNewPort] = useState(5060);
  const [newTransport, setNewTransport] = useState<'UDP' | 'TCP' | 'TLS'>('TLS');

  // API Webhook specific fields
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newAuthMethod, setNewAuthMethod] = useState('Bearer Token');
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [newEventFormat, setNewEventFormat] = useState('Bidirectional Voice Events');

  const itemsPerPage = 5;

  // Filter trunks
  const filteredTrunks = useMemo(() => {
    return trunks.filter((trunk) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        trunk.name.toLowerCase().includes(q) ||
        (trunk.hostIp && trunk.hostIp.toLowerCase().includes(q)) ||
        (trunk.webhookUrl && trunk.webhookUrl.toLowerCase().includes(q)) ||
        `${trunk.hostIp}:${trunk.port}`.includes(q) ||
        trunk.connectionType.toLowerCase().includes(q);

      const matchesCarrier =
        carrierFilter === 'All Carriers' || trunk.carrier === carrierFilter;

      const matchesChannel =
        channelFilter === 'All Channels' ||
        (channelFilter === 'SIP Trunks' && trunk.connectionType === 'SIP') ||
        (channelFilter === 'API Webhooks' && trunk.connectionType === 'API Webhook');

      return matchesSearch && matchesCarrier && matchesChannel;
    });
  }, [trunks, searchQuery, carrierFilter, channelFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTrunks.length / itemsPerPage));

  const paginatedTrunks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrunks.slice(start, start + itemsPerPage);
  }, [filteredTrunks, currentPage]);

  const renderTrunkIcon = (
    type: SipTrunkItem['iconType'],
    status: SipTrunkItem['status'],
    connectionType?: ConnectionType
  ) => {
    const isMuted = status === 'Standby';
    const colorClass = isMuted
      ? 'trunk-icon-muted'
      : connectionType === 'API Webhook'
      ? 'trunk-icon-purple'
      : 'trunk-icon-blue';

    if (connectionType === 'API Webhook' && (!type || type === 'webhook' || type === 'server')) {
      return <Webhook size={18} className={colorClass} />;
    }

    switch (type) {
      case 'webhook':
        return <Webhook size={18} className={colorClass} />;
      case 'server':
        return <Server size={18} className={colorClass} />;
      case 'radio':
        return <Radio size={18} className={colorClass} />;
      case 'billing':
        return <Landmark size={18} className={colorClass} />;
      case 'enterprise':
        return <Building2 size={18} className={colorClass} />;
      case 'cloud':
        return <Cloud size={18} className={colorClass} />;
      default:
        return <Server size={18} className={colorClass} />;
    }
  };

  const handleAddTrunkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrunkName.trim()) return;

    if (newConnectionType === 'SIP' && !newHostIp.trim()) {
      return;
    }
    if (newConnectionType === 'API Webhook' && !newWebhookUrl.trim()) {
      return;
    }

    // Extract hostname if webhook
    let derivedHost = newHostIp.trim();
    if (newConnectionType === 'API Webhook') {
      try {
        const parsed = new URL(newWebhookUrl);
        derivedHost = parsed.hostname;
      } catch {
        derivedHost = newWebhookUrl.replace(/^https?:\/\//, '').split('/')[0] || 'api.slt.lk';
      }
    }

    const created: SipTrunkItem = {
      id: `trunk-${Date.now()}`,
      name: newTrunkName.trim(),
      carrier: newCarrier,
      connectionType: newConnectionType,
      hostIp: newConnectionType === 'SIP' ? newHostIp.trim() : derivedHost,
      port: newConnectionType === 'SIP' ? Number(newPort) || 5060 : 443,
      webhookUrl: newConnectionType === 'API Webhook' ? newWebhookUrl.trim() : undefined,
      authMethod: newConnectionType === 'API Webhook' ? newAuthMethod : undefined,
      webhookSecret: newConnectionType === 'API Webhook' ? newWebhookSecret.trim() : undefined,
      eventFormat: newConnectionType === 'API Webhook' ? newEventFormat : undefined,
      usedCapacity: 0,
      totalCapacity: Number(newTotalCapacity) || 1000,
      status: 'Active',
      iconType: newConnectionType === 'API Webhook' ? 'webhook' : 'server',
      transport: newConnectionType === 'SIP' ? newTransport : 'TLS',
      codecs: newConnectionType === 'SIP' ? ['G.711a', 'Opus'] : ['Opus', 'PCM'],
      latency: newConnectionType === 'SIP' ? '15ms' : '18ms',
    };

    setTrunks([created, ...trunks]);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTrunkName('');
    setNewHostIp('');
    setNewPort(5060);
    setNewWebhookUrl('');
    setNewWebhookSecret('');
    setNewConnectionType('SIP');

    setToastMessage(
      `${created.connectionType === 'SIP' ? 'SIP Trunk' : 'API Webhook'} '${created.name}' connected successfully.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleToggleStatus = (id: string) => {
    setTrunks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Active' ? 'Standby' : 'Active';
          return {
            ...t,
            status: nextStatus,
            usedCapacity: nextStatus === 'Standby' ? 0 : t.usedCapacity,
          };
        }
        return t;
      })
    );

    if (configuredTrunk && configuredTrunk.id === id) {
      const nextStatus = configuredTrunk.status === 'Active' ? 'Standby' : 'Active';
      setConfiguredTrunk((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              usedCapacity: nextStatus === 'Standby' ? 0 : prev.usedCapacity,
            }
          : null
      );
      setEditFormState((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              usedCapacity: nextStatus === 'Standby' ? 0 : prev.usedCapacity,
            }
          : null
      );
    }
  };

  // Save changes from Edit / Configure modal
  const handleSaveConfiguredTrunk = () => {
    if (!editFormState) return;

    setTrunks((prev) =>
      prev.map((t) => (t.id === editFormState.id ? { ...editFormState } : t))
    );
    setToastMessage(
      `Trunk '${editFormState.name}' (${editFormState.connectionType}) updated successfully.`
    );
    setConfiguredTrunk(null);
    setEditFormState(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="trunks-page">
      {/* Breadcrumb */}
      <div className="trunks-breadcrumb">
        <span className="breadcrumb-parent">Core Telephony</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-parent">Infrastructure</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">Voice Trunks &amp; SIP</span>
      </div>

      {/* Header */}
      <div className="trunks-header">
        <div>
          <h1 className="trunks-title">Voice Trunks &amp; SIP</h1>
          <p className="trunks-subtitle">
            Manage SIP trunk connections, API webhooks, carrier gateways, and allocated DID blocks across enterprise nodes.
          </p>
        </div>
        <button
          id="btn-add-trunk"
          className="btn-add-trunk"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Trunk</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="trunks-toast-alert" role="alert">
          <div className="toast-left">
            <div className="toast-icon-circle">
              <CheckCircle size={16} />
            </div>
            <div className="toast-text-group">
              <span className="toast-headline">Success</span>
              <span className="toast-body">{toastMessage}</span>
            </div>
          </div>
          <button
            className="toast-close-btn"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Toolbar / Search & Filter */}
      <div className="trunks-toolbar">
        <div className="trunks-search-box">
          <Search size={16} className="trunks-search-icon" />
          <input
            id="trunks-search-input"
            type="text"
            placeholder="Search trunks by name, IP, or webhook..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="trunks-filters-group">
          {/* Channel Filter Dropdown */}
          <div className="trunks-filter-dropdown">
            <select
              id="trunks-channel-select"
              className="filter-select channel-select"
              value={channelFilter}
              onChange={(e) => {
                setChannelFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All Channels">All Channels</option>
              <option value="SIP Trunks">SIP Trunks</option>
              <option value="API Webhooks">API Webhooks</option>
            </select>
            <ChevronDown size={14} className="filter-dropdown-arrow" />
          </div>

          {/* Carrier Filter Dropdown */}
          <div className="trunks-filter-dropdown">
            <select
              id="trunks-carrier-select"
              className="filter-select carrier-select"
              value={carrierFilter}
              onChange={(e) => {
                setCarrierFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All Carriers">All Carriers</option>
              <option value="SLT Metro Core">SLT Metro Core</option>
              <option value="Mobitel LTE / IMS">Mobitel LTE / IMS</option>
              <option value="Colombo Billing Core">Colombo Billing Core</option>
              <option value="Enterprise SIP LK">Enterprise SIP LK</option>
              <option value="Disaster Recovery">Disaster Recovery</option>
            </select>
            <ChevronDown size={14} className="filter-dropdown-arrow" />
          </div>
        </div>
      </div>

      {/* Trunks Table Card */}
      <div className="trunks-table-card">
        <table className="trunks-table">
          <thead>
            <tr>
              <th className="col-trunk-name">Trunk Name</th>
              <th className="col-channel">Channel</th>
              <th className="col-host">Host / Endpoint</th>
              <th className="col-capacity">Capacity</th>
              <th className="col-status">Status</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrunks.length > 0 ? (
              paginatedTrunks.map((trunk) => (
                <tr key={trunk.id} className="trunks-table-row">
                  {/* Trunk Name */}
                  <td className="col-trunk-name">
                    <div className="trunk-identity">
                      <div className="trunk-icon-box">
                        {renderTrunkIcon(trunk.iconType, trunk.status, trunk.connectionType)}
                      </div>
                      <div className="trunk-name-group">
                        <span className="trunk-name-text">{trunk.name}</span>
                        <span className="trunk-carrier-sub">{trunk.carrier}</span>
                      </div>
                    </div>
                  </td>

                  {/* Channel / Connection Type Badge */}
                  <td className="col-channel">
                    {trunk.connectionType === 'SIP' ? (
                      <span className="trunk-channel-badge sip" title="Session Initiation Protocol Trunk">
                        <Radio size={12} className="badge-icon" />
                        <span>SIP</span>
                      </span>
                    ) : (
                      <span className="trunk-channel-badge webhook" title="REST API / Webhook Event Channel">
                        <Webhook size={12} className="badge-icon" />
                        <span>API Webhook</span>
                      </span>
                    )}
                  </td>

                  {/* Host / Endpoint */}
                  <td className="col-host">
                    {trunk.connectionType === 'SIP' ? (
                      <span className="trunk-host-text font-mono">
                        {trunk.hostIp}:{trunk.port}
                      </span>
                    ) : (
                      <span
                        className="trunk-host-text trunk-webhook-endpoint font-mono"
                        title={trunk.webhookUrl || `${trunk.hostIp}:${trunk.port}`}
                      >
                        {trunk.webhookUrl ? trunk.webhookUrl.replace(/^https?:\/\//, '') : `${trunk.hostIp}:${trunk.port}`}
                      </span>
                    )}
                  </td>

                  {/* Capacity */}
                  <td className="col-capacity">
                    <span className="trunk-capacity-text">
                      <strong>{trunk.usedCapacity}</strong>
                      <span className="capacity-total">
                        {' '}
                        / {trunk.totalCapacity.toLocaleString()} Ch
                      </span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="col-status">
                    <span className={`trunk-status-badge ${trunk.status.toLowerCase()}`}>
                      <span className="status-dot" />
                      {trunk.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="col-action">
                    <div className="trunk-action-group">
                      <button
                        className="btn-trunk-configure"
                        onClick={() => handleOpenConfigure(trunk)}
                      >
                        Configure
                      </button>
                      <div className="trunk-menu-container">
                        <button
                          className="btn-trunk-menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuTrunkId(
                              activeMenuTrunkId === trunk.id ? null : trunk.id
                            );
                          }}
                          title="Trunk options"
                          aria-label="Trunk options"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuTrunkId === trunk.id && (
                          <div
                            className="trunk-context-menu"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="context-menu-item"
                              onClick={() => handleOpenConfigure(trunk)}
                            >
                              <Settings size={14} />
                              <span>Edit Settings</span>
                            </button>
                            <button
                              className="context-menu-item"
                              onClick={() => handleDrainTrunk(trunk)}
                            >
                              <VolumeX size={14} />
                              <span>
                                {trunk.status === 'Active'
                                  ? 'Drain / Mute Trunk'
                                  : 'Unmute / Resume Trunk'}
                              </span>
                            </button>
                            <div className="context-menu-divider" />
                            <button
                              className="context-menu-item text-danger"
                              onClick={() => {
                                setActiveMenuTrunkId(null);
                                setDeleteConfirmTrunk(trunk);
                              }}
                            >
                              <Trash2 size={14} />
                              <span>Delete Trunk</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="trunks-empty-state">
                  No voice trunks found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer / Pagination */}
        <div className="trunks-table-footer">
          <div className="trunks-footer-info">
            Showing <span className="highlight-num">{paginatedTrunks.length}</span> of{' '}
            <span className="highlight-num">{filteredTrunks.length}</span> registered Voice Trunks
          </div>

          <div className="trunks-pagination">
            <button
              className="pagination-btn pagination-nav"
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
                  className={`pagination-btn pagination-page ${
                    currentPage === pageNum ? 'active' : ''
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="pagination-btn pagination-nav"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Configure / Edit Trunk Modal */}
      {configuredTrunk && editFormState && (
        <div
          className="trunk-modal-backdrop"
          onClick={() => {
            setConfiguredTrunk(null);
            setEditFormState(null);
          }}
        >
          <div
            className="trunk-modal-content trunk-config-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trunk-modal-header">
              <div className="trunk-modal-title-group">
                <div
                  className={`trunk-modal-icon-badge ${
                    editFormState.connectionType === 'API Webhook' ? 'badge-purple' : ''
                  }`}
                >
                  {renderTrunkIcon(
                    editFormState.iconType,
                    editFormState.status,
                    editFormState.connectionType
                  )}
                </div>
                <div>
                  <div className="config-header-row">
                    <h3 className="trunk-modal-title">{configuredTrunk.name}</h3>
                    <span
                      className={`trunk-channel-badge ${
                        editFormState.connectionType === 'SIP' ? 'sip' : 'webhook'
                      }`}
                    >
                      {editFormState.connectionType}
                    </span>
                  </div>
                  <p className="trunk-modal-subtitle">
                    {configuredTrunk.carrier} &bull;{' '}
                    {editFormState.connectionType === 'SIP'
                      ? `${editFormState.hostIp}:${editFormState.port}`
                      : editFormState.webhookUrl || editFormState.hostIp}
                  </p>
                </div>
              </div>
              <button
                className="trunk-modal-close"
                onClick={() => {
                  setConfiguredTrunk(null);
                  setEditFormState(null);
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="trunk-modal-body">
              {/* Capacity Progress Bar */}
              <div className="trunk-stat-bar-box">
                <div className="trunk-stat-bar-header">
                  <span>Channel Utilization</span>
                  <span className="font-mono">
                    {editFormState.usedCapacity} / {editFormState.totalCapacity} Ch (
                    {Math.round(
                      (editFormState.usedCapacity / Math.max(1, editFormState.totalCapacity)) * 100
                    )}
                    %)
                  </span>
                </div>
                <div className="trunk-meter-track">
                  <div
                    className="trunk-meter-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        (editFormState.usedCapacity / Math.max(1, editFormState.totalCapacity)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Connection Type Switcher */}
              <div className="form-group mb-4">
                <label className="form-label">Connection Type</label>
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-toggle-btn ${
                      editFormState.connectionType === 'SIP' ? 'active' : ''
                    }`}
                    onClick={() =>
                      setEditFormState({ ...editFormState, connectionType: 'SIP' })
                    }
                  >
                    <Radio size={16} />
                    <div className="type-toggle-text">
                      <span className="type-toggle-title">SIP Trunk</span>
                      <span className="type-toggle-desc">SBC Signaling Host &amp; Port</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${
                      editFormState.connectionType === 'API Webhook' ? 'active' : ''
                    }`}
                    onClick={() =>
                      setEditFormState({ ...editFormState, connectionType: 'API Webhook' })
                    }
                  >
                    <Webhook size={16} />
                    <div className="type-toggle-text">
                      <span className="type-toggle-title">API Webhook</span>
                      <span className="type-toggle-desc">HTTP REST Callback Endpoint</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* General Fields */}
              <div className="form-row">
                <div className="form-group flex-2">
                  <label className="form-label">Trunk Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editFormState.name}
                    onChange={(e) =>
                      setEditFormState({ ...editFormState, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Carrier Group</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select"
                      value={editFormState.carrier}
                      onChange={(e) =>
                        setEditFormState({ ...editFormState, carrier: e.target.value })
                      }
                    >
                      <option value="SLT Metro Core">SLT Metro Core</option>
                      <option value="Mobitel LTE / IMS">Mobitel LTE / IMS</option>
                      <option value="Colombo Billing Core">Colombo Billing Core</option>
                      <option value="Enterprise SIP LK">Enterprise SIP LK</option>
                      <option value="Disaster Recovery">Disaster Recovery</option>
                    </select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                </div>
              </div>

              {/* Connection-Specific Configuration (Independent) */}
              {editFormState.connectionType === 'SIP' ? (
                /* SIP Configuration Details */
                <div className="config-channel-section">
                  <div className="section-divider-label">
                    <span>SIP Connection Settings</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-2">
                      <label className="form-label">Host IP / FQDN</label>
                      <input
                        type="text"
                        className="form-input font-mono"
                        value={editFormState.hostIp}
                        onChange={(e) =>
                          setEditFormState({ ...editFormState, hostIp: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">Port</label>
                      <input
                        type="number"
                        className="form-input font-mono"
                        value={editFormState.port}
                        onChange={(e) =>
                          setEditFormState({
                            ...editFormState,
                            port: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Transport Protocol</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={editFormState.transport || 'TLS'}
                          onChange={(e) =>
                            setEditFormState({
                              ...editFormState,
                              transport: e.target.value as 'UDP' | 'TCP' | 'TLS',
                            })
                          }
                        >
                          <option value="TLS">TLS (Encrypted SIP)</option>
                          <option value="UDP">UDP (Standard Telephony)</option>
                          <option value="TCP">TCP</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>
                    <div className="form-group flex-1">
                      <label className="form-label">Media Codecs</label>
                      <input
                        type="text"
                        className="form-input font-mono"
                        value={(editFormState.codecs || ['G.711a', 'Opus']).join(', ')}
                        onChange={(e) =>
                          setEditFormState({
                            ...editFormState,
                            codecs: e.target.value.split(',').map((s) => s.trim()),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* API Webhook Configuration Details */
                <div className="config-channel-section">
                  <div className="section-divider-label">
                    <span>API Webhook Settings</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Webhook Endpoint URL</label>
                    <input
                      type="url"
                      className="form-input font-mono"
                      placeholder="https://api.carrier.lk/v1/voice/webhook"
                      value={editFormState.webhookUrl || ''}
                      onChange={(e) =>
                        setEditFormState({ ...editFormState, webhookUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label className="form-label">Auth Method</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={editFormState.authMethod || 'Bearer Token'}
                          onChange={(e) =>
                            setEditFormState({
                              ...editFormState,
                              authMethod: e.target.value,
                            })
                          }
                        >
                          <option value="Bearer Token">Bearer Token</option>
                          <option value="API Key Header">API Key Header</option>
                          <option value="mTLS & API Key">mTLS &amp; API Key</option>
                          <option value="HMAC Signature">HMAC Signature</option>
                          <option value="None">None (Public)</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>

                    <div className="form-group flex-1">
                      <label className="form-label">Event Format</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={editFormState.eventFormat || 'Bidirectional Voice Events'}
                          onChange={(e) =>
                            setEditFormState({
                              ...editFormState,
                              eventFormat: e.target.value,
                            })
                          }
                        >
                          <option value="Bidirectional Voice Events">Bidirectional Voice Events</option>
                          <option value="Call Control & Signaling">Call Control &amp; Signaling</option>
                          <option value="WebSocket Audio Stream">WebSocket Audio Stream</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status and Capacity Controls */}
              <div className="form-row mt-3">
                <div className="form-group flex-1">
                  <label className="form-label">Max Channel Capacity</label>
                  <input
                    type="number"
                    className="form-input font-mono"
                    value={editFormState.totalCapacity}
                    onChange={(e) =>
                      setEditFormState({
                        ...editFormState,
                        totalCapacity: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Signaling Status</label>
                  <div className="trunk-status-toggle-row status-toggle-in-form">
                    <span className={`trunk-status-badge ${editFormState.status.toLowerCase()}`}>
                      <span className="status-dot" />
                      {editFormState.status}
                    </span>
                    <button
                      type="button"
                      className="btn-toggle-status"
                      onClick={() => handleToggleStatus(editFormState.id)}
                    >
                      Toggle to {editFormState.status === 'Active' ? 'Standby' : 'Active'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Latency and telemetry stats badge */}
              <div className="trunk-runtime-meta mt-3">
                <div className="meta-stat-item">
                  <Activity size={13} />
                  <span>Roundtrip Latency:</span>
                  <strong className="font-mono text-green">{editFormState.latency || '15ms'}</strong>
                </div>
                <div className="meta-stat-item">
                  <Shield size={13} />
                  <span>Security:</span>
                  <strong>{editFormState.connectionType === 'SIP' ? 'TLS v1.3' : 'HTTPS / TLS'}</strong>
                </div>
              </div>
            </div>

            <div className="trunk-modal-footer space-between">
              <button
                type="button"
                className="btn-modal-danger"
                onClick={() => setDeleteConfirmTrunk(configuredTrunk)}
              >
                <Trash2 size={14} />
                <span>Delete Trunk</span>
              </button>
              <div className="modal-footer-right">
                <button
                  type="button"
                  className="btn-modal-dismiss"
                  onClick={() => {
                    setConfiguredTrunk(null);
                    setEditFormState(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal-primary"
                  onClick={handleSaveConfiguredTrunk}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Trunk Modal */}
      {isAddModalOpen && (
        <div
          className="trunk-modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="trunk-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleAddTrunkSubmit}>
              <div className="trunk-modal-header">
                <div className="trunk-modal-title-group">
                  <div
                    className={`trunk-modal-icon-badge ${
                      newConnectionType === 'API Webhook' ? 'badge-purple' : ''
                    }`}
                  >
                    {newConnectionType === 'API Webhook' ? <Webhook size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h3 className="trunk-modal-title">
                      Connect New {newConnectionType === 'SIP' ? 'SIP Trunk' : 'API Webhook'}
                    </h3>
                    <p className="trunk-modal-subtitle">
                      {newConnectionType === 'SIP'
                        ? 'Register external carrier SBC signaling endpoint'
                        : 'Register external HTTP voice event webhook channel'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="trunk-modal-close"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="trunk-modal-body">
                {/* Connection Type Selector */}
                <div className="form-group mb-4">
                  <label className="form-label">
                    Connection Type <span className="required">*</span>
                  </label>
                  <div className="type-toggle-group">
                    <button
                      type="button"
                      className={`type-toggle-btn ${newConnectionType === 'SIP' ? 'active' : ''}`}
                      onClick={() => setNewConnectionType('SIP')}
                    >
                      <Radio size={16} />
                      <div className="type-toggle-text">
                        <span className="type-toggle-title">SIP Trunk</span>
                        <span className="type-toggle-desc">SBC Signaling Host &amp; Port</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`type-toggle-btn ${
                        newConnectionType === 'API Webhook' ? 'active' : ''
                      }`}
                      onClick={() => setNewConnectionType('API Webhook')}
                    >
                      <Webhook size={16} />
                      <div className="type-toggle-text">
                        <span className="type-toggle-title">API Webhook</span>
                        <span className="type-toggle-desc">HTTP REST Callback Endpoint</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Common Fields */}
                <div className="form-group">
                  <label className="form-label">
                    Trunk Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={
                      newConnectionType === 'SIP'
                        ? 'e.g. Colombo-Metro-Core-03'
                        : 'e.g. SLT-Cloud-Voice-API'
                    }
                    value={newTrunkName}
                    onChange={(e) => setNewTrunkName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">
                      Carrier Group <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        className="form-select"
                        value={newCarrier}
                        onChange={(e) => setNewCarrier(e.target.value)}
                      >
                        <option value="SLT Metro Core">SLT Metro Core</option>
                        <option value="Mobitel LTE / IMS">Mobitel LTE / IMS</option>
                        <option value="Colombo Billing Core">Colombo Billing Core</option>
                        <option value="Enterprise SIP LK">Enterprise SIP LK</option>
                        <option value="Disaster Recovery">Disaster Recovery</option>
                      </select>
                      <ChevronDown size={14} className="select-icon" />
                    </div>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Max Channel Capacity</label>
                    <input
                      type="number"
                      className="form-input font-mono"
                      value={newTotalCapacity}
                      onChange={(e) => setNewTotalCapacity(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Independent Configuration based on connection type */}
                {newConnectionType === 'SIP' ? (
                  /* SIP-specific fields ONLY */
                  <div className="config-channel-section">
                    <div className="section-divider-label">
                      <span>SIP Configuration</span>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-2">
                        <label className="form-label">
                          Host IP / FQDN <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input font-mono"
                          placeholder="e.g. 192.168.10.45"
                          value={newHostIp}
                          onChange={(e) => setNewHostIp(e.target.value)}
                          required={newConnectionType === 'SIP'}
                        />
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">
                          Port <span className="required">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-input font-mono"
                          value={newPort}
                          onChange={(e) => setNewPort(Number(e.target.value))}
                          required={newConnectionType === 'SIP'}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Transport Protocol</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={newTransport}
                          onChange={(e) =>
                            setNewTransport(e.target.value as 'UDP' | 'TCP' | 'TLS')
                          }
                        >
                          <option value="TLS">TLS (Encrypted SIP)</option>
                          <option value="UDP">UDP (Standard Telephony)</option>
                          <option value="TCP">TCP</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* API Webhook-specific fields ONLY */
                  <div className="config-channel-section">
                    <div className="section-divider-label">
                      <span>Webhook Configuration</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Webhook Endpoint URL <span className="required">*</span>
                      </label>
                      <input
                        type="url"
                        className="form-input font-mono"
                        placeholder="https://api.carrier.lk/v1/voice/webhook"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        required={newConnectionType === 'API Webhook'}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Auth Method</label>
                        <div className="select-wrapper">
                          <select
                            className="form-select"
                            value={newAuthMethod}
                            onChange={(e) => setNewAuthMethod(e.target.value)}
                          >
                            <option value="Bearer Token">Bearer Token</option>
                            <option value="API Key Header">API Key Header</option>
                            <option value="mTLS & API Key">mTLS &amp; API Key</option>
                            <option value="HMAC Signature">HMAC Signature</option>
                            <option value="None">None (Public)</option>
                          </select>
                          <ChevronDown size={14} className="select-icon" />
                        </div>
                      </div>

                      <div className="form-group flex-1">
                        <label className="form-label">Auth Secret / Token</label>
                        <input
                          type="password"
                          className="form-input font-mono"
                          placeholder="whsec_..."
                          value={newWebhookSecret}
                          onChange={(e) => setNewWebhookSecret(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Callback Mode</label>
                      <div className="select-wrapper">
                        <select
                          className="form-select"
                          value={newEventFormat}
                          onChange={(e) => setNewEventFormat(e.target.value)}
                        >
                          <option value="Bidirectional Voice Events">Bidirectional Voice Events</option>
                          <option value="Call Control & Signaling">Call Control &amp; Signaling</option>
                          <option value="WebSocket Audio Stream">WebSocket Audio Stream</option>
                        </select>
                        <ChevronDown size={14} className="select-icon" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="trunk-modal-footer">
                <button
                  type="button"
                  className="btn-modal-dismiss"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-primary">
                  Connect {newConnectionType === 'SIP' ? 'SIP Trunk' : 'Webhook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Trunk Confirmation Dialog */}
      {deleteConfirmTrunk && (
        <div
          className="trunk-modal-backdrop"
          onClick={() => setDeleteConfirmTrunk(null)}
        >
          <div
            className="trunk-modal-content delete-confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-dialog-header">
              <div className="delete-dialog-icon">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="delete-dialog-title">Delete Voice Trunk</h3>
                <p className="delete-dialog-sub">Permanently disconnect and deregister trunk connection</p>
              </div>
            </div>

            <div className="delete-dialog-body">
              <p className="delete-prompt-text">
                Are you sure you want to delete trunk <strong>{deleteConfirmTrunk.name}</strong> (
                <code>
                  {deleteConfirmTrunk.connectionType === 'SIP'
                    ? `${deleteConfirmTrunk.hostIp}:${deleteConfirmTrunk.port}`
                    : deleteConfirmTrunk.webhookUrl || deleteConfirmTrunk.hostIp}
                </code>
                )?
              </p>

              {deleteConfirmTrunk.usedCapacity > 0 ? (
                <div className="delete-capacity-warning">
                  <AlertTriangle size={16} className="warning-icon" />
                  <span>
                    <strong>Active Load Warning:</strong> This trunk currently handles{' '}
                    <strong>{deleteConfirmTrunk.usedCapacity} active calls</strong>. Deleting it will terminate
                    active audio streams immediately. Consider draining the trunk first.
                  </span>
                </div>
              ) : (
                <div className="delete-safe-notice">
                  <CheckCircle size={15} />
                  <span>This trunk currently has 0 active calls and is safe to remove.</span>
                </div>
              )}
            </div>

            <div className="delete-dialog-footer">
              <button
                type="button"
                className="btn-modal-dismiss"
                onClick={() => setDeleteConfirmTrunk(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-confirm-delete"
                onClick={handleConfirmDelete}
              >
                <Trash2 size={14} />
                <span>Delete Trunk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
